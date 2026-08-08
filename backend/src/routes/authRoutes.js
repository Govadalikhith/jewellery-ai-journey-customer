import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authGuard } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { loginSchema } from '../validators/schemas.js';

const router = Router();

router.post('/login', validateBody(loginSchema), AuthController.login);
router.get('/me', authGuard, AuthController.me);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/logout', authGuard, AuthController.logout);

export default router;
