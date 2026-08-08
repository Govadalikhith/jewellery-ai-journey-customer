import { AiEngine } from '../ai/aiEngine.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const AiController = {
  async analyzeInteraction(req, res) {
    try {
      const { text } = req.body;
      const intentPromise = AiEngine.classifyIntent(text);
      const sentimentPromise = AiEngine.analyzeSentiment(text);

      const [intent, sentiment] = await Promise.all([intentPromise, sentimentPromise]);

      return sendSuccess(res, {
        intent,
        sentiment,
        evaluatedAt: new Date().toISOString()
      });
    } catch (err) {
      return sendError(res, 'AI_ANALYSIS_ERROR', 'AI analysis failed.', [err.message], 500);
    }
  },

  async predictIntent(req, res) {
    try {
      const { text } = req.body;
      const result = await AiEngine.classifyIntent(text);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'AI_INTENT_ERROR', 'Intent classification failed.', [err.message], 500);
    }
  },

  async analyzeSentiment(req, res) {
    try {
      const { text } = req.body;
      const result = await AiEngine.analyzeSentiment(text);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'AI_SENTIMENT_ERROR', 'Sentiment analysis failed.', [err.message], 500);
    }
  },

  async draftResponse(req, res) {
    try {
      const result = await AiEngine.draftResponse(req.body);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'AI_DRAFT_ERROR', 'Response drafting failed.', [err.message], 500);
    }
  },

  async askConcierge(req, res) {
    try {
      const { query: queryText, customerId } = req.body;
      if (!queryText || queryText.trim().length === 0) {
        return sendError(res, 'VALIDATION_ERROR', 'A query string is required.', [], 400);
      }
      const result = await AiEngine.answerCustomerQuery(queryText, customerId);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'AI_QUERY_ERROR', 'Failed to generate luxury intelligence response.', [err.message], 500);
    }
  },

  async getAiRuns(req, res) {
    try {
      const { query } = await import('../config/db.js');
      const runsRes = await query(`SELECT * FROM ai_runs ORDER BY created_at DESC LIMIT 50`);
      return sendSuccess(res, runsRes.rows.map(r => ({
        ...r,
        input_snapshot: typeof r.input_snapshot === 'string' ? JSON.parse(r.input_snapshot) : r.input_snapshot,
        output_payload: typeof r.output_payload === 'string' ? JSON.parse(r.output_payload) : r.output_payload
      })));
    } catch (err) {
      return sendError(res, 'AI_RUNS_ERROR', 'Failed to retrieve AI execution logs.', [err.message], 500);
    }
  }
};
