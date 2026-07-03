/**
 * Meeting Routes
 *
 * Mounted at: /api/meetings
 */

const express = require('express');
const { body } = require('express-validator');
const {
  createMeeting,
  getMyMeetings,
  getMeetingDetails,
} = require('../controllers/meetingController');
const { protect } = require('../middleware/auth');
const { validationResult } = require('express-validator');

const router = express.Router();

// ─── Validation middleware ──────────────────────────────────────────────────
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// All meeting routes require authentication
router.use(protect);

// ─── Routes ────────────────────────────────────────────────────────────────
router.post(
  '/',
  validate([
    body('title').optional().trim().isLength({ max: 100 }).withMessage('Title too long'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
  ]),
  createMeeting
);

router.get('/', getMyMeetings);
router.get('/:meetingId', getMeetingDetails);

module.exports = router;
