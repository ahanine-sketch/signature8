try {
  const app = require('../src/index').default;
  module.exports = app;
} catch (error: any) {
  console.error('CRITICAL: Failed to load backend app in serverless entry point:', error);
  // Re-throw to let Vercel handle it, but now with a log
  throw error;
}
