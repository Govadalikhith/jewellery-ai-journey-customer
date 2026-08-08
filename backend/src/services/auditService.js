import { query } from '../config/db.js';

export const AuditService = {
  async listAuditLogs({ action = '', entityType = '', actorRole = '', search = '', limit = 100, offset = 0 }) {
    let sql = `SELECT * FROM audit_logs WHERE 1=1`;
    const params = [];

    if (action) {
      params.push(action);
      sql += ` AND action = $${params.length}`;
    }
    if (entityType) {
      params.push(entityType);
      sql += ` AND entity_type = $${params.length}`;
    }
    if (actorRole) {
      params.push(actorRole);
      sql += ` AND actor_role = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (actor_name ILIKE $${params.length} OR reason ILIKE $${params.length} OR entity_id ILIKE $${params.length})`;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const res = await query(sql, params);
    const countRes = await query(`SELECT COUNT(*) as total FROM audit_logs`);

    return {
      logs: res.rows.map(row => ({
        ...row,
        previous_value: typeof row.previous_value === 'string' ? JSON.parse(row.previous_value) : row.previous_value,
        new_value: typeof row.new_value === 'string' ? JSON.parse(row.new_value) : row.new_value
      })),
      total: parseInt(countRes.rows[0].total, 10),
      limit,
      offset
    };
  }
};
