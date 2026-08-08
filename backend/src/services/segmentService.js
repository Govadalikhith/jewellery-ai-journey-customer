import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';
import { logAuditEvent } from '../middleware/audit.js';

export const SegmentService = {
  async listSegments() {
    const res = await query(
      `SELECT s.*, u.first_name as creator_first_name, u.last_name as creator_last_name 
       FROM segments s 
       LEFT JOIN users u ON s.created_by = u.id 
       ORDER BY s.created_at DESC`
    );
    return res.rows.map(r => ({
      ...r,
      criteria: typeof r.criteria === 'string' ? JSON.parse(r.criteria) : r.criteria
    }));
  },

  async createSegment(data, actorUser) {
    const id = `seg_${uuidv4().substring(0, 8)}`;
    await query(
      `INSERT INTO segments (id, name, description, criteria, customer_count, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        data.name,
        data.description || '',
        JSON.stringify(data.criteria || {}),
        data.customer_count || 12,
        actorUser ? actorUser.id : null
      ]
    );

    if (actorUser) {
      await logAuditEvent({
        actorId: actorUser.id,
        actorName: `${actorUser.first_name} ${actorUser.last_name}`,
        actorRole: actorUser.role,
        action: 'CREATE',
        entityType: 'segments',
        entityId: id,
        newValue: data
      });
    }

    return { id, ...data };
  },

  async listCampaigns() {
    const res = await query(
      `SELECT c.*, s.name as segment_name 
       FROM campaigns c 
       JOIN segments s ON c.segment_id = s.id 
       ORDER BY c.created_at DESC`
    );
    return res.rows;
  },

  async createCampaign(data, actorUser) {
    const id = `camp_${uuidv4().substring(0, 8)}`;
    await query(
      `INSERT INTO campaigns (id, name, segment_id, channel, status, scheduled_date, total_targeted)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        id,
        data.name,
        data.segment_id,
        data.channel || 'whatsapp',
        data.status || 'active',
        data.scheduled_date || new Date().toISOString().split('T')[0],
        data.total_targeted || 25
      ]
    );

    if (actorUser) {
      await logAuditEvent({
        actorId: actorUser.id,
        actorName: `${actorUser.first_name} ${actorUser.last_name}`,
        actorRole: actorUser.role,
        action: 'CREATE',
        entityType: 'campaigns',
        entityId: id,
        newValue: data
      });
    }

    return { id, ...data };
  }
};
