import { RecommendationService } from '../services/recommendationService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const RecommendationController = {
  async list(req, res) {
    try {
      const status = req.query.status || '';
      const customerId = req.query.customerId || '';
      const limit = parseInt(req.query.limit, 10) || 50;

      const recommendations = await RecommendationService.getRecommendations({ status, customerId, limit });
      return sendSuccess(res, recommendations);
    } catch (err) {
      return sendError(res, 'REC_LIST_ERROR', 'Failed to retrieve recommendations.', [err.message], 500);
    }
  },

  async evaluateForCustomer(req, res) {
    try {
      const { customerId } = req.body;
      const result = await RecommendationService.generateForCustomer(customerId, req.user);
      return sendSuccess(res, result, {}, 201);
    } catch (err) {
      return sendError(res, 'REC_EVAL_ERROR', 'Failed to generate recommendation.', [err.message], 500);
    }
  },

  async approve(req, res) {
    try {
      const { id } = req.params;
      const { final_action_taken } = req.body || {};
      const result = await RecommendationService.approveRecommendation(id, req.user, final_action_taken);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'REC_APPROVE_ERROR', 'Failed to approve recommendation.', [err.message], 500);
    }
  },

  async reject(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body || {};
      const result = await RecommendationService.rejectRecommendation(id, req.user, reason);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'REC_REJECT_ERROR', 'Failed to reject recommendation.', [err.message], 500);
    }
  },

  async override(req, res) {
    try {
      const { id } = req.params;
      const result = await RecommendationService.overrideRecommendation(id, req.user, req.validatedBody);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'REC_OVERRIDE_ERROR', err.message, [], 400);
    }
  },

  async feedback(req, res) {
    try {
      const { recommendation_id, feedback_score, feedback_notes } = req.validatedBody;
      const result = await RecommendationService.recordFeedback(recommendation_id, { feedback_score, feedback_notes }, req.user);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'FEEDBACK_ERROR', 'Failed to record model feedback.', [err.message], 500);
    }
  }
};
