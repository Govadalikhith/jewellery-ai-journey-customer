import { query } from '../config/db.js';

export const RuleEngine = {
  /**
   * Comprehensive Governance Validation:
   * 1. Consent Check (Opt-in vs Opt-out)
   * 2. Preferred Channel Check
   * 3. 7-Day Frequency Cap Check
   * 4. Journey & Ticket Eligibility Check
   */
  async evaluateOutreachEligibility(customerId, proposedChannel = 'whatsapp') {
    const checks = {
      consentPassed: false,
      frequencyPassed: false,
      eligibilityPassed: true,
      preferredChannelMatch: false,
      reasons: []
    };

    // 1. Consent Check
    const consentRes = await query(
      `SELECT is_consented, opt_out_date, weekly_frequency_cap, messages_sent_this_week 
       FROM consents 
       WHERE customer_id = $1 AND channel = $2`,
      [customerId, proposedChannel]
    );

    if (consentRes.rows.length === 0 || !consentRes.rows[0].is_consented) {
      checks.consentPassed = false;
      checks.reasons.push(`Customer has explicitly opted out or not consented to ${proposedChannel.toUpperCase()} outreach.`);
    } else {
      checks.consentPassed = true;
      const consent = consentRes.rows[0];
      
      // 2. Frequency Cap Check
      const cap = consent.weekly_frequency_cap || 3;
      const sent = consent.messages_sent_this_week || 0;
      if (sent >= cap) {
        checks.frequencyPassed = false;
        checks.reasons.push(`Weekly frequency cap exceeded (${sent}/${cap} messages already sent this week).`);
      } else {
        checks.frequencyPassed = true;
      }
    }

    // 3. Preferred Channel Check
    const prefRes = await query(
      `SELECT preferred_channel FROM customer_preferences WHERE customer_id = $1`,
      [customerId]
    );
    if (prefRes.rows.length > 0 && prefRes.rows[0].preferred_channel === proposedChannel) {
      checks.preferredChannelMatch = true;
    } else {
      checks.reasons.push(`Proposed channel '${proposedChannel}' is not the customer's primary preference.`);
    }

    // 4. Journey & Open Conflict Check
    const ticketRes = await query(
      `SELECT id, priority, status, category FROM service_tickets 
       WHERE customer_id = $1 AND status IN ('open', 'in_progress') AND priority = 'urgent'`,
      [customerId]
    );
    if (ticketRes.rows.length > 0) {
      // If customer has unresolved urgent ticket, promotional outreach is blocked
      checks.eligibilityPassed = false;
      checks.reasons.push('Customer has an active URGENT service ticket. Marketing outreach is blocked until resolution.');
    }

    const isFullyEligible = checks.consentPassed && checks.frequencyPassed && checks.eligibilityPassed;
    return {
      eligible: isFullyEligible,
      checks
    };
  }
};
