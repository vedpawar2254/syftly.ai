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
            unique: true,
            index: true
        },

        summaryText: {
            type: String,
            required: true,
            // 150-300 words target, ~1000-2000 characters
            minlength: 50,
            maxlength: 2000
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

        sourceCount: {
            type: Number,
            default: 0
        },

        wordCount: {
            type: Number,
            default: 0
        },

        createdAt: {
            type: Date,
            default: Date.now,
            index: true
        },

        updatedAt: {
            type: Date,
            default: Date.now
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

// Middleware to update updatedAt timestamp
topicSummarySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

topicSummarySchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

/**
 * Instance method to update summary with new data
 */
topicSummarySchema.methods.updateSummary = function(summaryText, sourcesUsed, articleData) {
    this.summaryText = summaryText;
    this.sourcesUsed = sourcesUsed;
    this.articleData = articleData;
    this.sourceCount = sourcesUsed.length;
    this.wordCount = summaryText.split(/\s+/).length;
    this.updatedAt = new Date();
    return this.save();
};

/**
 * Static method to find or create summary for a topic
 */
topicSummarySchema.statics.findOrCreate = async function(topic) {
    let summary = await this.findOne({ topic });
    if (!summary) {
        summary = new this({ topic });
        await summary.save();
    }
    return summary;
};

const TopicSummary = mongoose.model('TopicSummary', topicSummarySchema);

export default TopicSummary;
