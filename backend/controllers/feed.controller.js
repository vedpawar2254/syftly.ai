import asyncHandler from '../utils/asyncHandler.js';
import { success } from '../utils/apiResponse.js';
import { getFeedItems } from '../services/feed.service.js';

/**
 * @desc    Get insight feed items
 * @route   GET /api/feed
 * @access  Public
 */
export const getFeed = asyncHandler(async (req, res) => {
    const feedItems = await getFeedItems();

    success(res, feedItems, 'Feed retrieved successfully');
});
