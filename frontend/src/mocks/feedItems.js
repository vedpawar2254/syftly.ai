/**
 * Mock feed items following CLAUDE.md FeedItem spec
 *
 * Shape:
 * {
 *   id: string
 *   title: "What changed"
 *   summary: "2-3 line insight"
 *   confidence: 0.82
 *   why: "Because of new confirmation from X"
 *   updated_at: timestamp
 * }
 */
export const mockFeedItems = [
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
    {
        id: '4',
        title: 'Central Banks Signal Rate Pause',
        summary: 'Federal Reserve and ECB officials indicate willingness to pause interest rate hikes pending incoming economic data.',
        confidence: 0.88,
        why: 'Official statements from multiple central bank governors',
        updated_at: new Date(Date.now() - 10800000).toISOString(),
    },
];

export default mockFeedItems;
