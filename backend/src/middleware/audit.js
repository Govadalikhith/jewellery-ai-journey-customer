import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';
import { logger } from '../utils/logger.js';

export async function logAuditEvent({
  actorId = null,
  actorName = 'System / Anonymous',
  actorRole = 'system',
  action,
  entityType,
  entityId = null,
  previousValue = null,
  newValue = null,
  reason = null,
  ipAddress = '127.0.0.1'
}) {
  try {
    const id = `aud_${uuidv4().substring(0, 8)}`;
    await query(
      `INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, entity_type, entity_id, previous_value, new_value, reason, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        id,
        actorId,
        actorName,
        actorRole,
        action,
        entityType,
        entityId,
        previousValue ? JSON.stringify(previousValue) : null,
        newValue ? JSON.stringify(newValue) : null,
        reason,
        ipAddress
      ]
    );
    logger.audit(action, { entityType, entityId, actorName });
  } catch (err) {
    logger.error('Failed to persist audit log entry:', err.message);
  }
}
