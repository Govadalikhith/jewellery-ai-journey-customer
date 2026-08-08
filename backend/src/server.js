import app from './app.js';
import { env } from './config/env.js';
import { initDb } from './config/db.js';
import { logger } from './utils/logger.js';

async function startServer() {
  try {
    console.log('🚀 Initializing Jewellery AI Customer Journey Orchestrator Backend...');
    await initDb();

    app.listen(env.PORT, () => {
      logger.info(`✨ Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`📡 API endpoint: http://localhost:${env.PORT}/api/v1`);
      logger.info(`🩺 Health check: http://localhost:${env.PORT}/api/health`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
