import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sendSuccess } from './utils/response.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & Core Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check for Render / Cloud
app.get('/api/health', (req, res) => {
  return sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Jewellery AI Customer Journey Orchestrator API',
    version: '1.0.0'
  });
});

// Version 1 Master Routes
app.use('/api/v1', routes);

// Determine Frontend Dist Path across local and cloud environments
const possibleDistPaths = [
  path.join(__dirname, '..', '..', 'frontend', 'dist'),
  path.join(process.cwd(), 'frontend', 'dist'),
  path.join(process.cwd(), 'dist')
];

let finalDistPath = possibleDistPaths.find(p => fs.existsSync(p));

if (finalDistPath) {
  console.log(`🌐 Serving production frontend bundle from: ${finalDistPath}`);
  app.use(express.static(finalDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(finalDistPath, 'index.html'));
  });
} else {
  // If dist is not yet built, provide a clean JSON status on root
  app.get('/', (req, res) => {
    return res.status(200).json({
      status: 'online',
      message: 'Jewellery AI Customer Journey Orchestrator API is running.',
      frontend: 'Frontend bundle building. Refresh shortly.',
      healthCheck: '/api/health'
    });
  });
}

// Global Error Handler
app.use(errorHandler);

export default app;
