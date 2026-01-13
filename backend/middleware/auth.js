import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { ApiError } from './errorHandler.js';

/**
 * JWT Authentication middleware
 * Extracts and verifies JWT from Authorization header
 */
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError('No token provided, authorization denied', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ApiError('Token is not valid', 401);
    }
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for endpoints that behave differently for authenticated users
 */
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
    } catch (error) {
        // Token invalid, but we continue without user
    }

    next();
};

export default { authenticate, optionalAuth };
