import { query } from '../config/db.js';
import { comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logAuditEvent } from '../middleware/audit.js';

export const AuthController = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const userRes = await query(
        `SELECT u.*, r.name as role, r.display_name as role_display_name, s.name as store_name 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         LEFT JOIN stores s ON u.store_id = s.id 
         WHERE u.email = $1`,
        [email]
      );

      if (userRes.rows.length === 0) {
        return sendError(res, 'INVALID_CREDENTIALS', 'No account found with this email address.', [], 401);
      }

      const user = userRes.rows[0];
      if (!user.is_active) {
        return sendError(res, 'ACCOUNT_INACTIVE', 'This user account has been deactivated by an administrator.', [], 403);
      }

      const isMatch = await comparePassword(password, user.password_hash);
      if (!isMatch) {
        return sendError(res, 'INVALID_CREDENTIALS', 'Incorrect password entered. Please try again.', [], 401);
      }

      // Update last login
      await query(`UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1`, [user.id]);

      const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      });

      await logAuditEvent({
        actorId: user.id,
        actorName: `${user.first_name} ${user.last_name}`,
        actorRole: user.role,
        action: 'LOGIN',
        entityType: 'auth',
        entityId: user.id,
        newValue: { email: user.email, role: user.role, store: user.store_name }
      });

      return sendSuccess(res, {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          title: user.title,
          role: user.role,
          roleDisplayName: user.role_display_name,
          storeName: user.store_name,
          lastLoginAt: user.last_login_at
        }
      });
    } catch (err) {
      return sendError(res, 'LOGIN_ERROR', 'Authentication failed unexpectedly.', [err.message], 500);
    }
  },

  async me(req, res) {
    return sendSuccess(res, { user: req.user });
  },

  async forgotPassword(req, res) {
    const { email } = req.body;
    // Standard secure forgot password message
    return sendSuccess(res, {
      message: `If an active account exists for ${email}, password reset instructions have been dispatched by our security concierge.`
    });
  },

  async logout(req, res) {
    if (req.user) {
      await logAuditEvent({
        actorId: req.user.id,
        actorName: `${req.user.first_name} ${req.user.last_name}`,
        actorRole: req.user.role,
        action: 'LOGOUT',
        entityType: 'auth',
        entityId: req.user.id
      });
    }
    return sendSuccess(res, { message: 'Logged out successfully.' });
  }
};
