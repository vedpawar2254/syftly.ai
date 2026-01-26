/**
 * Feed API Client
 * API functions for feed and follow operations
 */

import axios from 'axios';
import { getSessionId } from '../utils/storage.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Get topic feed (synthesis and articles)
 * @param {string} topic - Topic to search
 * @returns {Promise<Object>} Feed data with summary and articles
 */
export const getTopicFeed = async (topic) => {
    try {
        const response = await api.get('/feed/topic', {
            params: { topic }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting topic feed:', error);
        throw error.response?.data || error.message;
    }
};

/**
 * Follow a topic
 * @param {string} topic - Topic to follow
 * @returns {Promise<Object>} Response with success and message
 */
export const followTopic = async (topic) => {
    try {
        const sessionId = getSessionId();
        const response = await api.post('/feed/follow', {
            topic,
            sessionId
        });
        return response.data;
    } catch (error) {
        console.error('Error following topic:', error);
        throw error.response?.data || error.message;
    }
};

/**
 * Unfollow a topic
 * @param {string} topic - Topic to unfollow
 * @returns {Promise<Object>} Response with success and message
 */
export const unfollowTopic = async (topic) => {
    try {
        const sessionId = getSessionId();
        const response = await api.delete('/feed/follow', {
            data: { topic, sessionId }
        });
        return response.data;
    } catch (error) {
        console.error('Error unfollowing topic:', error);
        throw error.response?.data || error.message;
    }
};

/**
 * Get followed topics for current session
 * @returns {Promise<Array>} List of followed topics
 */
export const getFollowedTopics = async () => {
    try {
        const sessionId = getSessionId();
        const response = await api.get('/feed/followed', {
            params: { sessionId }
        });
        return response.data.data || response.data;
    } catch (error) {
        console.error('Error getting followed topics:', error);
        return [];
    }
};

/**
 * Toggle follow status for a topic
 * @param {string} topic - Topic to toggle
 * @param {boolean} isCurrentlyFollowed - Current follow status
 * @returns {Promise<Object>} Response
 */
export const toggleFollow = async (topic, isCurrentlyFollowed) => {
    if (isCurrentlyFollowed) {
        return await unfollowTopic(topic);
    } else {
        return await followTopic(topic);
    }
};

export default {
    getTopicFeed,
    followTopic,
    unfollowTopic,
    getFollowedTopics,
    toggleFollow
};
