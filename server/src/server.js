/**
 * Server Entry Point
 *
 * Responsibilities:
 * 1. Load environment variables (must be first)
 * 2. Validate environment
 * 3. Connect to database
 * 4. Create HTTP server from Express app
 * 5. Attach Socket.io to HTTP server (Phase 6)
 * 6. Start listening
 * 7. Handle graceful shutdown
 */

require('dotenv').config();

const { validateEnv } = require('./config/env');
const connectDB = require('./config/db');
const http = require('http');
const app = require('./app');
const { initSocketIO } = require('./sockets');

// Validate env vars before anything else touches process.env
validateEnv();

const PORT = process.env.PORT || 5000;

// Create HTTP server (required to attach Socket.io)
const server = http.createServer(app);

// Initialize Socket.io
initSocketIO(server);

const startServer = async () => {
  // Connect to MongoDB before accepting any requests
  await connectDB();

  server.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
  });

  // ─── Graceful Shutdown ─────────────────────────────────────────────────
  // Ensures in-flight requests complete and DB connection closes cleanly
  const gracefulShutdown = (signal) => {
    console.log(`\n⚡ ${signal} received — shutting down gracefully...`);
    server.close(() => {
      console.log('✅ HTTP server closed');
      require('mongoose').connection.close(false, () => {
        console.log('✅ MongoDB connection closed');
        process.exit(0);
      });
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Catch unhandled promise rejections — log and exit (let process manager restart)
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
