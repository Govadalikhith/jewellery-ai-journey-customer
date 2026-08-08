export function sendSuccess(res, data = {}, meta = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: Object.keys(meta).length > 0 ? meta : undefined
  });
}

export function sendError(res, code = 'INTERNAL_ERROR', message = 'An unexpected error occurred', details = [], statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: details.length > 0 ? details : undefined
    }
  });
}
