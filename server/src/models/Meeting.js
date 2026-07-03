/**
 * Meeting Model
 * 
 * Stores the core metadata of a meeting.
 * 
 * Design Decisions:
 * - `meetingId`: A user-friendly 9-character string (e.g., 'abc-defg-hij') used in the URL.
 *   This is standard for video conferencing (Meet, Zoom).
 * - `host`: Reference to the User who created it. We use this to verify host privileges.
 * - `status`: 'waiting' (created but not active), 'active' (ongoing), 'ended'.
 * - `participants`: We don't store live participants here; live participants are tracked in Redis/memory via Socket.io.
 *   This model only tracks persistent metadata.
 */

const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    meetingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'New Meeting',
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'active', 'ended'],
      default: 'waiting',
    },
    // We can add fields like scheduledStartTime later if scheduling is implemented.
  },
  {
    timestamps: true,
  }
);

// Virtual for the frontend URL
meetingSchema.virtual('joinUrl').get(function () {
  return `${process.env.CLIENT_URL || 'http://localhost:5173'}/meeting/${this.meetingId}`;
});

// Ensure virtuals are included in JSON serialization
meetingSchema.set('toJSON', { virtuals: true });
meetingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Meeting', meetingSchema);
