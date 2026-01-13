import express from 'express';
import { getSituation } from '../controllers/situation.controller.js';

const router = express.Router();

/**
 * @route   GET /api/situation/:id
 * @desc    Get situation details
 * @access  Public
 */
router.get('/:id', getSituation);

export default router;
