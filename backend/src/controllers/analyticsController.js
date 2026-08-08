import { AnalyticsService } from '../services/analyticsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const AnalyticsController = {
  async getDashboard(req, res) {
    try {
      const summary = await AnalyticsService.getDashboardSummary();
      return sendSuccess(res, summary);
    } catch (err) {
      return sendError(res, 'ANALYTICS_ERROR', 'Failed to generate analytics dashboard.', [err.message], 500);
    }
  },

  async exportCsv(req, res) {
    try {
      const csv = await AnalyticsService.exportReportCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="jewellery_customer_journey_report.csv"');
      return res.send(csv);
    } catch (err) {
      return sendError(res, 'EXPORT_ERROR', 'Failed to export CSV report.', [err.message], 500);
    }
  }
};
