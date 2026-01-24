import mongoose from 'mongoose';

/**
 * Topic Summary Schema
 * Stores AI-synthesized summaries generated from multiple articles
 * Part of Milestone 1: LangGraph-Based News Synthesis
 */
const topicSummarySchema = new mongoose.Schema(
    {
        topic: {
            type: String,
            required: true,
            index: true
        },

        summaryText: {
            type: String,
            required: true,
            // 200-300 words target, ~1500-2000 characters
            maxlength: 3000
        },

        sourcesUsed: [{
            type: String,
            required: true
        }],

        articleIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Evidence'
        }],

        // Store article data references for quick access
        articleData: [{
            title: String,
            source: String,
            url: String,
            publishDate: Date
        }],

        // Metadata
        wordCount: {
            type: Number,
            default: 0
        },

        createdAt: {
            type: Date,
            default: Date.now,
            index: true
        },

        expiresAt: {
            type: Date,
            default: function() {
                // Summaries expire after 24 hours
                const twentyFourHours = 24 * 60 * 60 * 1000;
                return new Date(Date.now() + twentyFourHours);
            }
        }
    },
    {
        timestamps: false
    }
);

// Compound index for efficient querying
topicSummarySchema.index({ topic: 1, createdAt: -1 });

// TTL index for automatic cleanup of expired summaries
topicSummarySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TopicSummary = mongoose.model('TopicSummary', topicSummarySchema);

export default TopicSummary;
