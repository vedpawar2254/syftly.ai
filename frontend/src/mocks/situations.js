/**
 * Mock situations following CLAUDE.md SituationDeepDive spec
 *
 * Shape:
 * {
 *   headline: "Venezuela political crisis"
 *   current_state: "..."
 *   timeline: [
 *     { time: timestamp, change: "New confirmation", impact: "Raises confidence" }
 *   ]
 *   sources: ["Reuters", "AP"]
 * }
 */
export const mockSituations = {
    '1': {
        id: '1',
        headline: 'Venezuela Political Crisis',
        current_state: 'Opposition coalition continues to challenge election results. International community divided on recognition. Protests reported in major cities with varying intensity.',
        timeline: [
            {
                time: new Date(Date.now() - 172800000).toISOString(),
                change: 'Election day concludes',
                impact: 'Sets baseline for contested period',
            },
            {
                time: new Date(Date.now() - 86400000).toISOString(),
                change: 'Initial results announced',
                impact: 'Establishes contested legitimacy',
            },
            {
                time: new Date(Date.now() - 43200000).toISOString(),
                change: 'Opposition files formal challenge',
                impact: 'Escalates political tension',
            },
            {
                time: new Date().toISOString(),
                change: 'International observers report irregularities',
                impact: 'Raises confidence in fraud claims',
            },
        ],
        sources: ['Reuters', 'AP', 'BBC', 'Al Jazeera'],
    },
    '2': {
        id: '2',
        headline: 'EU Climate Framework 2035',
        current_state: 'New emissions targets proposed with cross-party support. Implementation timeline under negotiation with member states. Industry groups expressing concerns about compliance costs.',
        timeline: [
            {
                time: new Date(Date.now() - 604800000).toISOString(),
                change: 'Commission begins internal review',
                impact: 'Signals upcoming policy shift',
            },
            {
                time: new Date(Date.now() - 172800000).toISOString(),
                change: 'Draft proposal leaked to media',
                impact: 'Accelerates public debate',
            },
            {
                time: new Date().toISOString(),
                change: 'Official announcement and documentation released',
                impact: 'Confirms policy direction',
            },
        ],
        sources: ['European Commission', 'Politico EU', 'Financial Times'],
    },
    '3': {
        id: '3',
        headline: 'Global Tech Workforce Realignment',
        current_state: 'Major technology companies continuing workforce reductions. Estimated 150,000 positions affected across sector. AI capabilities cited as key driver alongside economic factors.',
        timeline: [
            {
                time: new Date(Date.now() - 2592000000).toISOString(),
                change: 'First major company announces cuts',
                impact: 'Breaks post-pandemic hiring trend',
            },
            {
                time: new Date(Date.now() - 604800000).toISOString(),
                change: 'Second wave of announcements',
                impact: 'Confirms sector-wide pattern',
            },
            {
                time: new Date().toISOString(),
                change: 'AI efficiency gains cited in earnings calls',
                impact: 'Shifts narrative from temporary to structural',
            },
        ],
        sources: ['The Information', 'TechCrunch', 'Wall Street Journal', 'Bloomberg'],
    },
};

export default mockSituations;
