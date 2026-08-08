import { Router } from 'express';
import { SegmentController } from '../controllers/segmentController.js';
import { authGuard } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';
import { segmentCreateSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', authGuard, SegmentController.listSegments);
router.post('/', authGuard, requireRole(['admin', 'marketing_manager']), validateBody(segmentCreateSchema), SegmentController.createSegment);
router.get('/campaigns', authGuard, SegmentController.listCampaigns);
router.post('/campaigns', authGuard, requireRole(['admin', 'marketing_manager']), SegmentController.createCampaign);

export default router;
