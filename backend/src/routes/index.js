import { Router } from 'express';
import authRoutes from './authRoutes.js';
import customerRoutes from './customerRoutes.js';
import journeyRoutes from './journeyRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import aiRoutes from './aiRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import consentRoutes from './consentRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import userRoutes from './userRoutes.js';
import auditRoutes from './auditRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import segmentRoutes from './segmentRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/journeys', journeyRoutes);
router.use('/tickets', ticketRoutes);
router.use('/ai', aiRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/consents', consentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/users', userRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/settings', settingsRoutes);
router.use('/segments', segmentRoutes);

export default router;
