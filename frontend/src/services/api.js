/**
 * API Client for syftly.ai
 *
 * Follows CLAUDE.md constraints:
 * - Defensive response handling
 * - Frontend consumes views, not primitives
 * - No deep assumptions about data structure
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Make an API request with error handling
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Fetch options
 * @returns {Promise<object>} API response data
 */
async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON response');
        }

        const data = await response.json();

        if (!response.ok) {
            // API returned error response
            throw new ApiError(
                data.message || 'Request failed',
                response.status,
                data.errors
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Network or parsing error
        throw new ApiError(
            error.message || 'Network error',
            0,
            null
        );
    }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
    constructor(message, status, errors = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

/**
 * API methods
 */
export const api = {
    /**
     * GET request
     */
    get: (endpoint) => request(endpoint, { method: 'GET' }),

    /**
     * POST request
     */
    post: (endpoint, data) =>
        request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * PUT request
     */
    put: (endpoint, data) =>
        request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    /**
     * DELETE request
     */
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default api;
