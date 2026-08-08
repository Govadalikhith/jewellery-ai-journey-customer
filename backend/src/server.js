import app from './app.js';
import { env } from './config/env.js';
import { initDb } from './config/db.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : (env.PORT || 5000);

// 1. Immediately bind and listen on 0.0.0.0 to satisfy Render/cloud port scanners
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`✨ Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`📡 API endpoint: http://localhost:${PORT}/api/v1`);
  logger.info(`🩺 Health check: http://localhost:${PORT}/api/health`);
});

// 2. Initialize Database asynchronously without blocking server port binding
initDb()
  .then(() => {
    logger.info('✅ Database initialized and ready for requests.');
  })
  .catch((err) => {
    logger.warn('Database initialization warning:', err.message);
  });
