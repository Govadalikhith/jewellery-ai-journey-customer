import { Router } from 'express';
import { JourneyController } from '../controllers/journeyController.js';
import { authGuard } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';
import { journeyStageUpdateSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', authGuard, JourneyController.list);
router.get('/:id', authGuard, JourneyController.getById);
router.patch('/:id/stage', authGuard, requirePermission('journeys', 'update'), validateBody(journeyStageUpdateSchema), JourneyController.updateStage);

export default router;
