/**
 * Health Check Routes
 *
 * Mounted at: GET /api/health
 * No authentication required — load balancers and monitors must reach this.
 */

const express = require('express');
const { getHealth } = require('../controllers/healthController');

const router = express.Router();

router.get('/', getHealth);

module.exports = router;
