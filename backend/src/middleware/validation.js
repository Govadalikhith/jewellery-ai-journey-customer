import { sendError } from '../utils/response.js';

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorDetails = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return sendError(res, 'VALIDATION_ERROR', 'The submitted data failed schema validation.', errorDetails, 422);
    }
    req.validatedBody = result.data;
    next();
  };
}
