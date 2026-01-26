import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * Evidence Schema
 * Stores news articles from RSS feeds
 * Part of Milestone 1: Topic-Based News Ingestion
 */
const evidenceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        body: {
            type: String,
            required: true
        },

        source: {
            type: String,
            required: true,
            enum: ['The Hindu', 'Times of India', 'Indian Express'],
            index: true
        },

        url: {
            type: String,
            required: true,
            unique: true
        },

        publishDate: {
            type: Date,
            default: Date.now,
            index: true
        },

        fetchedAt: {
            type: Date,
            default: Date.now
        },

        topic: {
            type: String,
            index: true
        },

        // Content hash for duplicate detection
        contentHash: {
            type: String,
            index: true
        }
    },
    {
        timestamps: false
    }
);

// Indexes for efficient querying
// Note: unique index is already defined in schema field definition
evidenceSchema.index({ topic: 1, publishDate: -1 });

// Prevent updates - Evidence is immutable
evidenceSchema.pre('findOneAndUpdate', function () {
    throw new Error('Evidence documents are immutable and cannot be updated');
});

evidenceSchema.pre('updateOne', function () {
    throw new Error('Evidence documents are immutable and cannot be updated');
});

/**
 * Static method to generate content hash
 */
evidenceSchema.statics.generateHash = function(content) {
    if (!content) return null;
    return crypto
        .createHash('sha256')
        .update(content)
        .digest('hex');
};

/**
 * Instance method to check if this evidence is a duplicate
 */
evidenceSchema.methods.isDuplicate = async function() {
    const Evidence = this.constructor;
    return await Evidence.findOne({ contentHash: this.contentHash });
};

/**
 * Static method to check for duplicates before creating
 */
evidenceSchema.statics.checkDuplicate = async function(url, contentHash) {
    return await this.findOne({
        $or: [
            { url: url },
            { contentHash: contentHash }
        ]
    });
};

const Evidence = mongoose.model('Evidence', evidenceSchema);

export default Evidence;
