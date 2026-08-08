import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

router.get('/', authGuard, NotificationController.list);
router.patch('/:id/read', authGuard, NotificationController.markRead);
router.post('/mark-all-read', authGuard, NotificationController.markAllRead);

export default router;
