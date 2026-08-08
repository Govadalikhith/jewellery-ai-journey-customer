import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';
import { RuleEngine } from './ruleEngine.js';
import { AiEngine } from '../ai/aiEngine.js';
import { logAuditEvent } from '../middleware/audit.js';

export const RecommendationService = {
  async getRecommendations({ status = null, customerId = null, limit = 50 }) {
    let sql = `
      SELECT r.*, c.first_name, c.last_name, c.email, c.phone, c.tier, c.churn_risk_score,
             a.decision as approval_decision, a.override_reason, a.reviewed_at,
             u.first_name as reviewer_first_name, u.last_name as reviewer_last_name
      FROM recommendations r
      JOIN customers c ON r.customer_id = c.id
      LEFT JOIN approvals a ON a.recommendation_id = r.id
      LEFT JOIN users u ON a.reviewer_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      sql += ` AND r.status = $${params.length}`;
    }
    if (customerId) {
      params.push(customerId);
      sql += ` AND r.customer_id = $${params.length}`;
    }

    sql += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const res = await query(sql, params);
    return res.rows.map(row => ({
      ...row,
      evidence: typeof row.evidence === 'string' ? JSON.parse(row.evidence) : (row.evidence || [])
    }));
  },

  async generateForCustomer(customerId, actorUser = null) {
    const custRes = await query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
    if (custRes.rows.length === 0) throw new Error('Customer not found');
    const customer = custRes.rows[0];

    const jourRes = await query(`SELECT * FROM journeys WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 1`, [customerId]);
    const journey = jourRes.rows.length > 0 ? jourRes.rows[0] : {};

    const tktRes = await query(`SELECT * FROM service_tickets WHERE customer_id = $1 AND status IN ('open', 'in_progress')`, [customerId]);
    const tickets = tktRes.rows;

    // 1. Generate Raw Next Best Action from AI Engine
    const nba = await AiEngine.generateNextBestAction(customer, journey, tickets);

    // 2. Evaluate Deterministic Governance Rules
    const governance = await RuleEngine.evaluateOutreachEligibility(customerId, nba.channel);

    const recId = `rec_${uuidv4().substring(0, 8)}`;
    await query(
      `INSERT INTO recommendations (
        id, customer_id, journey_id, ticket_id, recommendation_type, recommended_action,
        channel, confidence_score, explanation, evidence, model_version, status,
        consent_verified, eligibility_verified, frequency_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        recId,
        customerId,
        journey.id || null,
        tickets.length > 0 ? tickets[0].id : null,
        nba.recommendationType || 'concierge_outreach',
        nba.recommendedAction,
        nba.channel || 'whatsapp',
        nba.confidence || 0.88,
        nba.explanation || 'Governance-verified VIP recommendation',
        JSON.stringify(nba.evidence || governance.checks.reasons),
        nba.modelVersion || 'Google Gemini 1.5 Flash',
        governance.eligible ? 'pending_review' : 'rejected',
        governance.checks.consentPassed,
        governance.checks.eligibilityPassed,
        governance.checks.frequencyPassed
      ]
    );

    if (actorUser) {
      await logAuditEvent({
        actorId: actorUser.id,
        actorName: `${actorUser.first_name} ${actorUser.last_name}`,
        actorRole: actorUser.role,
        action: 'AI_EXECUTION',
        entityType: 'recommendation',
        entityId: recId,
        newValue: { nba, governance }
      });
    }

    return {
      recommendationId: recId,
      ...nba,
      governance
    };
  },

  async approveRecommendation(recommendationId, actorUser, finalActionOverride = null) {
    const recRes = await query(`SELECT * FROM recommendations WHERE id = $1`, [recommendationId]);
    if (recRes.rows.length === 0) throw new Error('Recommendation not found');
    const rec = recRes.rows[0];

    const finalAction = finalActionOverride || rec.recommended_action;
    const apprId = `appr_${uuidv4().substring(0, 8)}`;

    // Update recommendation status
    await query(
      `UPDATE recommendations SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [recommendationId]
    );

    // Record approval
    await query(
      `INSERT INTO approvals (id, recommendation_id, reviewer_id, decision, override_reason, previous_recommendation, final_action_taken)
       VALUES ($1, $2, $3, 'approved', NULL, $4, $5)`,
      [apprId, recommendationId, actorUser.id, rec.recommended_action, finalAction]
    );

    // Update channel weekly counter
    await query(
      `UPDATE consents SET messages_sent_this_week = messages_sent_this_week + 1 
       WHERE customer_id = $1 AND channel = $2`,
      [rec.customer_id, rec.channel]
    );

    await logAuditEvent({
      actorId: actorUser.id,
      actorName: `${actorUser.first_name} ${actorUser.last_name}`,
      actorRole: actorUser.role,
      action: 'APPROVE_RECOMMENDATION',
      entityType: 'recommendation',
      entityId: recommendationId,
      previousValue: { status: rec.status },
      newValue: { status: 'approved', finalAction }
    });

    return { success: true, approvalId: apprId, status: 'approved' };
  },

  async rejectRecommendation(recommendationId, actorUser, rejectionReason = 'Rejected by reviewer') {
    const recRes = await query(`SELECT * FROM recommendations WHERE id = $1`, [recommendationId]);
    if (recRes.rows.length === 0) throw new Error('Recommendation not found');
    const rec = recRes.rows[0];

    const apprId = `appr_${uuidv4().substring(0, 8)}`;
    await query(
      `UPDATE recommendations SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [recommendationId]
    );

    await query(
      `INSERT INTO approvals (id, recommendation_id, reviewer_id, decision, override_reason, previous_recommendation, final_action_taken)
       VALUES ($1, $2, $3, 'rejected', $4, $5, 'Recommendation Rejected - No Outbound Action')`,
      [apprId, recommendationId, actorUser.id, rejectionReason, rec.recommended_action]
    );

    await logAuditEvent({
      actorId: actorUser.id,
      actorName: `${actorUser.first_name} ${actorUser.last_name}`,
      actorRole: actorUser.role,
      action: 'REJECT_RECOMMENDATION',
      entityType: 'recommendation',
      entityId: recommendationId,
      previousValue: { status: rec.status },
      newValue: { status: 'rejected', reason: rejectionReason }
    });

    return { success: true, approvalId: apprId, status: 'rejected' };
  },

  async overrideRecommendation(recommendationId, actorUser, { override_reason, final_action_taken }) {
    if (!override_reason || override_reason.trim().length < 5) {
      throw new Error('A mandatory override reason (min 5 characters) is strictly required to override AI.');
    }

    const recRes = await query(`SELECT * FROM recommendations WHERE id = $1`, [recommendationId]);
    if (recRes.rows.length === 0) throw new Error('Recommendation not found');
    const rec = recRes.rows[0];

    const apprId = `appr_${uuidv4().substring(0, 8)}`;
    await query(
      `UPDATE recommendations SET status = 'overridden', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [recommendationId]
    );

    await query(
      `INSERT INTO approvals (id, recommendation_id, reviewer_id, decision, override_reason, previous_recommendation, final_action_taken)
       VALUES ($1, $2, $3, 'overridden', $4, $5, $6)`,
      [apprId, recommendationId, actorUser.id, override_reason, rec.recommended_action, final_action_taken || 'Custom Action Executed']
    );

    await logAuditEvent({
      actorId: actorUser.id,
      actorName: `${actorUser.first_name} ${actorUser.last_name}`,
      actorRole: actorUser.role,
      action: 'OVERRIDE_RECOMMENDATION',
      entityType: 'recommendation',
      entityId: recommendationId,
      previousValue: { recommended_action: rec.recommended_action },
      newValue: { final_action_taken, override_reason },
      reason: override_reason
    });

    return { success: true, approvalId: apprId, status: 'overridden' };
  },

  async recordFeedback(recommendationId, { feedback_score, feedback_notes = '' }, actorUser) {
    const outcId = `outc_${uuidv4().substring(0, 8)}`;
    const recRes = await query(`SELECT * FROM recommendations WHERE id = $1`, [recommendationId]);
    if (recRes.rows.length === 0) throw new Error('Recommendation not found');

    const appRes = await query(`SELECT id FROM approvals WHERE recommendation_id = $1 LIMIT 1`, [recommendationId]);
    const approvalId = appRes.rows.length > 0 ? appRes.rows[0].id : null;

    await query(
      `INSERT INTO outcomes (id, recommendation_id, approval_id, customer_response, feedback_score, feedback_notes)
       VALUES ($1, $2, $3, 'accepted', $4, $5)`,
      [outcId, recommendationId, approvalId, feedback_score, feedback_notes]
    );

    await logAuditEvent({
      actorId: actorUser?.id || null,
      actorName: actorUser ? `${actorUser.first_name} ${actorUser.last_name}` : 'Staff',
      actorRole: actorUser?.role || 'service_agent',
      action: 'UPDATE',
      entityType: 'outcomes',
      entityId: outcId,
      newValue: { feedback_score, feedback_notes }
    });

    return { success: true, outcomeId: outcId };
  }
};
