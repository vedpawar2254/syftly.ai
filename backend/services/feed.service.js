/**
 * Feed Service
 * Business logic for generating feed items
 * Includes LangGraph workflow integration for topic-based news synthesis
 */

import { TopicSummary, FollowedTopic } from '../models/index.js';
import Evidence from '../models/evidence.js';

/**
 * Mock feed data following CLAUDE.md FeedItem spec
 */
const mockFeedItems = [
    {
        id: '1',
        title: 'Venezuela Opposition Claims Election Fraud',
        summary: 'Multiple international observers have noted irregularities in vote counting procedures. The opposition coalition has formally contested results in three key provinces.',
        confidence: 0.82,
        why: 'New evidence from Reuters and AP confirms initial reports of discrepancies',
        updated_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'EU Announces New Climate Framework',
        summary: 'The European Union has proposed updated emissions targets for 2035, building on existing Green Deal commitments with stricter industrial standards.',
        confidence: 0.91,
        why: 'Official EU documentation released and verified',
        updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: '3',
        title: 'Tech Sector Layoffs Continue',
        summary: 'Major technology companies have announced additional workforce reductions, citing economic uncertainty and AI-driven efficiency gains.',
        confidence: 0.75,
        why: 'Multiple sources reporting, some details still unconfirmed',
        updated_at: new Date(Date.now() - 7200000).toISOString(),
    },
];

/**
 * Get feed items
 * @returns {Promise<Array>} Array of FeedItem objects
 */
export const getFeedItems = async () => {
    // TODO: Replace with real implementation
    // Will aggregate from Situations and recent Changes
    return mockFeedItems;
};

/**
 * Generate news synthesis for a given topic using LangGraph
 * @param {string} topic - The topic to search and synthesize
 * @returns {Promise<Object>} Synthesized result with summary and articles
 */
export const getTopicSynthesis = async (topic) => {
    try {
        // Import LangGraph workflow
        const { executeNewsGraph } = await import('../graph/newsGraph.js');
        
        // Execute the workflow
        const result = await executeNewsGraph(topic);
        
        // Store articles as Evidence if they don't exist
        const articleIds = [];
         for (const article of result.articles) {
            // Try to find existing evidence by URL
            let evidence = await Evidence.findOne({ url: article.url });
            
            if (!evidence) {
                // Validate article data before creating
                if (!article.title || !article.content || !article.url) {
                    console.error('Skipping invalid article (missing required fields)');
                    continue;
                }
                
                // Create new evidence
                console.log('Creating Evidence with fields:', {
                    title: article.title,
                    body: article.content,
                    source: article.source,
                    url: article.url,
                    publishDate: article.publishDate,
                    fetchedAt: new Date()
                });
                
                evidence = new Evidence({
                    title: article.title,
                    body: article.content,
                    source: article.source,
                    url: article.url,
                    publishDate: article.publishDate,
                    fetchedAt: new Date()
                });
                await evidence.save();
                console.log('Evidence saved successfully');
            } else {
                console.log('Evidence already exists, skipping');
            }
            articleIds.push(evidence._id);
        }
        
        // Store the summary in database
        if (result.summary && !result.error && result.summary.length >= 50) {
            const wordCount = result.summary.split(/\s+/).length;
            const trimmedTopic = result.topic.trim();
            
            // Use findOneAndUpdate with upsert to create or update
            await TopicSummary.findOneAndUpdate(
                { topic: trimmedTopic },
                {
                    topic: trimmedTopic,
                    summaryText: result.summary,
                    sourcesUsed: result.sources,
                    articleIds,
                    articleData: result.articles,
                    wordCount,
                    updatedAt: new Date()
                },
                { upsert: true, new: true }
            );
        } else if (result.summary && result.summary.length < 50) {
            console.warn(`Summary for topic "${result.topic}" is too short (${result.summary.length} chars), skipping database save`);
        }
        
        // Transform the result for the API response
        return {
            topic: result.topic,
            summary: result.summary,
            articles: result.articles,
            sources: result.sources,
            articleCount: result.articles.length,
            sourceCount: result.sources.length,
            error: result.error,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Feed service error:', error);
        throw new Error(`Failed to generate synthesis: ${error.message}`);
    }
};

/**
 * Store a followed topic in database
 * @param {string} topic - The topic to follow
 * @param {string} sessionId - User session identifier
 * @returns {Promise<Object>} Confirmation with topic and timestamp
 */
export const followTopic = async (topic, sessionId = 'default') => {
    try {
        // Check if already following
        const existing = await FollowedTopic.findOne({
            topic,
            sessionId,
            isActive: true
        });
        
        if (existing) {
            return {
                success: true,
                message: `Already following "${topic}"`,
                topic: existing
            };
        }
        
        // Create new followed topic
        const followedTopic = new FollowedTopic({
            topic,
            sessionId
        });
        
        await followedTopic.save();
        
        return {
            success: true,
            message: `Now following "${topic}"`,
            topic: followedTopic
        };
    } catch (error) {
        console.error('Follow topic error:', error);
        throw new Error(`Failed to follow topic: ${error.message}`);
    }
};

/**
 * Get all followed topics for a session
 * @param {string} sessionId - User session identifier
 * @returns {Promise<Array>} Array of followed topics
 */
export const getFollowedTopics = async (sessionId = 'default') => {
    try {
        const topics = await FollowedTopic.find({
            sessionId,
            isActive: true
        }).sort({ createdAt: -1 });
        
        return topics;
    } catch (error) {
        console.error('Get followed topics error:', error);
        throw new Error(`Failed to get followed topics: ${error.message}`);
    }
};

/**
 * Unfollow a topic
 * @param {string} topic - The topic to unfollow
 * @param {string} sessionId - User session identifier
 * @returns {Promise<Object>} Confirmation
 */
export const unfollowTopic = async (topic, sessionId = 'default') => {
    try {
        const result = await FollowedTopic.findOneAndUpdate(
            { topic, sessionId },
            { isActive: false },
            { new: true }
        );
        
        if (!result) {
            return {
                success: false,
                message: `Topic "${topic}" not found`
            };
        }
        
        return {
            success: true,
            message: `Unfollowed "${topic}"`,
            topic: result
        };
    } catch (error) {
        console.error('Unfollow topic error:', error);
        throw new Error(`Failed to unfollow topic: ${error.message}`);
    }
};

export default {
    getFeedItems,
    getTopicSynthesis,
    followTopic,
    getFollowedTopics,
    unfollowTopic
};
