import asyncHandler from '../utils/asyncHandler.js';
import { success } from '../utils/apiResponse.js';
import { getFeedItems, getTopicSynthesis, followTopic, getFollowedTopics, unfollowTopic } from '../services/feed.service.js';

/**
 * @desc    Get insight feed items
 * @route   GET /api/feed
 * @access  Public
 */
export const getFeed = asyncHandler(async (req, res) => {
    const feedItems = await getFeedItems();
    success(res, feedItems, 'Feed retrieved successfully');
});

/**
 * @desc    Get topic-based news synthesis using LangGraph
 * @route   GET /api/feed/topic
 * @access  Public
 */
export const getTopicFeed = asyncHandler(async (req, res) => {
    const { topic } = req.query;
    
    if (!topic) {
        return res.status(400).json({
            success: false,
            message: 'Topic parameter is required'
        });
    }
    
    const synthesis = await getTopicSynthesis(topic);
    
    // Handle error cases
    if (synthesis.error) {
        return res.status(200).json({
            success: false,
            error: synthesis.error,
            topic: synthesis.topic
        });
    }
    
    success(res, synthesis, 'Topic synthesis retrieved successfully');
});

/**
 * @desc    Follow a topic for future updates
 * @route   POST /api/feed/follow
 * @access  Public
 */
export const followTopicController = asyncHandler(async (req, res) => {
    const { topic } = req.body;
    const { sessionId } = req.body;
    
    if (!topic) {
        return res.status(400).json({
            success: false,
            message: 'Topic is required'
        });
    }
    
    const result = await followTopic(topic, sessionId);
    success(res, result, 'Topic followed successfully');
});

/**
 * @desc    Get followed topics for a session
 * @route   GET /api/feed/followed
 * @access  Public
 */
export const getFollowedTopicsController = asyncHandler(async (req, res) => {
    const { sessionId } = req.query;
    const topics = await getFollowedTopics(sessionId);
    success(res, topics, 'Followed topics retrieved successfully');
});

/**
 * @desc    Unfollow a topic
 * @route   DELETE /api/feed/follow
 * @access  Public
 */
export const unfollowTopicController = asyncHandler(async (req, res) => {
    const { topic } = req.body;
    const { sessionId } = req.body;
    
    if (!topic) {
        return res.status(400).json({
            success: false,
            message: 'Topic is required'
        });
    }
    
    const result = await unfollowTopic(topic, sessionId);
    success(res, result, 'Topic unfollowed successfully');
});
