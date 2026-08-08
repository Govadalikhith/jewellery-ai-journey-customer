import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';
import { hashPassword } from '../utils/password.js';
import { logAuditEvent } from '../middleware/audit.js';

export const UserService = {
  async listUsers() {
    const res = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.title, u.is_active, u.last_login_at, u.created_at,
              r.id as role_id, r.name as role, r.display_name as role_display_name,
              s.name as store_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN stores s ON u.store_id = s.id
       ORDER BY u.created_at DESC`
    );
    return res.rows;
  },

  async listRoles() {
    const rolesRes = await query(`SELECT * FROM roles ORDER BY name ASC`);
    const permRes = await query(`SELECT * FROM permissions ORDER BY resource, action`);
    
    return rolesRes.rows.map(role => ({
      ...role,
      permissions: permRes.rows.filter(p => p.role_id === role.id)
    }));
  },

  async createUser(data, actorUser) {
    const id = `user_${uuidv4().substring(0, 8)}`;
    const hashedPassword = await hashPassword(data.password || 'password123');

    // Get role_id
    let roleId = data.role_id;
    if (!roleId && data.role) {
      const roleLookup = await query(`SELECT id FROM roles WHERE name = $1`, [data.role]);
      if (roleLookup.rows.length > 0) roleId = roleLookup.rows[0].id;
    }

    await query(
      `INSERT INTO users (id, organisation_id, store_id, role_id, email, password_hash, first_name, last_name, phone, title)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        id,
        'org_aurum_luxury',
        data.store_id || 'store_mumbai_flagship',
        roleId || 'role_service_agent',
        data.email,
        hashedPassword,
        data.first_name,
        data.last_name,
        data.phone || '',
        data.title || 'Client Advisor'
      ]
    );

    if (actorUser) {
      await logAuditEvent({
        actorId: actorUser.id,
        actorName: `${actorUser.first_name} ${actorUser.last_name}`,
        actorRole: actorUser.role,
        action: 'CREATE',
        entityType: 'users',
        entityId: id,
        newValue: { email: data.email, role: data.role }
      });
    }

    return { id, email: data.email, first_name: data.first_name, last_name: data.last_name };
  },

  async toggleUserStatus(userId, isActive, actorUser) {
    await query(`UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [isActive, userId]);

    if (actorUser) {
      await logAuditEvent({
        actorId: actorUser.id,
        actorName: `${actorUser.first_name} ${actorUser.last_name}`,
        actorRole: actorUser.role,
        action: 'UPDATE',
        entityType: 'users',
        entityId: userId,
        newValue: { is_active: isActive }
      });
    }
    return { success: true, userId, is_active: isActive };
  }
};
