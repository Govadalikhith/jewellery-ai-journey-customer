import { sendError } from '../utils/response.js';
import { query } from '../config/db.js';

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required.', [], 401);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        'FORBIDDEN',
        `Access denied. Role '${req.user.role}' is not authorized for this operation. Required: [${allowedRoles.join(', ')}]`,
        [],
        403
      );
    }
    next();
  };
}

export function requirePermission(resource, action) {
  return async (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required.', [], 401);
    }

    if (req.user.role === 'admin') {
      return next(); // Admin has universal access
    }

    try {
      const permRes = await query(
        `SELECT p.id FROM permissions p 
         JOIN roles r ON p.role_id = r.id 
         WHERE r.name = $1 AND p.resource = $2 AND (p.action = $3 OR p.action = 'all')`,
        [req.user.role, resource, action]
      );

      if (permRes.rows.length === 0) {
        return sendError(
          res,
          'PERMISSION_DENIED',
          `Insufficient privileges. Role '${req.user.role}' does not possess '${action}' permission on '${resource}'.`,
          [],
          403
        );
      }
      next();
    } catch (err) {
      return sendError(res, 'RBAC_ERROR', 'Error verifying role permissions.', [err.message], 500);
    }
  };
}
