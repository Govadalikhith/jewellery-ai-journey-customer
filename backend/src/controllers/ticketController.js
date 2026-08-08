import { TicketService } from '../services/ticketService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const TicketController = {
  async list(req, res) {
    try {
      const status = req.query.status || '';
      const priority = req.query.priority || '';
      const search = req.query.search || '';
      const limit = parseInt(req.query.limit, 10) || 50;

      const tickets = await TicketService.listTickets({ status, priority, search, limit });
      return sendSuccess(res, tickets);
    } catch (err) {
      return sendError(res, 'TICKET_LIST_ERROR', 'Failed to retrieve tickets.', [err.message], 500);
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const details = await TicketService.getTicketDetails(id);
      if (!details) {
        return sendError(res, 'TICKET_NOT_FOUND', `Service ticket '${id}' not found.`, [], 404);
      }
      return sendSuccess(res, details);
    } catch (err) {
      return sendError(res, 'TICKET_FETCH_ERROR', 'Failed to fetch ticket conversation.', [err.message], 500);
    }
  },

  async create(req, res) {
    try {
      const ticket = await TicketService.createTicket(req.validatedBody, req.user);
      return sendSuccess(res, ticket, {}, 201);
    } catch (err) {
      return sendError(res, 'TICKET_CREATE_ERROR', 'Failed to create service ticket.', [err.message], 500);
    }
  },

  async addMessage(req, res) {
    try {
      const { id } = req.params;
      const message = await TicketService.addMessage(id, req.validatedBody, req.user);
      return sendSuccess(res, message, {}, 201);
    } catch (err) {
      return sendError(res, 'MESSAGE_POST_ERROR', 'Failed to send message.', [err.message], 500);
    }
  },

  async generateAiDraft(req, res) {
    try {
      const { id } = req.params;
      const draft = await TicketService.generateAiDraft(id);
      return sendSuccess(res, draft);
    } catch (err) {
      return sendError(res, 'AI_DRAFT_ERROR', 'Failed to generate AI concierge draft.', [err.message], 500);
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await TicketService.updateTicketStatus(id, status, req.user);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 'TICKET_STATUS_ERROR', 'Failed to update ticket status.', [err.message], 500);
    }
  }
};
