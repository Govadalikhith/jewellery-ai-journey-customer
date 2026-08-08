import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendationController.js';
import { authGuard } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';
import { approvalActionSchema, modelFeedbackSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', authGuard, RecommendationController.list);
router.post('/evaluate', authGuard, RecommendationController.evaluateForCustomer);
router.post('/:id/approve', authGuard, requirePermission('recommendations', 'approve'), RecommendationController.approve);
router.post('/:id/reject', authGuard, requirePermission('recommendations', 'reject'), RecommendationController.reject);
router.post('/:id/override', authGuard, requirePermission('recommendations', 'override'), validateBody(approvalActionSchema), RecommendationController.override);
router.post('/feedback', authGuard, validateBody(modelFeedbackSchema), RecommendationController.feedback);

export default router;
