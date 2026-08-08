import { Router } from 'express';
import { CustomerController } from '../controllers/customerController.js';
import { authGuard } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';
import { customerCreateSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', authGuard, CustomerController.list);
router.get('/:id', authGuard, CustomerController.getById);
router.post('/', authGuard, requirePermission('customers', 'create'), validateBody(customerCreateSchema), CustomerController.create);

export default router;
