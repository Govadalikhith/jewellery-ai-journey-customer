import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error('Unhandled Application Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An internal server error occurred.';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  return sendError(res, code, message, err.details || [], statusCode);
}
