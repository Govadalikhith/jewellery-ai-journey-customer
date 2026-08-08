import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';

export const NotificationService = {
  async getNotificationsForUser(userId, { unreadOnly = false, limit = 50 }) {
    let sql = `SELECT * FROM notifications WHERE (user_id = $1 OR user_id IS NULL)`;
    const params = [userId];

    if (unreadOnly) {
      sql += ` AND is_read = FALSE`;
    }

    sql += ` ORDER BY created_at DESC LIMIT $2`;
    params.push(limit);

    const res = await query(sql, params);
    const unreadCountRes = await query(
      `SELECT COUNT(*) as unread FROM notifications WHERE (user_id = $1 OR user_id IS NULL) AND is_read = FALSE`,
      [userId]
    );

    return {
      notifications: res.rows,
      unreadCount: parseInt(unreadCountRes.rows[0].unread, 10)
    };
  },

  async markAsRead(notificationId, userId) {
    await query(`UPDATE notifications SET is_read = TRUE WHERE id = $1`, [notificationId]);
    return { success: true, notificationId };
  },

  async markAllAsRead(userId) {
    await query(`UPDATE notifications SET is_read = TRUE WHERE user_id = $1 OR user_id IS NULL`, [userId]);
    return { success: true };
  },

  async createNotification({ userId = null, title, message, notification_type = 'system', urgency = 'normal', link_url = null }) {
    const id = `notif_${uuidv4().substring(0, 8)}`;
    await query(
      `INSERT INTO notifications (id, user_id, title, message, notification_type, urgency, link_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, userId, title, message, notification_type, urgency, link_url]
    );
    return { id, title, message };
  }
};
