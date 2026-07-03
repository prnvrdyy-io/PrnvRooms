/**
 * Environment Variable Validation
 *
 * This module validates that all required environment variables are present
 * at application startup. The app crashes loudly with a descriptive error
 * rather than failing silently at runtime — a critical production pattern.
 */

const REQUIRED_VARS = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'PORT',
  'CLIENT_URL',
];

const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   • ${key}`));
    console.error('\n📄 Copy server/.env.example to server/.env and fill in all values.');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
};

module.exports = { validateEnv };
