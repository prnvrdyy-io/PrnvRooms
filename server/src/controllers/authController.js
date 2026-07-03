/**
 * Auth Controller
 *
 * Handles all authentication operations.
 * Business logic is kept lean here — heavy lifting is in the model and utils.
 *
 * Endpoints:
 *  POST /api/auth/register   → createUser
 *  POST /api/auth/login      → loginUser
 *  POST /api/auth/logout     → logoutUser
 *  POST /api/auth/refresh    → refreshAccessToken
 *  GET  /api/auth/me         → getMe (protected)
 */

const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

// ─── Register ──────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Basic presence validation (deep validation handled by express-validator in routes)
    if (!username || !email || !password) {
      return sendError(res, 400, 'Username, email and password are required');
    }

    // Check for duplicates (model has unique indexes, but give a friendly message)
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
      return sendError(res, 409, `${field} is already taken`);
    }

    // Create user — password is hashed by the pre-save hook
    const user = await User.create({ username, email, password });

    // Generate tokens immediately (user is logged in after registration)
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token on user (enables server-side invalidation)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendSuccess(res, 201, 'Account created successfully', {
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    // Explicitly select password (it has select:false on the schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Use a vague error message — never tell attackers which field is wrong
    if (!user || !user.isActive) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Rotate refresh token on every login
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Remove password from the response object
    user.password = undefined;

    sendSuccess(res, 200, 'Logged in successfully', {
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Logout ────────────────────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    // Invalidate the refresh token stored in the DB
    // The access token will expire on its own (15m) — this is acceptable
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    sendSuccess(res, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

// ─── Refresh Access Token ──────────────────────────────────────────────────
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, 401, 'Refresh token required');
    }

    // Verify the refresh token signature
    const decoded = verifyRefreshToken(refreshToken);

    // Check that the token matches what's stored (detects token reuse after logout)
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return sendError(res, 401, 'Invalid refresh token');
    }

    // Issue new tokens (rotation on every refresh)
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    sendSuccess(res, 200, 'Token refreshed', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Current User ──────────────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is populated by the `protect` middleware
  sendSuccess(res, 200, 'User retrieved', { user: req.user });
};

// ─── Update Profile ────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { username } = req.body;

    // Only allow updating safe fields — never password via this route
    const updates = {};
    if (username) updates.username = username;
    if (req.file) updates.profileImage = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    sendSuccess(res, 200, 'Profile updated', { user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, refreshAccessToken, getMe, updateProfile };
