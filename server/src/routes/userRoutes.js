/**
 * User Routes
 *
 * All routes require authentication (JWT via protect middleware).
 *
 * GET    /api/users/me          — fetch own profile + stats
 * PUT    /api/users/profile     — update username / email / avatarColor
 * PUT    /api/users/password    — change password
 * DELETE /api/users/account     — permanently delete account
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require('../controllers/userController');

// All user routes require a valid JWT
router.use(protect);

router.get('/me',         getProfile);
router.put('/profile',    updateProfile);
router.put('/password',   changePassword);
router.delete('/account', deleteAccount);

module.exports = router;
