import mongoose from 'mongoose';

/**
 * Followed Topic Schema
 * Stores topics that users are following for future updates
 * Part of Milestone 1: LangGraph-Based News Synthesis
 */
const followedTopicSchema = new mongoose.Schema(
    {
        topic: {
            type: String,
            required: true,
            index: true
        },

        sessionId: {
            type: String,
            required: true,
            default: 'default',
            index: true
        },

        // Track last synthesis time for periodic updates
        lastSynthesizedAt: {
            type: Date,
            default: Date.now
        },

        createdAt: {
            type: Date,
            default: Date.now,
            index: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: false
    }
);

// Compound index for efficient querying
followedTopicSchema.index({ sessionId: 1, createdAt: -1 });
followedTopicSchema.index({ sessionId: 1, topic: 1 });

const FollowedTopic = mongoose.model('FollowedTopic', followedTopicSchema);

export default FollowedTopic;
