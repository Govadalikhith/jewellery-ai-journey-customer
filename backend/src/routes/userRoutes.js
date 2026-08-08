import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authGuard } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.get('/', authGuard, requireRole(['admin']), UserController.list);
router.get('/roles', authGuard, requireRole(['admin']), UserController.listRoles);
router.post('/', authGuard, requireRole(['admin']), UserController.create);
router.patch('/:id/status', authGuard, requireRole(['admin']), UserController.toggleStatus);

export default router;
