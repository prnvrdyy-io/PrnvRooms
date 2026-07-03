/**
 * Authentication Middleware
 *
 * `protect` — verifies the JWT in the Authorization header and attaches
 * the user to req.user. Any route that needs authentication uses this.
 *
 * Usage:
 *   router.get('/profile', protect, getProfile);
 *
 * Why not store user in session?
 * - JWT is stateless — the server doesn't need a session store (Redis/DB)
 * - Scales horizontally — any server instance can verify any token
 * - Perfect for our architecture where Socket.io servers may be separate
 */

const User = require('../models/User');
const { verifyAccessToken } = require('../utils/jwt');

const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Access denied. No token provided.');
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify signature and expiry (throws on invalid/expired)
    const decoded = verifyAccessToken(token);

    // 3. Check user still exists (handles deleted accounts with valid tokens)
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      const error = new Error('User not found or account deactivated.');
      error.statusCode = 401;
      return next(error);
    }

    // 4. Attach user to request for downstream handlers
    req.user = user;
    next();
  } catch (err) {
    // Pass JWT-specific errors to the centralised error handler
    // (which maps JsonWebTokenError → 401 and TokenExpiredError → 401)
    next(err);
  }
};

module.exports = { protect };
