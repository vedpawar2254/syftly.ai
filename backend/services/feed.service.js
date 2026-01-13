/**
 * Feed Service
 * Business logic for generating feed items
 * Currently returns mock data - will be replaced with real implementation
 */

/**
 * Mock feed data following CLAUDE.md FeedItem spec
 */
const mockFeedItems = [
    {
        id: '1',
        title: 'Venezuela Opposition Claims Election Fraud',
        summary: 'Multiple international observers have noted irregularities in vote counting procedures. The opposition coalition has formally contested results in three key provinces.',
        confidence: 0.82,
        why: 'New evidence from Reuters and AP confirms initial reports of discrepancies',
        updated_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'EU Announces New Climate Framework',
        summary: 'The European Union has proposed updated emissions targets for 2035, building on existing Green Deal commitments with stricter industrial standards.',
        confidence: 0.91,
        why: 'Official EU documentation released and verified',
        updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: '3',
        title: 'Tech Sector Layoffs Continue',
        summary: 'Major technology companies have announced additional workforce reductions, citing economic uncertainty and AI-driven efficiency gains.',
        confidence: 0.75,
        why: 'Multiple sources reporting, some details still unconfirmed',
        updated_at: new Date(Date.now() - 7200000).toISOString(),
    },
];

/**
 * Get feed items
 * @returns {Promise<Array>} Array of FeedItem objects
 */
export const getFeedItems = async () => {
    // TODO: Replace with real implementation
    // Will aggregate from Situations and recent Changes
    return mockFeedItems;
};

export default { getFeedItems };
