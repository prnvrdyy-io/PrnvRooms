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
const authRoutes = require('./routes/authRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ─── Trust Proxy ───────────────────────────────────────────────────────────
// Required on Railway/Render/Heroku — traffic goes through a reverse proxy.
// Without this, express-rate-limit throws errors (→ 500 on every request).
app.set('trust proxy', 1);

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow file downloads
  })
);

// ─── CORS ──────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Handle preflight OPTIONS requests explicitly (required for production)
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

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
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/users', userRoutes);

// Additional routes will be mounted here in later phases:
// app.use('/api/meetings', meetingRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/files',    fileRoutes);

// ─── Error Handling (must be last) ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
