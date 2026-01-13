/**
 * Defensive property access utility
 *
 * Per CLAUDE.md Constraint 1:
 * - Fields may disappear
 * - Structures may flatten or nest
 * - No deep assumptions like situation.key_facts[0].claim
 */

/**
 * Safely get a nested property from an object
 * @param {object} obj - Source object
 * @param {string} path - Dot-notation path (e.g., 'user.profile.name')
 * @param {any} defaultValue - Value to return if path not found
 * @returns {any} Value at path or default
 *
 * @example
 * safeGet(response, 'data.items', [])
 * safeGet(situation, 'state.confidence', 0)
 */
export function safeGet(obj, path, defaultValue = undefined) {
    if (obj === null || obj === undefined) {
        return defaultValue;
    }

    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
        if (result === null || result === undefined) {
            return defaultValue;
        }

        // Handle array index notation: items[0]
        const match = key.match(/^(\w+)\[(\d+)\]$/);
        if (match) {
            const [, arrayKey, indexStr] = match;
            const index = parseInt(indexStr, 10);
            result = result[arrayKey];
            if (!Array.isArray(result) || index >= result.length) {
                return defaultValue;
            }
            result = result[index];
        } else {
            result = result[key];
        }
    }

    return result === undefined ? defaultValue : result;
}

/**
 * Check if a value exists and is not null/undefined
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export function exists(value) {
    return value !== null && value !== undefined;
}

/**
 * Ensure value is an array
 * @param {any} value - Value to check
 * @returns {Array} Value as array or empty array
 */
export function ensureArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (value === null || value === undefined) {
        return [];
    }
    return [value];
}

/**
 * Ensure value is a string
 * @param {any} value - Value to check
 * @param {string} defaultValue - Fallback value
 * @returns {string}
 */
export function ensureString(value, defaultValue = '') {
    if (typeof value === 'string') {
        return value;
    }
    if (value === null || value === undefined) {
        return defaultValue;
    }
    return String(value);
}

export default { safeGet, exists, ensureArray, ensureString };
