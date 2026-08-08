import { Router } from 'express';
import { AuditController } from '../controllers/auditController.js';
import { authGuard } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.get('/', authGuard, requireRole(['admin', 'sales_manager', 'marketing_manager']), AuditController.list);

export default router;
