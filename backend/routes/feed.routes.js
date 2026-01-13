import express from 'express';
import { getFeed } from '../controllers/feed.controller.js';

const router = express.Router();

/**
 * @route   GET /api/feed
 * @desc    Get insight feed items
 * @access  Public
 */
router.get('/', getFeed);

export default router;
