import { AuditService } from '../services/auditService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const AuditController = {
  async list(req, res) {
    try {
      const action = req.query.action || '';
      const entityType = req.query.entityType || '';
      const actorRole = req.query.actorRole || '';
      const search = req.query.search || '';
      const limit = parseInt(req.query.limit, 10) || 100;
      const offset = parseInt(req.query.offset, 10) || 0;

      const result = await AuditService.listAuditLogs({ action, entityType, actorRole, search, limit, offset });
      return sendSuccess(res, result.logs, { total: result.total, limit, offset });
    } catch (err) {
      return sendError(res, 'AUDIT_LOG_ERROR', 'Failed to retrieve immutable audit trail.', [err.message], 500);
    }
  }
};
