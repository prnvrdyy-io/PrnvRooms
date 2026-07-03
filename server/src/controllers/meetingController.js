/**
 * Meeting Controller
 *
 * Handles creation and retrieval of meetings.
 */

const Meeting = require('../models/Meeting');
const { sendSuccess, sendError } = require('../utils/response');

// Helper to generate a Google Meet-style ID (xxx-xxxx-xxx)
const generateMeetingId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const segment = (length) => Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${segment(3)}-${segment(4)}-${segment(3)}`;
};

// ─── Create a New Meeting ──────────────────────────────────────────────────
const createMeeting = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    let meetingId;
    let isUnique = false;

    // Ensure the ID is unique (extremely likely, but good practice)
    while (!isUnique) {
      meetingId = generateMeetingId();
      const existing = await Meeting.findOne({ meetingId });
      if (!existing) isUnique = true;
    }

    const meeting = await Meeting.create({
      meetingId,
      title: title || 'New Meeting',
      description,
      host: req.user._id,
    });

    sendSuccess(res, 201, 'Meeting created successfully', { meeting });
  } catch (err) {
    next(err);
  }
};

// ─── Get User's Meetings ───────────────────────────────────────────────────
// Fetches all meetings where the current user is the host
const getMyMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({ host: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Pagination could be added later if needed

    sendSuccess(res, 200, 'Meetings retrieved', { meetings });
  } catch (err) {
    next(err);
  }
};

// ─── Get Single Meeting Details ────────────────────────────────────────────
// Used when a user tries to join a meeting to verify it exists
const getMeetingDetails = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    
    // We populate the host name and avatar so the frontend can say "Alex's Meeting"
    const meeting = await Meeting.findOne({ meetingId }).populate('host', 'username profileImage');
    
    if (!meeting) {
      return sendError(res, 404, 'Meeting not found');
    }

    sendSuccess(res, 200, 'Meeting details retrieved', { meeting });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMeeting,
  getMyMeetings,
  getMeetingDetails,
};
