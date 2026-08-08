import { JourneyService } from '../services/journeyService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const JourneyController = {
  async list(req, res) {
    try {
      const status = req.query.status || '';
      const stage = req.query.stage || '';
      const limit = parseInt(req.query.limit, 10) || 50;

      const journeys = await JourneyService.listJourneys({ status, stage, limit });
      return sendSuccess(res, journeys);
    } catch (err) {
      return sendError(res, 'JOURNEY_LIST_ERROR', 'Failed to retrieve journeys.', [err.message], 500);
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const details = await JourneyService.getJourneyDetails(id);
      if (!details) {
        return sendError(res, 'JOURNEY_NOT_FOUND', `Journey with ID '${id}' not found.`, [], 404);
      }
      return sendSuccess(res, details);
    } catch (err) {
      return sendError(res, 'JOURNEY_FETCH_ERROR', 'Failed to fetch journey milestones.', [err.message], 500);
    }
  },

  async updateStage(req, res) {
    try {
      const { id } = req.params;
      const result = await JourneyService.updateJourneyStage(id, req.validatedBody, req.user);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'STAGE_UPDATE_ERROR', 'Failed to update journey stage.', [err.message], 500);
    }
  }
};
