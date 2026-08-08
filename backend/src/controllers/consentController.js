import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logAuditEvent } from '../middleware/audit.js';

export const ConsentController = {
  async getByCustomerId(req, res) {
    try {
      const { customerId } = req.params;
      const result = await query(`SELECT * FROM consents WHERE customer_id = $1 ORDER BY channel ASC`, [customerId]);
      return sendSuccess(res, result.rows);
    } catch (err) {
      return sendError(res, 'CONSENT_FETCH_ERROR', 'Failed to retrieve consents.', [err.message], 500);
    }
  },

  async updateConsent(req, res) {
    try {
      const { customerId } = req.params;
      const { channel, is_consented, weekly_frequency_cap } = req.validatedBody;

      const optOutDate = !is_consented ? new Date().toISOString() : null;
      await query(
        `INSERT INTO consents (id, customer_id, channel, is_consented, opt_out_date, weekly_frequency_cap, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
         ON CONFLICT (customer_id, channel) DO UPDATE
         SET is_consented = EXCLUDED.is_consented,
             opt_out_date = EXCLUDED.opt_out_date,
             weekly_frequency_cap = COALESCE(EXCLUDED.weekly_frequency_cap, consents.weekly_frequency_cap),
             updated_at = CURRENT_TIMESTAMP`,
        [
          `cons_${customerId}_${channel}`,
          customerId,
          channel,
          is_consented,
          optOutDate,
          weekly_frequency_cap || 3
        ]
      );

      if (req.user) {
        await logAuditEvent({
          actorId: req.user.id,
          actorName: `${req.user.first_name} ${req.user.last_name}`,
          actorRole: req.user.role,
          action: 'UPDATE',
          entityType: 'consents',
          entityId: customerId,
          newValue: { channel, is_consented, weekly_frequency_cap }
        });
      }

      return sendSuccess(res, { customerId, channel, is_consented, weekly_frequency_cap });
    } catch (err) {
      return sendError(res, 'CONSENT_UPDATE_ERROR', 'Failed to update consent preferences.', [err.message], 500);
    }
  }
};
