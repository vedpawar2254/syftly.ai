import express from 'express';
import { getFeed, getTopicFeed, followTopicController, getFollowedTopicsController, unfollowTopicController } from '../controllers/feed.controller.js';

const router = express.Router();

/**
 * @route   GET /api/feed
 * @desc    Get insight feed items (legacy)
 * @access  Public
 */
router.get('/', getFeed);

/**
 * @route   GET /api/feed/topic
 * @desc    Get topic-based news synthesis using LangGraph
 * @access  Public
 * @query   topic - The topic to search and synthesize
 */
router.get('/topic', getTopicFeed);

/**
 * @route   GET /api/feed/followed
 * @desc    Get followed topics for a session
 * @access  Public
 * @query   sessionId - User session identifier
 */
router.get('/followed', getFollowedTopicsController);

/**
 * @route   POST /api/feed/follow
 * @desc    Follow a topic for future updates
 * @access  Public
 * @body    { topic: string, sessionId?: string }
 */
router.post('/follow', followTopicController);

/**
 * @route   DELETE /api/feed/follow
 * @desc    Unfollow a topic
 * @access  Public
 * @body    { topic: string, sessionId?: string }
 */
router.delete('/follow', unfollowTopicController);

export default router;
