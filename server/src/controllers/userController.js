/**
 * User Controller — Profile Management
 *
 * GET    /api/users/me          — get own profile
 * PUT    /api/users/profile     — update username / email / avatarColor
 * PUT    /api/users/password    — change password (requires current password)
 * DELETE /api/users/account     — delete own account
 */

const User = require('../models/User');
const Meeting = require('../models/Meeting');

// ─── GET /api/users/me ────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Count meetings hosted
    const meetingsHosted = await Meeting.countDocuments({ host: req.user._id });

    res.json({
      success: true,
      data: {
        user: {
          ...user.toJSON(),
          meetingsHosted,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/users/profile ───────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { username, email, avatarColor } = req.body;
    const userId = req.user._id;

    const updateFields = {};
    if (username !== undefined) updateFields.username = username.trim();
    if (email    !== undefined) updateFields.email    = email.trim().toLowerCase();
    if (avatarColor !== undefined) updateFields.avatarColor = avatarColor;

    // Check uniqueness for username / email (excluding self)
    if (updateFields.username) {
      const existing = await User.findOne({ username: updateFields.username, _id: { $ne: userId } });
      if (existing) return res.status(400).json({ success: false, message: 'Username is already taken' });
    }
    if (updateFields.email) {
      const existing = await User.findOne({ email: updateFields.email, _id: { $ne: userId } });
      if (existing) return res.status(400).json({ success: false, message: 'Email is already in use' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Profile updated', data: { user } });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
    }
    next(err);
  }
};

// ─── PUT /api/users/password ──────────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    // Fetch user WITH password (select: false by default)
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword; // Pre-save hook will hash it
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/users/account ────────────────────────────────────────────
const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required to delete account' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect password' });
    }

    // Delete the user's meetings and the user record
    await Meeting.deleteMany({ host: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
