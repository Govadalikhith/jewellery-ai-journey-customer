import { CustomerService } from '../services/customerService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const CustomerController = {
  async list(req, res) {
    try {
      const search = req.query.search || '';
      const tier = req.query.tier || '';
      const status = req.query.status || '';
      const limit = parseInt(req.query.limit, 10) || 50;
      const offset = parseInt(req.query.offset, 10) || 0;

      const result = await CustomerService.listCustomers({ search, tier, status, limit, offset });
      return sendSuccess(res, result.customers, { total: result.total, limit, offset });
    } catch (err) {
      return sendError(res, 'CUSTOMER_LIST_ERROR', 'Failed to retrieve customers.', [err.message], 500);
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const customer360 = await CustomerService.getCustomer360(id);
      if (!customer360) {
        return sendError(res, 'CUSTOMER_NOT_FOUND', `No jewellery customer found with ID '${id}'.`, [], 404);
      }
      return sendSuccess(res, customer360);
    } catch (err) {
      return sendError(res, 'CUSTOMER_FETCH_ERROR', 'Failed to retrieve 360 profile.', [err.message], 500);
    }
  },

  async create(req, res) {
    try {
      const customer = await CustomerService.createCustomer(req.validatedBody, req.user);
      return sendSuccess(res, customer, {}, 201);
    } catch (err) {
      return sendError(res, 'CUSTOMER_CREATE_ERROR', 'Failed to register customer.', [err.message], 500);
    }
  }
};
