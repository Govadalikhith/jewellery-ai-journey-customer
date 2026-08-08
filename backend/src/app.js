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

// Determine Frontend Dist Path across environments
const possibleDistPaths = [
  path.join(__dirname, '..', '..', 'frontend', 'dist'),
  path.join(process.cwd(), 'frontend', 'dist'),
  path.join(process.cwd(), 'dist')
];

const finalDistPath = possibleDistPaths.find(p => fs.existsSync(p));

if (finalDistPath) {
  console.log(`🌐 Static assets mounted from: ${finalDistPath}`);
  app.use(express.static(finalDistPath));
}

// Cloud Health Check
app.get(['/health', '/api/health'], (req, res) => {
  return sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Jewellery AI Customer Journey Orchestrator API',
    version: '1.0.0'
  });
});

// Master REST API v1
app.use('/api/v1', routes);

// Explicit Root Route
app.get('/', (req, res) => {
  if (finalDistPath && fs.existsSync(path.join(finalDistPath, 'index.html'))) {
    return res.sendFile(path.join(finalDistPath, 'index.html'));
  }
  return res.status(200).send(`<!DOCTYPE html><html><head><title>Jewellery AI Orchestrator</title></head><body style="font-family:system-ui,-apple-system,sans-serif;padding:3rem;text-align:center;background:#0d1117;color:#f3f4f6;"><h2>✨ Aurum & Co. Jewellery AI Orchestrator</h2><p style="color:#9ca3af;">Cloud Service Status: Healthy | <a style="color:#eab308;" href="/api/health">/api/health</a></p></body></html>`);
});

// SPA Single-Page-Application Catch-All for Frontend
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  if (finalDistPath && fs.existsSync(path.join(finalDistPath, 'index.html'))) {
    return res.sendFile(path.join(finalDistPath, 'index.html'));
  }
  return res.redirect('/');
});

// Global Error Handler
app.use(errorHandler);

export default app;
