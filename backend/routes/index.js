import express from 'express';
import feedRoutes from './feed.routes.js';
import situationRoutes from './situation.routes.js';
import healthRoutes from './health.routes.js';

const router = express.Router();

// Health check
router.use('/health', healthRoutes);

// API routes
router.use('/feed', feedRoutes);
router.use('/situation', situationRoutes);

export default router;
