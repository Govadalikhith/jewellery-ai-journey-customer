import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';
import { AiEngine } from '../ai/aiEngine.js';
import { logAuditEvent } from '../middleware/audit.js';

export const TicketService = {
  async listTickets({ status = '', priority = '', search = '', limit = 50 }) {
    let sql = `
      SELECT t.*, c.first_name, c.last_name, c.email, c.phone, c.tier,
             u.first_name as agent_first_name, u.last_name as agent_last_name,
             (SELECT COUNT(*) FROM messages m JOIN conversations conv ON m.conversation_id = conv.id WHERE conv.ticket_id = t.id) as message_count
      FROM service_tickets t
      JOIN customers c ON t.customer_id = c.id
      LEFT JOIN users u ON t.assigned_agent_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      sql += ` AND t.status = $${params.length}`;
    }
    if (priority) {
      params.push(priority);
      sql += ` AND t.priority = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (t.ticket_number ILIKE $${params.length} OR t.subject ILIKE $${params.length} OR c.first_name ILIKE $${params.length} OR c.last_name ILIKE $${params.length})`;
    }

    sql += ` ORDER BY CASE WHEN t.priority = 'urgent' THEN 1 WHEN t.priority = 'high' THEN 2 ELSE 3 END, t.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const res = await query(sql, params);
    return res.rows;
  },

  async getTicketDetails(ticketId) {
    const tktRes = await query(
      `SELECT t.*, c.first_name, c.last_name, c.email, c.phone, c.tier, c.total_spend, c.churn_risk_score,
              u.first_name as agent_first_name, u.last_name as agent_last_name
       FROM service_tickets t
       JOIN customers c ON t.customer_id = c.id
       LEFT JOIN users u ON t.assigned_agent_id = u.id
       WHERE t.id = $1`,
      [ticketId]
    );

    if (tktRes.rows.length === 0) return null;
    const ticket = tktRes.rows[0];

    // Find conversation
    const convRes = await query(`SELECT * FROM conversations WHERE ticket_id = $1 LIMIT 1`, [ticketId]);
    let conversation = convRes.rows.length > 0 ? convRes.rows[0] : null;
    let messages = [];

    if (conversation) {
      const msgRes = await query(
        `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
        [conversation.id]
      );
      messages = msgRes.rows;
    }

    // AI Summary
    const aiSummary = await AiEngine.summarizeConversation(ticket.subject, messages);

    return {
      ticket,
      conversation,
      messages,
      aiSummary
    };
  },

  async createTicket(data, actorUser) {
    const ticketId = `tkt_${uuidv4().substring(0, 8)}`;
    const ticketNumber = `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    await query(
      `INSERT INTO service_tickets (id, customer_id, ticket_number, subject, category, priority, status, assigned_agent_id, churn_indicator, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP + INTERVAL '24 hour')`,
      [
        ticketId,
        data.customer_id,
        ticketNumber,
        data.subject,
        data.category,
        data.priority || 'medium',
        'open',
        actorUser ? actorUser.id : null,
        data.priority === 'urgent' ? 'high' : 'low'
      ]
    );

    const convId = `conv_${uuidv4().substring(0, 8)}`;
    await query(
      `INSERT INTO conversations (id, ticket_id, customer_id, channel)
       VALUES ($1, $2, $3, $4)`,
      [convId, ticketId, data.customer_id, 'whatsapp']
    );

    if (data.message_text) {
      await query(
        `INSERT INTO messages (id, conversation_id, sender_type, sender_id, message_text, is_approved)
         VALUES ($1, $2, 'customer', $3, $4, TRUE)`,
        [`msg_${uuidv4().substring(0, 8)}`, convId, data.customer_id, data.message_text]
      );
    }

    if (actorUser) {
      await logAuditEvent({
        actorId: actorUser.id,
        actorName: `${actorUser.first_name} ${actorUser.last_name}`,
        actorRole: actorUser.role,
        action: 'CREATE',
        entityType: 'service_tickets',
        entityId: ticketId,
        newValue: { ticketNumber, subject: data.subject, priority: data.priority }
      });
    }

    return { id: ticketId, ticketNumber, ...data };
  },

  async addMessage(ticketId, { message_text, channel = 'whatsapp', is_ai_draft = false }, actorUser) {
    const convRes = await query(`SELECT * FROM conversations WHERE ticket_id = $1 LIMIT 1`, [ticketId]);
    let convId;
    if (convRes.rows.length === 0) {
      convId = `conv_${uuidv4().substring(0, 8)}`;
      const tkt = await query(`SELECT customer_id FROM service_tickets WHERE id = $1`, [ticketId]);
      await query(`INSERT INTO conversations (id, ticket_id, customer_id, channel) VALUES ($1, $2, $3, $4)`, [
        convId,
        ticketId,
        tkt.rows[0].customer_id,
        channel
      ]);
    } else {
      convId = convRes.rows[0].id;
    }

    const msgId = `msg_${uuidv4().substring(0, 8)}`;
    await query(
      `INSERT INTO messages (id, conversation_id, sender_type, sender_id, message_text, is_ai_draft, is_approved)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
      [
        msgId,
        convId,
        actorUser ? 'agent' : 'customer',
        actorUser ? actorUser.id : null,
        message_text,
        is_ai_draft
      ]
    );

    return { id: msgId, conversationId: convId, message_text };
  },

  async generateAiDraft(ticketId) {
    const tktRes = await query(
      `SELECT t.*, c.first_name, c.last_name, c.email FROM service_tickets t
       JOIN customers c ON t.customer_id = c.id WHERE t.id = $1`,
      [ticketId]
    );
    if (tktRes.rows.length === 0) throw new Error('Ticket not found');
    const ticket = tktRes.rows[0];

    const draft = await AiEngine.draftResponse({
      customerName: `${ticket.first_name} ${ticket.last_name}`,
      ticketCategory: ticket.category,
      subject: ticket.subject
    });

    return draft;
  },

  async updateTicketStatus(ticketId, status, actorUser) {
    const tktRes = await query(`SELECT * FROM service_tickets WHERE id = $1`, [ticketId]);
    if (tktRes.rows.length === 0) throw new Error('Ticket not found');
    const prev = tktRes.rows[0];

    await query(`UPDATE service_tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [status, ticketId]);

    if (actorUser) {
      await logAuditEvent({
        actorId: actorUser.id,
        actorName: `${actorUser.first_name} ${actorUser.last_name}`,
        actorRole: actorUser.role,
        action: 'UPDATE',
        entityType: 'service_tickets',
        entityId: ticketId,
        previousValue: { status: prev.status },
        newValue: { status }
      });
    }

    return { success: true, ticketId, status };
  }
};
