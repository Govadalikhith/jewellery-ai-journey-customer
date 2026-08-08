import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';
import { AiEngine } from '../ai/aiEngine.js';
import { logAuditEvent } from '../middleware/audit.js';

export const CustomerService = {
  async listCustomers({ search = '', tier = '', status = '', limit = 50, offset = 0 }) {
    let sql = `
      SELECT c.*, s.name as store_name, u.first_name as advisor_first_name, u.last_name as advisor_last_name,
             (SELECT COUNT(*) FROM journeys j WHERE j.customer_id = c.id) as journey_count,
             (SELECT COUNT(*) FROM service_tickets t WHERE t.customer_id = c.id AND t.status IN ('open', 'in_progress')) as open_ticket_count
      FROM customers c
      LEFT JOIN stores s ON c.preferred_store_id = s.id
      LEFT JOIN users u ON c.assigned_advisor_id = u.id
      WHERE c.is_active = TRUE
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (c.first_name ILIKE $${params.length} OR c.last_name ILIKE $${params.length} OR c.email ILIKE $${params.length} OR c.phone ILIKE $${params.length})`;
    }
    if (tier) {
      params.push(tier);
      sql += ` AND c.tier = $${params.length}`;
    }
    if (status) {
      params.push(status);
      sql += ` AND c.status = $${params.length}`;
    }

    sql += ` ORDER BY c.total_spend DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const res = await query(sql, params);
    const countRes = await query(`SELECT COUNT(*) as total FROM customers WHERE is_active = TRUE`);

    return {
      customers: res.rows,
      total: parseInt(countRes.rows[0].total, 10),
      limit,
      offset
    };
  },

  async getCustomer360(customerId) {
    const custRes = await query(
      `SELECT c.*, s.name as store_name, u.first_name as advisor_first_name, u.last_name as advisor_last_name 
       FROM customers c
       LEFT JOIN stores s ON c.preferred_store_id = s.id
       LEFT JOIN users u ON c.assigned_advisor_id = u.id
       WHERE c.id = $1`,
      [customerId]
    );

    if (custRes.rows.length === 0) {
      return null;
    }
    const customer = custRes.rows[0];

    // Identity Links
    const linksRes = await query(`SELECT * FROM customer_identity_links WHERE customer_id = $1`, [customerId]);

    // Preferences
    const prefRes = await query(`SELECT * FROM customer_preferences WHERE customer_id = $1`, [customerId]);

    // Consents
    const consentRes = await query(`SELECT * FROM consents WHERE customer_id = $1`, [customerId]);

    // Active Journey
    const jourRes = await query(
      `SELECT j.*, u.first_name as staff_first_name, u.last_name as staff_last_name 
       FROM journeys j 
       LEFT JOIN users u ON j.assigned_staff_id = u.id 
       WHERE j.customer_id = $1 
       ORDER BY j.created_at DESC LIMIT 1`,
      [customerId]
    );
    let activeJourney = jourRes.rows.length > 0 ? jourRes.rows[0] : null;
    let journeyStages = [];
    if (activeJourney) {
      const stgRes = await query(
        `SELECT js.*, u.first_name as owner_first_name, u.last_name as owner_last_name 
         FROM journey_stages js 
         LEFT JOIN users u ON js.owner_id = u.id 
         WHERE js.journey_id = $1 
         ORDER BY js.stage_order ASC`,
        [activeJourney.id]
      );
      journeyStages = stgRes.rows;
    }

    // Interaction Timeline
    const intRes = await query(
      `SELECT i.*, u.first_name as staff_first_name, u.last_name as staff_last_name 
       FROM interactions i 
       LEFT JOIN users u ON i.staff_id = u.id 
       WHERE i.customer_id = $1 
       ORDER BY i.timestamp DESC LIMIT 20`,
      [customerId]
    );

    // Sales & Purchases
    const salesRes = await query(`SELECT * FROM sales WHERE customer_id = $1 ORDER BY sale_date DESC`, [customerId]);

    // Certificates (GIA/IGI)
    const certRes = await query(`SELECT * FROM certificates WHERE customer_id = $1 ORDER BY issued_date DESC`, [customerId]);

    // Repairs
    const repRes = await query(
      `SELECT r.*, u.first_name as artisan_first_name, u.last_name as artisan_last_name 
       FROM repairs r 
       LEFT JOIN users u ON r.assigned_artisan_id = u.id 
       WHERE r.customer_id = $1 
       ORDER BY r.created_at DESC`,
      [customerId]
    );

    // Exchanges
    const exchRes = await query(`SELECT * FROM exchanges WHERE customer_id = $1 ORDER BY created_at DESC`, [customerId]);

    // Service Tickets
    const tktRes = await query(
      `SELECT t.*, u.first_name as agent_first_name, u.last_name as agent_last_name 
       FROM service_tickets t 
       LEFT JOIN users u ON t.assigned_agent_id = u.id 
       WHERE t.customer_id = $1 
       ORDER BY t.created_at DESC`,
      [customerId]
    );

    // AI Insights & Churn / Propensity calculation
    const churnPropensity = AiEngine.predictChurnAndPropensity(customer);

    // Pending AI Recommendations
    const recRes = await query(
      `SELECT * FROM recommendations WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 5`,
      [customerId]
    );

    return {
      customer,
      identityLinks: linksRes.rows,
      preferences: prefRes.rows.length > 0 ? prefRes.rows[0] : {},
      consents: consentRes.rows,
      activeJourney: activeJourney ? { ...activeJourney, stages: journeyStages } : null,
      interactions: intRes.rows,
      sales: salesRes.rows,
      certificates: certRes.rows,
      repairs: repRes.rows,
      exchanges: exchRes.rows,
      serviceTickets: tktRes.rows,
      aiInsights: {
        churnRisk: churnPropensity.churnScore,
        churnLabel: churnPropensity.churnLabel,
        propensityScore: churnPropensity.propensityScore,
        propensityLabel: churnPropensity.propensityLabel,
        recentRecommendations: recRes.rows.map(r => ({
          ...r,
          evidence: typeof r.evidence === 'string' ? JSON.parse(r.evidence) : (r.evidence || [])
        }))
      }
    };
  },

  async createCustomer(data, actorUser) {
    const id = `cust_${data.first_name.toLowerCase()}_${uuidv4().substring(0, 4)}`;
    await query(
      `INSERT INTO customers (id, first_name, last_name, email, phone, tier, preferred_store_id, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        id,
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.tier || 'Silver',
        data.preferred_store_id || null,
        data.notes || ''
      ]
    );

    // Insert Default Preferences
    await query(
      `INSERT INTO customer_preferences (id, customer_id, preferred_metal, ring_size, favorite_gemstone)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        `pref_${id}`,
        id,
        data.preferred_metal || '18K Yellow Gold',
        data.ring_size || '14 (Indian)',
        data.favorite_gemstone || 'Natural Solitaire Diamond'
      ]
    );

    // Insert Default Consents
    for (const ch of ['whatsapp', 'email', 'phone', 'sms']) {
      await query(
        `INSERT INTO consents (id, customer_id, channel, is_consented, weekly_frequency_cap)
         VALUES ($1, $2, $3, $4, $5)`,
        [`cons_${id}_${ch}`, id, ch, ch !== 'sms', ch === 'whatsapp' ? 3 : 2]
      );
    }

    if (actorUser) {
      await logAuditEvent({
        actorId: actorUser.id,
        actorName: `${actorUser.first_name} ${actorUser.last_name}`,
        actorRole: actorUser.role,
        action: 'CREATE',
        entityType: 'customers',
        entityId: id,
        newValue: data
      });
    }

    return { id, ...data };
  }
};
