import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';
import { query } from '../config/db.js';

export async function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'UNAUTHORIZED', 'Missing or invalid Authorization header. Please log in.', [], 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return sendError(res, 'TOKEN_EXPIRED', 'Session token has expired or is invalid. Please log in again.', [], 401);
  }

  try {
    const userRes = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.title, u.is_active, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = $1 AND u.is_active = TRUE`,
      [decoded.id]
    );

    if (userRes.rows.length === 0) {
      return sendError(res, 'USER_INACTIVE', 'User account is deactivated or not found.', [], 403);
    }

    req.user = userRes.rows[0];
    next();
  } catch (err) {
    return sendError(res, 'AUTH_ERROR', 'Authentication failed during user verification.', [err.message], 500);
  }
}
