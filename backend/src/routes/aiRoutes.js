import { Router } from 'express';
import { AiController } from '../controllers/aiController.js';
import { authGuard } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { aiInteractionAnalyzeSchema } from '../validators/schemas.js';

const router = Router();

router.post('/analyze-interaction', authGuard, validateBody(aiInteractionAnalyzeSchema), AiController.analyzeInteraction);
router.post('/predict-intent', authGuard, validateBody(aiInteractionAnalyzeSchema), AiController.predictIntent);
router.post('/analyze-sentiment', authGuard, validateBody(aiInteractionAnalyzeSchema), AiController.analyzeSentiment);
router.post('/draft-response', authGuard, AiController.draftResponse);
router.post('/ask-concierge', authGuard, AiController.askConcierge);
router.get('/runs', authGuard, AiController.getAiRuns);

export default router;
