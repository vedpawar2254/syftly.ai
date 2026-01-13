/**
 * Date/time formatting utilities
 */

/**
 * Format a date relative to now (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
        return 'Just now';
    }
    if (diffMin < 60) {
        return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    }
    if (diffHour < 24) {
        return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
    }
    if (diffDay < 7) {
        return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
    }

    // Fallback to date format
    return then.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: then.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}

/**
 * Format a date for display
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
    const defaultOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    };

    return new Date(date).toLocaleDateString('en-US', {
        ...defaultOptions,
        ...options,
    });
}

/**
 * Format a timestamp for timeline display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted timestamp
 */
export function formatTimestamp(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export default { formatRelativeTime, formatDate, formatTimestamp };
