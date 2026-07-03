/**
 * 404 Not Found Middleware
 *
 * Catches any request that falls through all defined routes.
 * Returns a JSON response (not HTML) since this is an API server.
 */

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { notFound };
