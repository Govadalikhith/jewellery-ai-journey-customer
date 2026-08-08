import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let genAI = null;

if (env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'your_gemini_api_key_here' && env.GEMINI_API_KEY.length > 10) {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    logger.info('✨ Google Gemini API client initialized on backend.');
  } catch (err) {
    logger.warn('Could not initialize GoogleGenerativeAI client:', err.message);
  }
} else {
  logger.info('💡 Gemini API key not provided or placeholder. Resilient AI Fallback Engine active.');
}

export function getGeminiModel(modelName = env.AI_MODEL_NAME) {
  if (!genAI) return null;
  try {
    return genAI.getGenerativeModel({ model: modelName });
  } catch (err) {
    logger.warn(`Failed to get model ${modelName}:`, err.message);
    return null;
  }
}
