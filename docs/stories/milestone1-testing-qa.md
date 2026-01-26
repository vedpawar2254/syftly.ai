# Story: Milestone 1 - Testing and Quality Assurance

**Epic:** Core Platform Foundation
**Priority:** High
**Status:** Not Started
**Story ID:** MS1-005

## Story Summary

Implement comprehensive testing and quality assurance for Milestone 1, including unit tests, integration tests, end-to-end tests, and quality metrics validation. Ensure all acceptance criteria are met and the system performs within defined constraints.

## User Story

As a development team, we want thorough testing and quality assurance, so that we can deliver a reliable, bug-free product that meets all acceptance criteria.

## Acceptance Criteria

1. All backend services have unit tests with >80% code coverage
2. All frontend components have unit tests
3. Integration tests for all API endpoints
4. End-to-end tests for critical user flows
5. Performance tests meet quality metrics (<10s flow, 150-300 word summaries)
6. Edge cases are tested and handled gracefully
7. Linting passes with no errors
8. TypeScript type checking passes (if using TypeScript)
9. Code follows project coding standards
10. Test results are documented

## Tasks

### Task 1: Backend Unit Tests
- [ ] Create test setup in `backend/tests/`
- [ ] Set up testing framework (Jest/Mocha)
- [ ] Create unit tests for `newsScraper.js`:
  - RSS feed fetching
  - Article parsing
  - Error handling for failed sources
- [ ] Create unit tests for `llmAgent.js`:
  - Topic matching logic
  - Summary generation
  - Error handling for LLM API failures
- [ ] Create unit tests for database models:
  - Evidence model validation
  - TopicSummary model validation
  - FollowedTopic model validation
- [ ] Create unit tests for utility functions:
  - Content hash generation
  - Duplicate detection
  - URL encoding/decoding

### Task 2: Frontend Unit Tests
- [ ] Create test setup in `frontend/tests/` or `frontend/src/__tests__/`
- [ ] Set up testing framework (Jest + React Testing Library)
- [ ] Create unit tests for `Feed.jsx`:
  - Component renders correctly
  - State updates on topic search
  - Loading states
  - Error states
- [ ] Create unit tests for `FollowButton.jsx`:
  - Toggle follow/unfollow
  - Button state changes
  - API calls
- [ ] Create unit tests for `FollowedTopics.jsx`:
  - List displays correctly
  - Topic click handlers
  - Unfollow functionality
- [ ] Create unit tests for storage utility:
  - localStorage operations
  - Error handling
  - State persistence

### Task 3: API Integration Tests
- [ ] Create integration tests in `backend/tests/integration/`
- [ ] Test GET `/api/feed/topic?topic=...`:
  - Valid topic request
  - Invalid topic request
  - Empty results
  - LLM API failure
- [ ] Test POST `/api/follow`:
  - Follow topic
  - Unfollow topic
  - Duplicate follow
  - Invalid data
- [ ] Test GET `/api/follow/list`:
  - List followed topics
  - Empty list
- [ ] Test database operations:
  - Create records
  - Update records
  - Delete records
  - Query with indexes
- [ ] Test error handling:
  - Database connection failure
  - LLM API timeout
  - RSS feed failure

### Task 4: End-to-End Tests
- [ ] Set up E2E testing framework (Cypress or Playwright)
- [ ] Create test for complete user flow:
  1. Navigate to home page
  2. Click on Feed
  3. Enter topic "elections"
  4. Click search
  5. Wait for results
  6. Verify summary displayed
  7. Verify articles listed
  8. Click "Follow [Topic]"
  9. Verify button state changes
  10. Verify topic appears in followed list
  11. Click followed topic
  12. Verify feed loads for topic
  13. Unfollow topic
  14. Verify topic removed from list
- [ ] Test edge cases:
  - Zero articles found
  - Single article found
  - Source timeout
  - Network errors
- [ ] Test navigation:
  - Back button
  - Direct URL access
  - Page refresh

### Task 5: Performance Tests
- [ ] Measure end-to-end flow completion time
- [ ] Test with common topics (elections, cricket, budget)
- [ ] Verify flow completes <10 seconds (target: <10s, acceptable: <15s)
- [ ] Test summary length:
  - Verify 150-300 words
  - Count words from LLM output
- [ ] Test article count:
  - Verify 5+ articles for common topics
  - Test with various topics
- [ ] Test concurrent requests:
  - Multiple users searching topics
  - Resource usage and response times
- [ ] Document performance results

### Task 6: Quality Metrics Validation
- [ ] Verify at least 2 news sources successfully ingested
- [ ] Verify common topics return 5+ articles
- [ ] Verify synthesized summary length: 150-300 words
- [ ] Verify end-to-end flow: <10 seconds
- [ ] Verify summary includes content from at least 2 sources
- [ ] Verify false positive/negative rates <20% (from validation tests)
- [ ] Document all quality metrics

### Task 7: Linting and Code Quality
- [ ] Run `npm run lint` in backend (fix any issues)
- [ ] Run `npm run lint` in frontend (fix any issues)
- [ ] Configure ESLint rules if needed
- [ ] Add pre-commit hooks for linting (optional)
- [ ] Run `npm run typecheck` if using TypeScript
- [ ] Fix any type errors
- [ ] Ensure code follows project coding standards
- [ ] Review code for best practices

### Task 8: Edge Case Testing
- [ ] Test zero articles found:
  - Display appropriate message
  - No errors
- [ ] Test single article found:
  - Display article directly
  - Show note about single source
- [ ] Test source timeout:
  - Skip failed source
  - Proceed with others
  - Display partial results with note
- [ ] Test duplicate content:
  - Store once with multiple attributions
  - Handle syndicated articles
- [ ] Test special characters in topic:
  - "ISRO launches"
  - "elections-2024"
  - "India-China border"
- [ ] Test long topic names
- [ ] Test empty topic input

### Task 9: Cross-Browser Testing
- [ ] Test in Google Chrome
- [ ] Test in Mozilla Firefox
- [ ] Test in Safari
- [ ] Test in Microsoft Edge
- [ ] Verify consistent behavior
- [ ] Document any browser-specific issues

### Task 10: Documentation
- [ ] Document test coverage results
- [ ] Document performance test results
- [ ] Document quality metrics
- [ ] Create test report
- [ ] Update `docs/milestone1.md` with testing results
- [ ] Document any known issues or limitations

## Dev Notes

### Test Structure

```
backend/
├── tests/
│   ├── unit/
│   │   ├── scraper.test.js
│   │   ├── llmAgent.test.js
│   │   └── models.test.js
│   ├── integration/
│   │   ├── api.test.js
│   │   └── database.test.js
│   └── setup.js
└── package.json

frontend/
├── src/
│   └── __tests__/
│       ├── Feed.test.jsx
│       ├── FollowButton.test.jsx
│       └── utils.test.js
└── package.json
```

### Backend Unit Test Example

```javascript
// backend/tests/unit/scraper.test.js
describe('News Scraper', () => {
  test('fetches articles from RSS feed', async () => {
    const articles = await fetchArticles('elections');
    expect(articles.length).toBeGreaterThan(0);
    expect(articles[0]).toHaveProperty('title');
    expect(articles[0]).toHaveProperty('url');
  });

  test('handles timeout gracefully', async () => {
    const articles = await fetchArticles('test-topic-with-timeout');
    expect(articles).toEqual([]);
  });
});
```

### Frontend Unit Test Example

```javascript
// frontend/src/__tests__/Feed.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Feed from '../pages/Feed';

describe('Feed Component', () => {
  test('renders search input', () => {
    render(<Feed />);
    const input = screen.getByPlaceholderText(/enter a topic/i);
    expect(input).toBeInTheDocument();
  });

  test('displays loading state when searching', () => {
    render(<Feed />);
    const input = screen.getByPlaceholderText(/enter a topic/i);
    const button = screen.getByText(/search/i);
    fireEvent.change(input, { target: { value: 'elections' } });
    fireEvent.click(button);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

### Integration Test Example

```javascript
// backend/tests/integration/api.test.js
describe('Feed API', () => {
  test('GET /api/feed/topic returns summary', async () => {
    const response = await request(app)
      .get('/api/feed/topic?topic=elections')
      .expect(200);

    expect(response.body).toHaveProperty('summary');
    expect(response.body).toHaveProperty('articles');
  });

  test('POST /api/follow follows a topic', async () => {
    const response = await request(app)
      .post('/api/follow')
      .send({ topic: 'elections', action: 'follow' })
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

### E2E Test Example (Cypress)

```javascript
// cypress/e2e/feed-flow.cy.js
describe('Feed Flow', () => {
  it('completes end-to-end user flow', () => {
    cy.visit('/');
    cy.get('a[href="/feed"]').click();
    cy.get('input[placeholder*="enter a topic"]').type('elections');
    cy.get('button[type="submit"]').click();
    cy.contains('Loading...').should('be.visible');
    cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
    cy.contains('Synthesized from').should('be.visible');
    cy.contains('Follow elections').click();
    cy.contains('Following elections').should('be.visible');
  });
});
```

### Performance Test Metrics

| Metric | Target | Acceptable | Actual |
|--------|--------|------------|--------|
| End-to-end flow | <10s | <15s | TBD |
| Summary word count | 150-300 | 100-400 | TBD |
| Articles per topic | ≥5 | ≥3 | TBD |
| Sources per summary | ≥2 | ≥2 | TBD |
| False positive rate | <20% | <30% | TBD |
| False negative rate | <20% | <30% | TBD |

### Test Coverage

Target: >80% code coverage

Tools:
- Jest (unit tests)
- Supertest (API integration tests)
- Cypress/Playwright (E2E tests)
- Istanbul/nyc (coverage reporting)

## Dependencies

- MS1-001: LangGraph-Based News Synthesis (implementation)
- MS1-002: Follow Feature (implementation)
- MS1-003: Navigation and Routing (implementation)
- MS1-004: Database Schema (implementation)

## Blockers

- None known

## Out of Scope

- Load testing with heavy traffic (future)
- Security testing (future)
- Accessibility testing (future)
- Internationalization testing (future)

## Notes

This story ensures that all Milestone 1 functionality is thoroughly tested and meets quality standards. Testing should be performed throughout the development process, not just at the end.

Focus on critical user flows and edge cases. Performance testing is particularly important for this milestone due to the LLM API integration.

All test results should be documented and any issues found should be addressed before considering the milestone complete.
