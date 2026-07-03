/**
 * Database Configuration — MongoDB Connection via Mongoose
 *
 * Design decisions:
 * - Exported as an async function (not called on require) so the caller
 *   (server.js) controls when the connection is established.
 * - process.exit(1) on initial connection failure — a server with no DB
 *   is useless and should not pretend to be healthy.
 * - Mongoose event listeners log connection state changes, which is
 *   invaluable during production debugging.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options silence deprecation warnings and enforce modern defaults
      serverSelectionTimeoutMS: 5000, // Fail fast if Atlas is unreachable
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Log ongoing connection events for operational visibility
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

module.exports = connectDB;
