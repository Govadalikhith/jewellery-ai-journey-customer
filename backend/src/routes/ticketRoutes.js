import { Router } from 'express';
import { TicketController } from '../controllers/ticketController.js';
import { authGuard } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';
import { ticketCreateSchema, ticketMessageSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', authGuard, TicketController.list);
router.get('/:id', authGuard, TicketController.getById);
router.post('/', authGuard, requirePermission('tickets', 'create'), validateBody(ticketCreateSchema), TicketController.create);
router.post('/:id/messages', authGuard, validateBody(ticketMessageSchema), TicketController.addMessage);
router.post('/:id/ai-draft', authGuard, TicketController.generateAiDraft);
router.patch('/:id/status', authGuard, requirePermission('tickets', 'update'), TicketController.updateStatus);

export default router;
