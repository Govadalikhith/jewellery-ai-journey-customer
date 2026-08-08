import app from './app.js';
import { env } from './config/env.js';
import { initDb } from './config/db.js';
import { logger } from './utils/logger.js';

// Top-level crash protection for cloud hosting
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception intercepted:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Promise Rejection intercepted:', reason);
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : (env.PORT || 5000);

// 1. Immediately bind and listen on 0.0.0.0 to satisfy Render cloud port scanner
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`✨ Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`📡 API endpoint: http://0.0.0.0:${PORT}/api/v1`);
  logger.info(`🩺 Health check: http://0.0.0.0:${PORT}/api/health`);
});

// 2. Initialize Database asynchronously without blocking server port binding
initDb()
  .then(() => {
    logger.info('✅ Database initialized and ready for requests.');
  })
  .catch((err) => {
    logger.warn('Database initialization note:', err.message);
  });

export default server;
