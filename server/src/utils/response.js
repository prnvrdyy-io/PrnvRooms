/**
 * Response Helper Utilities
 *
 * Enforces a consistent API response envelope across all controllers:
 *
 * Success: { success: true,  data: {...},    message: "..." }
 * Error:   { success: false, message: "...", errors: [...] }
 *
 * Why a consistent envelope?
 * - Frontend can always check `response.data.success`
 * - Makes API contract explicit and predictable
 * - Simplifies error handling in Axios interceptors
 */

/**
 * Send a successful JSON response
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable success message
 * @param {*} data - Response payload
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Send an error JSON response
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable error message
 * @param {Array} [errors] - Optional array of validation errors
 */
const sendError = (res, statusCode = 500, message = 'Internal server error', errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
