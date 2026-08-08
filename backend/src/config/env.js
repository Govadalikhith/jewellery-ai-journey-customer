import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root or parent directory
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'embedded',
  JWT_SECRET: process.env.JWT_SECRET || 'aurum_jewellery_super_secret_jwt_key_2026_nxtwave',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  AI_CONFIDENCE_THRESHOLD: process.env.AI_CONFIDENCE_THRESHOLD ? parseFloat(process.env.AI_CONFIDENCE_THRESHOLD) : 0.75,
  AI_MODEL_NAME: process.env.AI_MODEL_NAME || 'gemini-1.5-flash'
};
