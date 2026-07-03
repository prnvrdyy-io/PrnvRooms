/**
 * User Model
 *
 * Design decisions:
 * - Password field has `select: false` — it NEVER comes back in queries by default.
 *   You must explicitly opt in: User.findOne().select('+password').
 *   This prevents accidental password leaks in API responses.
 * - Pre-save hook for hashing: bcrypt runs automatically before any .save()
 * - comparePassword instance method keeps auth logic on the model (Single Responsibility)
 * - refreshToken stored on user record — allows server-side invalidation (logout all devices)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in queries — must explicitly opt in
    },
    profileImage: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false, // Same protection as password
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt + updatedAt automatically
  }
);

// ─── Pre-save Hook: Hash password before saving ───────────────────────────
// Only runs if the password field was modified (prevents re-hashing on profile updates)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const saltRounds = 12; // Higher = slower brute-force, 12 is the industry standard
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// ─── Instance Method: Compare plain password against hash ────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Transform: Remove sensitive fields from JSON output ─────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
