/**
 * Global Error Handler Middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('🔥 Server Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

/**
 * 404 Not Found Middleware
 */
export function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
}

export default { errorHandler, notFound };
