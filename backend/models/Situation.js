import mongoose from 'mongoose';

/**
 * Situation Schema
 * Current belief state - mutable only via Change
 * References: arch.md section 4.3
 */
const keyFactSchema = new mongoose.Schema(
    {
        fact_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
        },
        claim: {
            type: String,
            required: true,
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            required: true,
        },
        entity_refs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entity',
        }],
    },
    { _id: false }
);

const situationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['evolving', 'one_shot'],
            required: true,
        },

        scope: {
            canonical_query: {
                type: String,
                required: true,
            },
            entities: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Entity',
            }],
        },

        state: {
            summary: {
                type: String,
                required: true,
                maxlength: 500, // ~3 sentences
            },
            status: {
                type: String,
                enum: ['ongoing', 'resolved', 'uncertain'],
                default: 'ongoing',
            },
            confidence: {
                type: Number,
                min: 0,
                max: 1,
                default: 0.5,
            },
        },

        key_facts: [keyFactSchema],

        created_at: {
            type: Date,
            default: Date.now,
        },

        last_updated_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false, // We manage created_at and last_updated_at manually
    }
);

// Update last_updated_at on save
situationSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.last_updated_at = new Date();
    }
    next();
});

// Indexes
situationSchema.index({ 'scope.canonical_query': 'text' });
situationSchema.index({ 'state.status': 1 });
situationSchema.index({ last_updated_at: -1 });

const Situation = mongoose.model('Situation', situationSchema);

export default Situation;
