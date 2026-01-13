import mongoose from 'mongoose';

/**
 * Evidence Schema
 * Immutable, append-only foundation
 * References: arch.md section 4.1
 */
const evidenceSchema = new mongoose.Schema(
    {
        source: {
            type: {
                type: String,
                enum: ['news', 'blog', 'gov', 'social'],
                required: true,
            },
            publisher: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },

        observed_at: {
            type: Date,
            required: true,
        },

        ingested_at: {
            type: Date,
            default: Date.now,
        },

        raw_content: {
            title: {
                type: String,
                required: true,
            },
            body: {
                type: String,
                required: true,
            },
        },

        metadata: {
            language: {
                type: String,
                default: 'en',
            },
            region: {
                type: String,
                default: 'global',
            },
        },
    },
    {
        timestamps: false, // We handle timestamps manually
    }
);

// Prevent updates - Evidence is immutable
evidenceSchema.pre('findOneAndUpdate', function () {
    throw new Error('Evidence documents are immutable and cannot be updated');
});

evidenceSchema.pre('updateOne', function () {
    throw new Error('Evidence documents are immutable and cannot be updated');
});

// Index for efficient querying
evidenceSchema.index({ 'source.publisher': 1 });
evidenceSchema.index({ observed_at: -1 });
evidenceSchema.index({ ingested_at: -1 });

const Evidence = mongoose.model('Evidence', evidenceSchema);

export default Evidence;
