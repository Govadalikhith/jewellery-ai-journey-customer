import { SegmentService } from '../services/segmentService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const SegmentController = {
  async listSegments(req, res) {
    try {
      const segments = await SegmentService.listSegments();
      return sendSuccess(res, segments);
    } catch (err) {
      return sendError(res, 'SEGMENT_LIST_ERROR', 'Failed to retrieve segments.', [err.message], 500);
    }
  },

  async createSegment(req, res) {
    try {
      const segment = await SegmentService.createSegment(req.validatedBody, req.user);
      return sendSuccess(res, segment, {}, 201);
    } catch (err) {
      return sendError(res, 'SEGMENT_CREATE_ERROR', 'Failed to create customer segment.', [err.message], 500);
    }
  },

  async listCampaigns(req, res) {
    try {
      const campaigns = await SegmentService.listCampaigns();
      return sendSuccess(res, campaigns);
    } catch (err) {
      return sendError(res, 'CAMPAIGN_LIST_ERROR', 'Failed to retrieve campaigns.', [err.message], 500);
    }
  },

  async createCampaign(req, res) {
    try {
      const campaign = await SegmentService.createCampaign(req.body, req.user);
      return sendSuccess(res, campaign, {}, 201);
    } catch (err) {
      return sendError(res, 'CAMPAIGN_CREATE_ERROR', 'Failed to create campaign.', [err.message], 500);
    }
  }
};
