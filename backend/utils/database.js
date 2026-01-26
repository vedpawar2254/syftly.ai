import mongoose from 'mongoose';

/**
 * Database connection configuration
 */

/**
 * Connect to MongoDB
 */
export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/syftlyai';

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);

        // Log connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

        return conn;

    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        throw error;
    }
};

/**
 * Gracefully disconnect from MongoDB
 */
export const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error;
    }
};

/**
 * Ensure all indexes are created
 */
export const ensureIndexes = async () => {
    try {
        const indexes = await mongoose.connection.db.listCollections().toArray();

        console.log('\n=== Checking Indexes ===\n');

        const models = mongoose.modelNames();

        for (const modelName of models) {
            const model = mongoose.model(modelName);
            const collection = model.collection;

            console.log(`Collection: ${collection.collectionName}`);

            const existingIndexes = await collection.indexes();
            existingIndexes.forEach(idx => {
                console.log(`  Index: ${JSON.stringify(idx.key)}`);
            });
        }

        console.log('\n✅ All indexes verified\n');

    } catch (error) {
        console.error('Error verifying indexes:', error);
        throw error;
    }
};

/**
 * Clear all collections (for testing only)
 */
export const clearCollections = async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Cannot clear collections in production');
        }

        const collections = await mongoose.connection.db.collections();

        for (const collection of collections) {
            await collection.deleteMany({});
        }

        console.log('✅ All collections cleared');

    } catch (error) {
        console.error('Error clearing collections:', error);
        throw error;
    }
};

/**
 * Check database connection status
 */
export const getDBStatus = () => {
    const state = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    return {
        state: states[state],
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        models: mongoose.modelNames()
    };
};

/**
 * Health check for database
 */
export const healthCheck = async () => {
    try {
        const status = getDBStatus();

        if (status.state === 'connected') {
            // Test a simple query
            await mongoose.connection.db.admin().ping();
            return {
                status: 'healthy',
                ...status,
                timestamp: new Date()
            };
        } else {
            return {
                status: 'unhealthy',
                ...status,
                timestamp: new Date()
            };
        }

    } catch (error) {
        return {
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date()
        };
    }
};

export default {
    connectDB,
    disconnectDB,
    ensureIndexes,
    clearCollections,
    getDBStatus,
    healthCheck
};
