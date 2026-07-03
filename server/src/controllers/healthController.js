/**
 * Health Check Controller
 *
 * A simple but important endpoint. In production:
 * - Load balancers hit /api/health to decide if this instance is alive
 * - Monitoring tools (UptimeRobot, Render health checks) use it
 * - Developers use it to verify deployments instantly
 */

const mongoose = require('mongoose');
const { sendSuccess } = require('../utils/response');

const getHealth = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown';

  sendSuccess(res, 200, 'Service is healthy', {
    status: 'ok',
    environment: process.env.NODE_ENV,
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      host: mongoose.connection.host || 'not connected',
    },
    version: '1.0.0',
  });
};

module.exports = { getHealth };
