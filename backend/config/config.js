import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized configuration with environment variable defaults
 */
const config = {
    // Server
    port: process.env.PORT || 5002,
    nodeEnv: process.env.NODE_ENV || 'development',

    // MongoDB
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/syftlyai',

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    // CORS
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export default config;
