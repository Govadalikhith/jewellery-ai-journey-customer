import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authGuard, AnalyticsController.getDashboard);
router.get('/export', authGuard, AnalyticsController.exportCsv);

export default router;
