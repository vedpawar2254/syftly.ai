import mongoose from 'mongoose';
import config from './config.js';
import logger from '../utils/logger.js';

/**
 * Connect to MongoDB with retry logic
 */
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoUri, {
            // Connection pool settings
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        logger.info(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB connection error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB error: ${err.message}`);
});

export default mongoose;
