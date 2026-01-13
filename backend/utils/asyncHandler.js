/**
 * Async handler wrapper to eliminate try-catch boilerplate
 * Catches errors and passes them to Express error middleware
 *
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
