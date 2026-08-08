import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';
import { JOURNEY_STAGES, JOURNEY_STAGE_LABELS } from '../config/constants.js';
import { logAuditEvent } from '../middleware/audit.js';

export const JourneyService = {
  async listJourneys({ status = '', stage = '', limit = 50 }) {
    let sql = `
      SELECT j.*, c.first_name, c.last_name, c.email, c.phone, c.tier,
             u.first_name as staff_first_name, u.last_name as staff_last_name
      FROM journeys j
      JOIN customers c ON j.customer_id = c.id
      LEFT JOIN users u ON j.assigned_staff_id = u.id
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      params.push(status);
      sql += ` AND j.status = $${params.length}`;
    }
    if (stage) {
      params.push(stage);
      sql += ` AND j.current_stage = $${params.length}`;
    }

    sql += ` ORDER BY j.updated_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const res = await query(sql, params);
    return res.rows.map(row => ({
      ...row,
      stageLabel: JOURNEY_STAGE_LABELS[row.current_stage] || row.current_stage
    }));
  },

  async getJourneyDetails(journeyId) {
    const jourRes = await query(
      `SELECT j.*, c.first_name, c.last_name, c.email, c.phone, c.tier,
              u.first_name as staff_first_name, u.last_name as staff_last_name
       FROM journeys j
       JOIN customers c ON j.customer_id = c.id
       LEFT JOIN users u ON j.assigned_staff_id = u.id
       WHERE j.id = $1`,
      [journeyId]
    );

    if (jourRes.rows.length === 0) return null;
    const journey = jourRes.rows[0];

    const stagesRes = await query(
      `SELECT js.*, u.first_name as owner_first_name, u.last_name as owner_last_name 
       FROM journey_stages js 
       LEFT JOIN users u ON js.owner_id = u.id 
       WHERE js.journey_id = $1 
       ORDER BY js.stage_order ASC`,
      [journeyId]
    );

    const designsRes = await query(`SELECT * FROM designs WHERE journey_id = $1`, [journeyId]);
    const hallmarksRes = await query(`SELECT * FROM hallmark_records WHERE journey_id = $1`, [journeyId]);
    const transfersRes = await query(`SELECT * FROM inventory_transfers WHERE journey_id = $1`, [journeyId]);
    const productionRes = await query(`SELECT * FROM production_records WHERE journey_id = $1`, [journeyId]);

    return {
      journey: {
        ...journey,
        stageLabel: JOURNEY_STAGE_LABELS[journey.current_stage] || journey.current_stage
      },
      stages: stagesRes.rows,
      linkedRecords: {
        designs: designsRes.rows,
        hallmarks: hallmarksRes.rows,
        transfers: transfersRes.rows,
        production: productionRes.rows
      }
    };
  },

  async updateJourneyStage(journeyId, { stage, status = 'completed', notes = '', metadata = {} }, actorUser) {
    const jourRes = await query(`SELECT * FROM journeys WHERE id = $1`, [journeyId]);
    if (jourRes.rows.length === 0) throw new Error('Journey not found');
    const previousJourney = jourRes.rows[0];

    // Update main journey current_stage
    await query(
      `UPDATE journeys SET current_stage = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [stage, journeyId]
    );

    // Update or insert into journey_stages milestone
    const existingStage = await query(
      `SELECT id FROM journey_stages WHERE journey_id = $1 AND stage_name = $2`,
      [journeyId, stage]
    );

    if (existingStage.rows.length > 0) {
      await query(
        `UPDATE journey_stages 
         SET status = $1, notes = $2, metadata = $3, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [status, notes, JSON.stringify(metadata), existingStage.rows[0].id]
      );
    } else {
      const stageOrder = JOURNEY_STAGES.indexOf(stage) + 1;
      await query(
        `INSERT INTO journey_stages (id, journey_id, stage_name, stage_order, status, owner_id, notes, metadata, started_at, completed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          `stg_${uuidv4().substring(0, 8)}`,
          journeyId,
          stage,
          stageOrder,
          status,
          actorUser ? actorUser.id : null,
          notes,
          JSON.stringify(metadata)
        ]
      );
    }

    if (actorUser) {
      await logAuditEvent({
        actorId: actorUser.id,
        actorName: `${actorUser.first_name} ${actorUser.last_name}`,
        actorRole: actorUser.role,
        action: 'UPDATE',
        entityType: 'journeys',
        entityId: journeyId,
        previousValue: { current_stage: previousJourney.current_stage },
        newValue: { current_stage: stage, status, notes },
        reason: `Journey progressed to ${JOURNEY_STAGE_LABELS[stage] || stage}`
      });
    }

    return { success: true, journeyId, current_stage: stage };
  }
};
