/**
 * Situation Service
 * Business logic for situation operations
 * Currently returns mock data - will be replaced with real implementation
 */

/**
 * Mock situation data following CLAUDE.md SituationDeepDive spec
 */
const mockSituations = {
    '1': {
        id: '1',
        headline: 'Venezuela Political Crisis',
        current_state: 'Opposition coalition continues to challenge election results. International community divided on recognition. Protests reported in major cities.',
        timeline: [
            {
                time: new Date(Date.now() - 86400000).toISOString(),
                change: 'Initial election results announced',
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
        current_state: 'New emissions targets proposed with cross-party support. Implementation timeline under negotiation with member states.',
        timeline: [
            {
                time: new Date(Date.now() - 172800000).toISOString(),
                change: 'Draft proposal leaked',
                impact: 'Signals policy direction',
            },
            {
                time: new Date().toISOString(),
                change: 'Official announcement',
                impact: 'Confirms policy details',
            },
        ],
        sources: ['European Commission', 'Politico EU'],
    },
};

/**
 * Get situation by ID
 * @param {string} id - Situation ID
 * @returns {Promise<Object|null>} Situation object or null if not found
 */
export const getSituationById = async (id) => {
    // TODO: Replace with real database query
    return mockSituations[id] || null;
};

export default { getSituationById };
