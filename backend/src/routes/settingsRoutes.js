import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController.js';
import { authGuard } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';
import { settingsUpdateSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', authGuard, SettingsController.getAll);
router.put('/', authGuard, requireRole(['admin']), validateBody(settingsUpdateSchema), SettingsController.update);

export default router;
