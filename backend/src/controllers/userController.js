import { UserService } from '../services/userService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const UserController = {
  async list(req, res) {
    try {
      const users = await UserService.listUsers();
      return sendSuccess(res, users);
    } catch (err) {
      return sendError(res, 'USER_LIST_ERROR', 'Failed to retrieve users.', [err.message], 500);
    }
  },

  async listRoles(req, res) {
    try {
      const roles = await UserService.listRoles();
      return sendSuccess(res, roles);
    } catch (err) {
      return sendError(res, 'ROLE_LIST_ERROR', 'Failed to retrieve roles.', [err.message], 500);
    }
  },

  async create(req, res) {
    try {
      const user = await UserService.createUser(req.body, req.user);
      return sendSuccess(res, user, {}, 201);
    } catch (err) {
      return sendError(res, 'USER_CREATE_ERROR', 'Failed to create user.', [err.message], 500);
    }
  },

  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      const result = await UserService.toggleUserStatus(id, is_active, req.user);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'USER_STATUS_ERROR', 'Failed to update user status.', [err.message], 500);
    }
  }
};
