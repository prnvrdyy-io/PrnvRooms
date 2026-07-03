/**
 * JWT Utility Helpers
 *
 * Centralised token generation and verification.
 * Keeping JWT logic here (not in controllers) means if we swap to
 * a different signing library or add key rotation, we change one file.
 */

const jwt = require('jsonwebtoken');

/**
 * Generate a short-lived access token
 * @param {string} userId
 * @returns {string} signed JWT
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

/**
 * Generate a long-lived refresh token
 * @param {string} userId
 * @returns {string} signed JWT
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

/**
 * Verify an access token
 * @param {string} token
 * @returns {{ id: string }} decoded payload
 * @throws JsonWebTokenError | TokenExpiredError
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify a refresh token
 * @param {string} token
 * @returns {{ id: string }} decoded payload
 * @throws JsonWebTokenError | TokenExpiredError
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
