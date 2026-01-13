import mongoose from 'mongoose';

/**
 * Entity Schema
 * Simple linking entities - no opinions
 * References: arch.md section 4.2
 */
const entitySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['person', 'org', 'country', 'company'],
            required: true,
        },

        name: {
            type: String,
            required: true,
            unique: true,
        },

        aliases: [{
            type: String,
        }],
    },
    {
        timestamps: true,
    }
);

// Index for name and alias lookups
entitySchema.index({ name: 'text', aliases: 'text' });
entitySchema.index({ type: 1 });

const Entity = mongoose.model('Entity', entitySchema);

export default Entity;
