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
const app = require('./app');

// Validate env vars before anything else touches process.env
validateEnv();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB before accepting any requests
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
  });

  // ─── Socket.io will be wired here in Phase 6 ─────────────────────────
  // const { Server } = require('socket.io');
  // const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });
  // require('./sockets')(io);

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
