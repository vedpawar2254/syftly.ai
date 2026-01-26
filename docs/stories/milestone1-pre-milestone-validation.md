# Story: Milestone 1 - Pre-Milestone Validation

**Epic:** Core Platform Foundation
**Priority:** Critical
**Status:** Not Started
**Story ID:** MS1-000

## Story Summary

Complete all pre-milestone validation tasks to ensure feasibility of the topic-based news ingestion and synthesis system before full implementation begins.

## User Story

As a development team, we want to validate all assumptions and prerequisites before starting implementation, so that we can identify and address any blockers early and ensure a smooth development process.

## Acceptance Criteria

1. RSS feeds for The Hindu, Times of India, and Indian Express are verified and accessible without authentication
2. Feed structure documentation is created in `backend/config/sources.md`
3. Topic matching logic is tested with sample articles and edge cases
4. False positive/negative rates for topic matching are acceptable (<20%)
5. Synthesis algorithm prototype is created and tested
6. Summary length and coherence are validated
7. Duplicate removal logic is verified
8. All validation findings are documented

## Tasks

### Task 1: RSS Feed Verification
- [ ] Test RSS feed URL: https://www.thehindu.com/news/national/?service=rss
- [ ] Test RSS feed URL: https://timesofindia.indiatimes.com/rssfeeds/296589292.cms
- [ ] Test RSS feed URL: https://indianexpress.com/section/india/feed/
- [ ] Verify feeds are accessible without authentication
- [ ] Check feed structure: items, title, link, pubDate, description/content
- [ ] Document findings in `backend/config/sources.md`
- [ ] Note any feed format differences between sources

### Task 2: Topic Matching Sandbox Test
- [ ] Create test script for topic matching logic
- [ ] Test with sample articles from each RSS feed
- [ ] Validate case-insensitivity: "ELECTIONS" vs "elections"
- [ ] Validate partial matches: "election" should match "elections"
- [ ] Validate multi-word topics: "ISRO launches"
- [ ] Test edge cases: special characters, spaces, numbers
- [ ] Measure false positive rate (articles matched incorrectly)
- [ ] Measure false negative rate (relevant articles missed)
- [ ] Confirm acceptable rates (<20% for both)
- [ ] Document any refinements needed to matching algorithm

### Task 3: Synthesis Algorithm Prototype
- [ ] Create prototype script with sample articles (5-10 articles)
- [ ] Implement basic extractive synthesis logic:
  - Sort articles by relevance (title match > publish date)
  - Extract first 1-2 sentences from each article
  - Combine with source attribution: "[Source] Sentence..."
- [ ] Implement duplicate sentence detection
- [ ] Set similarity threshold to >80% overlap
- [ ] Test summary length: ensure 150-300 words
- [ ] Test summary coherence: readability and flow
- [ ] Test duplicate removal with near-duplicate articles
- [ ] Verify source attribution is clear and accurate
- [ ] Document prototype results and any algorithm refinements

### Task 4: Create Source Configuration File
- [ ] Create `backend/config/sources.js`
- [ ] Configure The Hindu RSS source
- [ ] Configure Times of India RSS source
- [ ] Configure Indian Express RSS source
- [ ] Add source metadata: name, type, url
- [ ] Add comments for future source additions

### Task 5: Documentation
- [ ] Create `backend/config/sources.md` with:
  - List of verified RSS sources
  - Feed structure details for each source
  - Any feed-specific notes or issues
  - Topic matching test results
  - Synthesis algorithm prototype results
  - Recommendations for implementation

### Task 6: Risk Assessment
- [ ] Identify any risks from validation results
- [ ] Document potential blockers
- [ ] Propose mitigation strategies
- [ ] Determine if validation results allow proceeding to implementation

## Dev Notes

### Validation Test Scripts

**RSS Verification Script:**
```javascript
// Will create: backend/verify-rss.js
const Parser = require('rss-parser');
const parser = new Parser();

(async () => {
  const sources = [
    'https://www.thehindu.com/news/national/?service=rss',
    'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
    'https://indianexpress.com/section/india/feed/'
  ];

  for (const url of sources) {
    try {
      const feed = await parser.parseURL(url);
      console.log(`✓ ${url}`);
      console.log(`  Items: ${feed.items.length}`);
      console.log(`  Sample item:`, feed.items[0]);
    } catch (error) {
      console.log(`✗ ${url}`);
      console.log(`  Error:`, error.message);
    }
  }
})();
```

**Topic Matching Test Script:**
```javascript
// Will create: backend/test-topic-matching.js
const testCases = [
  { topic: 'elections', article: 'Elections 2024 results announced', expected: true },
  { topic: 'ISRO', article: 'ISRO launches new satellite', expected: true },
  { topic: 'cricket', article: 'India wins Cricket World Cup', expected: true },
  { topic: 'budget', article: 'Union Budget 2024 presented', expected: true }
];

// Test logic and report results
```

**Synthesis Prototype Script:**
```javascript
// Will create: backend/prototype-synthesis.js
const sampleArticles = [
  { title: '...', body: '...', source: 'The Hindu' },
  { title: '...', body: '...', source: 'Times of India' }
];

// Implement extractive synthesis and test results
```

### Success Criteria

- All 3 RSS feeds are accessible and parseable
- Feed structure is documented
- Topic matching has <20% false positive/negative rates
- Synthesis prototype produces readable 150-300 word summaries
- Duplicate removal works correctly
- All validation results are documented

## Dependencies

- None (validation task, prerequisites for other stories)

## Blockers

- None known

## Out of Scope

- Full implementation of RSS fetching in backend
- Full implementation of synthesis logic
- Database integration
- Frontend components

## Notes

This is a validation story that should be completed before starting MS1-001 (LangGraph-Based News Synthesis). If any validation tasks fail significantly, they may need to be addressed before proceeding with implementation.
