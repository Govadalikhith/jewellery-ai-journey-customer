import { v4 as uuidv4 } from 'uuid';
import { getGeminiModel } from './geminiClient.js';
import { PROMPT_TEMPLATES } from './promptTemplates.js';
import { FallbackEngine } from './fallbackEngine.js';
import { query } from '../config/db.js';
import { logger } from '../utils/logger.js';

async function logAiRun(taskType, inputSnapshot, outputPayload, latencyMs, confidence, status = 'success') {
  try {
    const id = `run_${uuidv4().substring(0, 8)}`;
    await query(
      `INSERT INTO ai_runs (id, task_type, input_snapshot, output_payload, latency_ms, confidence, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        id,
        taskType,
        JSON.stringify(inputSnapshot),
        JSON.stringify(outputPayload),
        latencyMs,
        confidence,
        status
      ]
    );
  } catch (err) {
    logger.warn('Failed to record ai_runs log:', err.message);
  }
}

export const AiEngine = {
  async classifyIntent(text) {
    const start = Date.now();
    const model = getGeminiModel();

    if (model) {
      try {
        const prompt = `${PROMPT_TEMPLATES.INTENT_CLASSIFICATION}\n"${text}"`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const latency = Date.now() - start;
          await logAiRun('intent', { text }, parsed, latency, parsed.confidence || 0.88);
          return {
            ...parsed,
            modelVersion: 'Google Gemini 1.5 Flash',
            timestamp: new Date().toISOString()
          };
        }
      } catch (err) {
        logger.warn('Gemini intent classification fallback engaged:', err.message);
      }
    }

    const fallback = FallbackEngine.classifyIntent(text);
    const latency = Date.now() - start;
    await logAiRun('intent', { text, fallback: true }, fallback, latency, fallback.confidence);
    return {
      ...fallback,
      modelVersion: 'Aurum Rule Engine & Heuristics',
      timestamp: new Date().toISOString()
    };
  },

  async analyzeSentiment(text) {
    const start = Date.now();
    const model = getGeminiModel();

    if (model) {
      try {
        const prompt = `${PROMPT_TEMPLATES.SENTIMENT_ANALYSIS}\n"${text}"`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const latency = Date.now() - start;
          await logAiRun('sentiment', { text }, parsed, latency, parsed.confidence || 0.89);
          return {
            ...parsed,
            modelVersion: 'Google Gemini 1.5 Flash',
            timestamp: new Date().toISOString()
          };
        }
      } catch (err) {
        logger.warn('Gemini sentiment analysis fallback engaged:', err.message);
      }
    }

    const fallback = FallbackEngine.analyzeSentiment(text);
    const latency = Date.now() - start;
    await logAiRun('sentiment', { text, fallback: true }, fallback, latency, fallback.confidence);
    return {
      ...fallback,
      modelVersion: 'Aurum Sentiment Intelligence v2',
      timestamp: new Date().toISOString()
    };
  },

  async summarizeConversation(ticketSubject, messages = []) {
    const start = Date.now();
    const model = getGeminiModel();
    const context = `Subject: ${ticketSubject}\nMessages: ${JSON.stringify(messages.map(m => ({ sender: m.sender_type, text: m.message_text })))}`;

    if (model) {
      try {
        const prompt = `${PROMPT_TEMPLATES.CONVERSATION_SUMMARY}\n${context}`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const latency = Date.now() - start;
          await logAiRun('summary', { ticketSubject }, parsed, latency, 0.90);
          return {
            ...parsed,
            modelVersion: 'Google Gemini 1.5 Flash',
            timestamp: new Date().toISOString()
          };
        }
      } catch (err) {
        logger.warn('Gemini summary fallback engaged:', err.message);
      }
    }

    const fallback = FallbackEngine.summarizeConversation(ticketSubject, messages);
    const latency = Date.now() - start;
    await logAiRun('summary', { ticketSubject, fallback: true }, fallback, latency, 0.88);
    return {
      ...fallback,
      modelVersion: 'Aurum Heuristic Summarizer',
      timestamp: new Date().toISOString()
    };
  },

  async draftResponse(details) {
    const start = Date.now();
    const model = getGeminiModel();
    const context = JSON.stringify(details);

    if (model) {
      try {
        const prompt = `${PROMPT_TEMPLATES.RESPONSE_DRAFTING}\n${context}`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const latency = Date.now() - start;
          await logAiRun('draft_response', details, parsed, latency, 0.92);
          return {
            ...parsed,
            modelVersion: 'Google Gemini 1.5 Flash',
            timestamp: new Date().toISOString()
          };
        }
      } catch (err) {
        logger.warn('Gemini draft response fallback engaged:', err.message);
      }
    }

    const fallback = FallbackEngine.draftResponse(details);
    const latency = Date.now() - start;
    await logAiRun('draft_response', { ...details, fallback: true }, fallback, latency, 0.90);
    return {
      ...fallback,
      modelVersion: 'Aurum VIP Concierge Drafter',
      timestamp: new Date().toISOString()
    };
  },

  predictChurnAndPropensity(customer) {
    const result = FallbackEngine.predictChurnAndPropensity(customer);
    return {
      ...result,
      modelVersion: 'Aurum Predictive Churn Heuristic Model v1.2',
      timestamp: new Date().toISOString()
    };
  },

  async generateNextBestAction(customer, journey, openTickets = []) {
    const start = Date.now();
    const model = getGeminiModel();
    const context = JSON.stringify({ customer, journey, openTickets });

    if (model) {
      try {
        const prompt = `${PROMPT_TEMPLATES.NEXT_BEST_ACTION}\n${context}`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const latency = Date.now() - start;
          await logAiRun('nba', { customerId: customer.id }, parsed, latency, parsed.confidence || 0.90);
          return {
            ...parsed,
            modelVersion: 'Google Gemini 1.5 Flash',
            timestamp: new Date().toISOString()
          };
        }
      } catch (err) {
        logger.warn('Gemini NBA generation fallback engaged:', err.message);
      }
    }

    const fallback = FallbackEngine.generateNextBestAction(customer, journey, openTickets);
    const latency = Date.now() - start;
    await logAiRun('nba', { customerId: customer.id, fallback: true }, fallback, latency, fallback.confidence);
    return {
      ...fallback,
      modelVersion: 'Aurum Governance NBA Engine',
      timestamp: new Date().toISOString()
    };
  },

  async answerCustomerQuery(queryText, customerId = null) {
    const start = Date.now();
    const model = getGeminiModel();

    let dbContext = {};
    try {
      if (customerId) {
        const custRes = await query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
        const prefRes = await query(`SELECT * FROM customer_preferences WHERE customer_id = $1`, [customerId]);
        const jourRes = await query(`SELECT * FROM journeys WHERE customer_id = $1`, [customerId]);
        const repRes = await query(`SELECT * FROM repairs WHERE customer_id = $1`, [customerId]);
        const certRes = await query(`SELECT * FROM gemological_certificates WHERE customer_id = $1`, [customerId]);
        dbContext = {
          customer: custRes.rows[0] || null,
          preferences: prefRes.rows[0] || null,
          journey: jourRes.rows[0] || null,
          repairs: repRes.rows || [],
          certificates: certRes.rows || []
        };
      }
    } catch (e) {
      logger.warn('Failed to load DB context for QA:', e.message);
    }

    if (model) {
      try {
        const prompt = `${PROMPT_TEMPLATES.CUSTOMER_QA}\nQuery: "${queryText}"\nDB Context: ${JSON.stringify(dbContext)}`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const latency = Date.now() - start;
          await logAiRun('customer_qa', { queryText, customerId }, parsed, latency, parsed.confidence || 0.94);
          return {
            ...parsed,
            modelVersion: 'Google Gemini 1.5 Flash',
            timestamp: new Date().toISOString()
          };
        }
      } catch (err) {
        logger.warn('Gemini customer QA fallback engaged:', err.message);
      }
    }

    const fallback = FallbackEngine.answerCustomerQuery(queryText, dbContext);
    const latency = Date.now() - start;
    await logAiRun('customer_qa', { queryText, customerId, fallback: true }, fallback, latency, fallback.confidence);
    return {
      ...fallback,
      modelVersion: 'Aurum Luxury Knowledge & Intelligence Engine',
      timestamp: new Date().toISOString()
    };
  }
};
