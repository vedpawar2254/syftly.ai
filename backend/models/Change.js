import mongoose from 'mongoose';

/**
 * Change Schema
 * Append-only belief updates - never deleted
 * References: arch.md section 4.4
 */
const changeSchema = new mongoose.Schema(
    {
        situation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Situation',
            required: true,
        },

        triggering_evidence: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Evidence',
        }],

        change_type: {
            type: String,
            enum: ['new_fact', 'confirmation', 'contradiction', 'resolution'],
            required: true,
        },

        before: {
            summary: {
                type: String,
                required: true,
            },
        },

        after: {
            summary: {
                type: String,
                required: true,
            },
        },

        reasoning: {
            type: String,
            required: true,
        },

        proposed_at: {
            type: Date,
            default: Date.now,
        },

        accepted_at: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: false,
    }
);

// Prevent updates - Change is append-only
changeSchema.pre('findOneAndUpdate', function () {
    throw new Error('Change documents are append-only and cannot be updated');
});

changeSchema.pre('updateOne', function () {
    throw new Error('Change documents are append-only and cannot be updated');
});

// Prevent deletion
changeSchema.pre('findOneAndDelete', function () {
    throw new Error('Change documents cannot be deleted');
});

changeSchema.pre('deleteOne', function () {
    throw new Error('Change documents cannot be deleted');
});

// Indexes
changeSchema.index({ situation_id: 1 });
changeSchema.index({ proposed_at: -1 });
changeSchema.index({ change_type: 1 });

const Change = mongoose.model('Change', changeSchema);

export default Change;
