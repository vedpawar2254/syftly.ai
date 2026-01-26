/**
 * Storage Utility
 * LocalStorage operations for followed topics and user preferences
 */

const STORAGE_KEY = 'syftly_followedTopics';
const SESSION_KEY = 'syftly_sessionId';

/**
 * Generate or get session ID
 */
export function getSessionId() {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
}

/**
 * Get all followed topics from localStorage
 * @returns {Array<{topic: string, followedAt: string}>}
 */
export function getFollowedTopics() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
}

/**
 * Add a topic to followed topics
 * @param {string} topic - Topic to follow
 * @returns {boolean} Success status
 */
export function addFollowedTopic(topic) {
    try {
        const followed = getFollowedTopics();
        const exists = followed.find(t => t.topic === topic);

        if (exists) {
            return false; // Already following
        }

        followed.push({
            topic,
            followedAt: new Date().toISOString()
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(followed));
        return true;
    } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
    }
}

/**
 * Remove a topic from followed topics
 * @param {string} topic - Topic to unfollow
 * @returns {boolean} Success status
 */
export function removeFollowedTopic(topic) {
    try {
        const followed = getFollowedTopics();
        const filtered = followed.filter(t => t.topic !== topic);

        if (filtered.length === followed.length) {
            return false; // Not found
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
    }
}

/**
 * Check if a topic is followed
 * @param {string} topic - Topic to check
 * @returns {boolean}
 */
export function isTopicFollowed(topic) {
    const followed = getFollowedTopics();
    return followed.some(t => t.topic === topic);
}

/**
 * Toggle follow status for a topic
 * @param {string} topic - Topic to toggle
 * @returns {string} 'followed' | 'unfollowed' | null (error)
 */
export function toggleFollowTopic(topic) {
    if (isTopicFollowed(topic)) {
        return removeFollowedTopic(topic) ? 'unfollowed' : null;
    } else {
        return addFollowedTopic(topic) ? 'followed' : null;
    }
}

/**
 * Clear all followed topics (for testing)
 */
export function clearFollowedTopics() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

/**
 * Get localStorage usage info (for debugging)
 */
export function getStorageInfo() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        const size = data ? new Blob([data]).size : 0;

        return {
            used: size,
            count: getFollowedTopics().length,
            maxSize: 5 * 1024 * 1024, // 5MB typical limit
            percentage: (size / (5 * 1024 * 1024)) * 100
        };
    } catch (error) {
        console.error('Error getting storage info:', error);
        return null;
    }
}

export default {
    getSessionId,
    getFollowedTopics,
    addFollowedTopic,
    removeFollowedTopic,
    isTopicFollowed,
    toggleFollowTopic,
    clearFollowedTopics,
    getStorageInfo
};
