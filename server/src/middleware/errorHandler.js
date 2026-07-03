/**
 * Centralised Error Handler
 *
 * Why centralise error handling?
 * - Consistent JSON error response shape across every route
 * - Stack traces only in development (never leak internals to production)
 * - Handles both custom operational errors and unexpected programmer errors
 *
 * Usage in route/controller: throw an Error or call next(error)
 */

const errorHandler = (err, req, res, next) => {
  // Use the error's own statusCode if set, otherwise default to 500
  const statusCode = err.statusCode || res.statusCode === 200 ? err.statusCode || 500 : res.statusCode;

  // Mongoose duplicate key error (e.g., email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  res.status(statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    // Only expose stack trace in development — never in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
