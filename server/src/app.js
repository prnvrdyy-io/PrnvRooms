/**
 * Express Application Factory
 *
 * Why separate app.js from server.js?
 * - app.js exports a configured Express instance (testable without binding a port)
 * - server.js creates the HTTP server, attaches Socket.io, and starts listening
 * - This pattern is standard in production Node.js services and makes
 *   integration testing dramatically simpler (just import app in tests)
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const healthRoutes = require('./routes/healthRoutes');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow file downloads
  })
);

// ─── CORS ──────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies / auth headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Rate Limiting ─────────────────────────────────────────────────────────
// Global limiter — tightened per-route on sensitive endpoints (e.g., /auth)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use(globalLimiter);

// ─── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static File Serving (uploaded files) ──────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);

// Additional routes will be mounted here in later phases:
// app.use('/api/auth',     authRoutes);
// app.use('/api/meetings', meetingRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/files',    fileRoutes);

// ─── Error Handling (must be last) ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
