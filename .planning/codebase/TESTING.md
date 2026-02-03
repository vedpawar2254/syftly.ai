# Testing Patterns

**Analysis Date:** 2026-02-03

## Test Framework

**Current State:**
- **No test infrastructure configured** - this is a gap in the current codebase
- Backend `package.json` test script returns: `"Error: no test specified and exit 1"`
- Frontend `package.json` has no test dependencies or scripts
- No test configuration files found (jest.config.js, vitest.config.js, etc.)

**Intended Framework (from documentation):**
- **Backend:** Jest
- **Frontend:** Jest + React Testing Library
- **Integration Tests:** Supertest
- **E2E Tests:** Cypress or Playwright (intended, not implemented)

**Run Commands (intended, not yet configured):**
```bash
# Not currently working - needs setup
npm test              # Run all tests (not configured)
npm run test          # Run all tests (not configured)
npm run test:watch    # Watch mode (not configured)
npm run test:coverage # Coverage (not configured)
```

## Test File Organization

**Current Status:**
- No test files exist in the codebase (no `*.test.js` or `*.spec.js` found)
- Manual test scripts exist: `test-database.js`, `test-integration.js`, `test-topic-matching.js`, `test-llm.js`, `verify-rss.js`
- These are standalone scripts, not formal unit/integration tests

**Intended Structure (from documentation):**
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

frontend/
├── src/
│   └── __tests__/
│       ├── Feed.test.jsx
│       ├── FollowButton.test.jsx
│       └── utils.test.js
```

**Naming:**
- Unit tests: `*.test.js` or `*.spec.js`
- Test files co-located with source files or in `tests/` or `__tests__/` directory
- Name matches file being tested: `Feed.test.jsx` tests `Feed.jsx`

## Test Structure

**Current State:**
- No formal test structure exists
- Manual testing scripts use Node.js execution with console output

**Intended Suite Organization (from documentation):**

**Backend Unit Tests:**
```javascript
// Intended pattern (not yet implemented)
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

**Backend Integration Tests:**
```javascript
// Intended pattern (not yet implemented)
describe('Feed API', () => {
  test('GET /api/feed/topic returns summary', async () => {
    const response = await request(app)
      .get('/api/feed/topic?topic=elections')
      .expect(200);

    expect(response.body).toHaveProperty('summary');
    expect(response.body).toHaveProperty('articles');
  });
});
```

**Frontend Unit Tests:**
```javascript
// Intended pattern (not yet implemented)
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

**Patterns (intended):**
- **Setup:** `beforeEach()` for test initialization, `afterEach()` for cleanup
- **Teardown:** Cleanup mock data, close database connections
- **Assertions:** Jest's `expect()` with matchers

## Mocking

**Framework:** Not configured

**Intended Patterns (from documentation):**

**What to Mock:**
- External API calls (LLM APIs, RSS feeds)
- Database operations (unless testing the actual database)
- Third-party libraries (axios, etc.)

**What NOT to Mock:**
- Business logic functions
- Utility functions (unless they have external dependencies)
- Component rendering logic

**Intended Mocking Pattern:**
```javascript
// Not yet implemented - intended pattern
import { jest } from '@jest/globals';

// Mock external API
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { success: true, data: mockData } }))
}));

// Mock database operations
jest.mock('../models/TopicSummary');
```

## Fixtures and Factories

**Test Data:**
- Mock data exists in `frontend/src/mocks/` directory:
  - `situations.js` - Mock situation data
  - `feedItems.js` - Mock feed items
  - `index.js` - Barrel export

**Location:**
- Frontend mocks: `frontend/src/mocks/`
- No backend test fixtures directory exists

**Example Mock Data:**
```javascript
// frontend/src/mocks/feedItems.js
export const mockFeedItems = [
  {
    id: '1',
    title: 'Venezuela Opposition Claims Election Fraud',
    summary: 'Multiple international observers have noted irregularities...',
    confidence: 0.82,
    why: 'New evidence from Reuters and AP confirms...',
    updated_at: new Date().toISOString(),
  },
  // ... more items
];
```

## Coverage

**Requirements:**
- Target: >80% code coverage (from testing story documentation)
- Currently: 0% (no tests implemented)
- No coverage reporting configured

**View Coverage (not configured):**
```bash
# Not working - needs setup
npm run test:coverage
```

**Coverage Tools (intended):**
- Istanbul/nyc for coverage reporting (mentioned in documentation)
- Should report on:
  - Statements
  - Branches
  - Functions
  - Lines

## Test Types

**Unit Tests (intended, not implemented):**
- Scope: Individual functions, components, services
- Approach: Isolate code under test, mock dependencies
- Intended coverage:
  - Backend services: `newsScraper.js`, `llmAgent.js`, database operations
  - Frontend components: `Feed.jsx`, `FollowButton.jsx`, `FollowedTopics.jsx`
  - Utility functions: `safeGet()`, `format()`, storage utilities

**Integration Tests (intended, not implemented):**
- Scope: API endpoints, database interactions
- Approach: Test real components working together, use test database
- Intended coverage:
  - All API endpoints: GET `/api/feed/topic`, POST `/api/follow`, etc.
  - Database operations: create, read, update, delete
  - Error handling: Database failures, LLM API timeouts

**E2E Tests (not implemented):**
- Framework: Intended to be Cypress or Playwright (from documentation)
- Scope: Full user flows from UI to backend
- Intended test flow:
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

## Common Patterns

**Async Testing (intended, not implemented):**
```javascript
test('async function', async () => {
  const result = await someAsyncFunction();
  expect(result).toBe(expectedValue);
});

test('async error handling', async () => {
  await expect(someAsyncFunction()).rejects.toThrow('Error message');
});
```

**Error Testing (intended, not implemented):**
```javascript
test('handles invalid input', () => {
  expect(() => someFunction(invalidInput)).toThrow();
});

test('API returns error on bad request', async () => {
  const response = await request(app)
    .get('/api/feed/topic')
    .expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.message).toContain('required');
});
```

## Current Testing Approach

**Manual Testing:**
- Standalone test scripts exist for verification:
  - `backend/verify-rss.js` - RSS feed verification
  - `backend/test-topic-matching.js` - Topic matching logic tests
  - `backend/prototype-synthesis.js` - Synthesis prototype tests
  - `backend/test-database.js` - Database model tests
  - `backend/test-integration.js` - Integration verification
  - `backend/test-llm.js` - LLM API tests

**Test Execution:**
- Run scripts directly: `node backend/test-database.js`
- Console output for results
- No automated test runner
- No CI/CD integration

## Testing Status

**Implemented:**
- Manual test scripts for verification
- Mock data structures in frontend
- Linting passes with minor warnings
- Manual cross-browser testing noted as completed

**Missing (needs implementation):**
- Jest or Vitest configuration
- React Testing Library setup
- Formal unit tests
- Integration tests
- E2E tests with Cypress/Playwright
- Test coverage reporting
- Pre-commit hooks for running tests
- CI/CD integration for automated testing

**Recommendation:**
- Set up Jest for both backend and frontend
- Install React Testing Library for frontend component testing
- Create initial test suite for critical paths (API endpoints, Feed component)
- Configure coverage reporting
- Add pre-commit hook to run tests on changed files

---

*Testing analysis: 2026-02-03*
