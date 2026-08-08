import { NotificationService } from '../services/notificationService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const NotificationController = {
  async list(req, res) {
    try {
      const unreadOnly = req.query.unread === 'true';
      const limit = parseInt(req.query.limit, 10) || 50;

      const result = await NotificationService.getNotificationsForUser(req.user ? req.user.id : null, { unreadOnly, limit });
      return sendSuccess(res, result.notifications, { unreadCount: result.unreadCount });
    } catch (err) {
      return sendError(res, 'NOTIFICATION_ERROR', 'Failed to retrieve notifications.', [err.message], 500);
    }
  },

  async markRead(req, res) {
    try {
      const { id } = req.params;
      const result = await NotificationService.markAsRead(id, req.user ? req.user.id : null);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'NOTIFICATION_READ_ERROR', 'Failed to mark notification read.', [err.message], 500);
    }
  },

  async markAllRead(req, res) {
    try {
      const result = await NotificationService.markAllAsRead(req.user ? req.user.id : null);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'NOTIFICATION_CLEAR_ERROR', 'Failed to clear notifications.', [err.message], 500);
    }
  }
};
