import mongoose from 'mongoose';

/**
 * Followed Topic Schema
 * Stores topics that users are following for future updates
 * Part of Milestone 1: Follow Feature
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

        userId: {
            type: String,
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

// Compound indexes for efficient querying
followedTopicSchema.index({ sessionId: 1, createdAt: -1 });
followedTopicSchema.index({ sessionId: 1, topic: 1 });
followedTopicSchema.index({ userId: 1, topic: 1 });

// Unique constraint: One topic per session (if active)
followedTopicSchema.index({ sessionId: 1, topic: 1, isActive: 1 }, { unique: true });

/**
 * Instance method to mark as unfollowed
 */
followedTopicSchema.methods.unfollow = async function() {
    this.isActive = false;
    return await this.save();
};

/**
 * Static method to follow a topic
 */
followedTopicSchema.statics.follow = async function(topic, sessionId, userId = null) {
    // Check if already following
    const existing = await this.findOne({
        sessionId,
        topic,
        isActive: true
    });

    if (existing) {
        return existing;
    }

    // Create new followed topic
    const followedTopic = new this({
        topic,
        sessionId,
        userId
    });

    await followedTopic.save();
    return followedTopic;
};

/**
 * Static method to unfollow a topic
 */
followedTopicSchema.statics.unfollow = async function(topic, sessionId) {
    const followedTopic = await this.findOne({
        sessionId,
        topic,
        isActive: true
    });

    if (followedTopic) {
        followedTopic.isActive = false;
        await followedTopic.save();
        return true;
    }

    return false;
};

/**
 * Static method to list all followed topics for a session
 */
followedTopicSchema.statics.listFollowed = async function(sessionId, userId = null) {
    const query = {
        sessionId,
        isActive: true
    };

    if (userId) {
        query.userId = userId;
    }

    return await this.find(query)
        .sort({ createdAt: -1 })
        .select('topic sessionId userId createdAt lastSynthesizedAt');
};

/**
 * Static method to check if a topic is followed
 */
followedTopicSchema.statics.isFollowed = async function(topic, sessionId) {
    const followed = await this.findOne({
        sessionId,
        topic,
        isActive: true
    });

    return !!followed;
};

const FollowedTopic = mongoose.model('FollowedTopic', followedTopicSchema);

export default FollowedTopic;
