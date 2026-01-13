import asyncHandler from '../utils/asyncHandler.js';
import { success } from '../utils/apiResponse.js';
import { getSituationById } from '../services/situation.service.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * @desc    Get situation details
 * @route   GET /api/situation/:id
 * @access  Public
 */
export const getSituation = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const situation = await getSituationById(id);

    if (!situation) {
        throw new ApiError('Situation not found', 404);
    }

    success(res, situation, 'Situation retrieved successfully');
});
