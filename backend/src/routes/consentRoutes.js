import { Router } from 'express';
import { ConsentController } from '../controllers/consentController.js';
import { authGuard } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { consentUpdateSchema } from '../validators/schemas.js';

const router = Router();

router.get('/:customerId', authGuard, ConsentController.getByCustomerId);
router.put('/:customerId', authGuard, validateBody(consentUpdateSchema), ConsentController.updateConsent);

export default router;
