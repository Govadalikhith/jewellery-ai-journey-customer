import { SettingsService } from '../services/settingsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const SettingsController = {
  async getAll(req, res) {
    try {
      const settings = await SettingsService.getAllSettings();
      return sendSuccess(res, settings);
    } catch (err) {
      return sendError(res, 'SETTINGS_FETCH_ERROR', 'Failed to retrieve configuration.', [err.message], 500);
    }
  },

  async update(req, res) {
    try {
      const { config_key, config_value } = req.validatedBody;
      const result = await SettingsService.updateSetting(config_key, config_value, req.user);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'SETTINGS_UPDATE_ERROR', 'Failed to update configuration.', [err.message], 500);
    }
  }
};
