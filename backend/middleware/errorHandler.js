import logger from '../utils/logger.js';
import config from '../config/config.js';

/**
 * Custom API Error class with status code
 */
export class ApiError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 404 Not Found handler
 */
export const notFound = (req, res, next) => {
    const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    // Log error
    logger.error(err.message, {
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    // Determine status code
    let statusCode = err.statusCode || 500;

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
    }

    // Handle Mongoose cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
        statusCode = 409;
    }

    // Response structure
    const response = {
        success: false,
        message: err.message || 'Server Error',
    };

    // Include stack trace in development
    if (config.nodeEnv === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default { ApiError, notFound, errorHandler };
