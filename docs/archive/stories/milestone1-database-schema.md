# Story: Milestone 1 - Database Schema and Extensions

**Epic:** Core Platform Foundation
**Priority:** High
**Status:** Completed
**Story ID:** MS1-004

## Story Summary

Design and implement the database schema required for Milestone 1, including models for Evidence, TopicSummary, and FollowedTopic. Ensure proper indexing, relationships, and validation rules.

## User Story

As a system, I need a properly designed database schema, so that I can store news articles, synthesized summaries, and user preferences efficiently and reliably.

## Acceptance Criteria

1. `Evidence` model exists with required fields (created in MS1-001, may need updates)
2. `TopicSummary` model exists with required fields
3. `FollowedTopic` model exists with required fields
4. All models have proper field types and validation
5. Proper indexes are defined for query performance
6. Models handle duplicate articles correctly (by URL and content hash)
7. Database connections are properly configured
8. Models are exported and can be imported in controllers
9. Migrations or schema changes are documented
10. Database seed data for testing (optional)

## Tasks

### Task 1: Evidence Model (Update/Create)
- [x] Review existing `backend/models/Evidence.js`
- [x] Ensure required fields exist:
  - `title`: String, required, indexed
  - `body`: String, required
  - `source`: String, required, indexed
  - `url`: String, required, unique, indexed
  - `publishDate`: Date
  - `fetchedAt`: Date, default: Date.now
  - `topic`: String, indexed
  - `contentHash`: String (for duplicate detection)
- [x] Add compound index: { topic: 1, publishDate: -1 }
- [x] Add validation: URL format validation
- [x] Add validation: contentHash generation logic
- [x] Add methods: `isDuplicate(url, contentHash)`

### Task 2: TopicSummary Model
- [x] Create `backend/models/TopicSummary.js`
- [x] Define schema:
  ```javascript
  {
    topic: { type: String, required: true, unique: true, indexed: true },
    summaryText: { type: String, required: true },
    sourcesUsed: [{ type: String }], // Array of source names
    articleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' }],
    sourceCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
  ```
- [x] Add unique index on topic
- [x] Add compound index: { topic: 1, createdAt: -1 }
- [x] Add validation: summaryText length (150-300 words)
- [x] Add methods: `updateSummary(summaryText, sourcesUsed)`
- [x] Add middleware: update updatedAt on save

### Task 3: FollowedTopic Model (Create from MS1-001)
- [x] Create `backend/models/FollowedTopic.js`
- [x] Define schema:
  ```javascript
  {
    topic: { type: String, required: true, indexed: true },
    sessionId: { type: String, required: true, indexed: true },
    userId: { type: String, indexed: true }, // Optional, for future auth
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }
  ```
- [x] Add compound index: { sessionId: 1, topic: 1 }
- [x] Add compound index: { userId: 1, topic: 1 } (for future)
- [x] Add unique index: { sessionId: 1, topic: 1, isActive: 1 }
- [x] Add methods: `follow()`, `unfollow()`, `listFollowed(sessionId)`

### Task 4: Database Configuration
- [x] Review `backend/config/database.js` or connection setup
- [x] Ensure MongoDB connection string is configured via environment variable
- [x] Add connection retry logic
- [x] Add error handling for connection failures
- [x] Add connection status logging
- [x] Test connection on application startup

### Task 5: Duplicate Detection Logic
- [x] Create utility function `generateContentHash(content)`
- [x] Implement hash algorithm (e.g., SHA-256 or MD5)
- [x] Add method to Evidence model to check for duplicates
- [x] Test duplicate detection with identical articles
- [x] Test duplicate detection with near-duplicate articles
- [x] Update scraper to use duplicate detection

### Task 6: Database Indexes
- [x] Review and add necessary indexes:
  - Evidence: url (unique), topic, publishDate, contentHash
  - Evidence: compound { topic, publishDate: -1 }
  - TopicSummary: topic (unique), createdAt
  - FollowedTopic: sessionId, topic, userId
  - FollowedTopic: compound { sessionId, topic }
- [x] Test index performance with sample queries
- [x] Document index strategy in `backend/config/database.md`

### Task 7: Model Relationships
- [x] Define relationships in models:
  - TopicSummary → Evidence (hasMany)
  - FollowedTopic → Topic (virtual)
- [x] Add populate() methods for queries
- [x] Test relationships with sample data
- [x] Ensure cascade delete rules (if needed)

### Task 8: Database Utilities
- [x] Create `backend/utils/database.js`:
  - `connect()` - database connection helper
  - `disconnect()` - graceful disconnect
  - `ensureIndexes()` - verify indexes exist
  - `clearCollections()` - for testing
- [x] Add database health check endpoint (optional)

### Task 9: Seed Data (Optional)
- [ ] Create seed script `backend/scripts/seed.js`
- [ ] Add sample Evidence records
- [ ] Add sample TopicSummary records
- [ ] Add sample FollowedTopic records
- [ ] Document seed data format
- [ ] Test seed script

### Task 10: Testing
- [x] Test model creation and validation
- [x] Test required field constraints
- [x] Test unique constraints
- [x] Test index performance
- [x] Test duplicate detection
- [x] Test relationships and populate
- [x] Test database connection and error handling
- [x] Test with real data from RSS feeds

## Dev Notes

### Model File Structure

```
backend/models/
├── Evidence.js           # News articles
├── TopicSummary.js       # Synthesized summaries
├── FollowedTopic.js      # User followed topics
└── index.js              # Export all models
```

### Evidence Model Schema

```javascript
const EvidenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true,
    enum: ['The Hindu', 'Times of India', 'Indian Express']
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  },
  topic: {
    type: String,
    index: true
  },
  contentHash: {
    type: String,
    index: true
  }
});

// Indexes
EvidenceSchema.index({ topic: 1, publishDate: -1 });
EvidenceSchema.index({ url: 1 }, { unique: true });

// Methods
EvidenceSchema.methods.isDuplicate = async function(contentHash) {
  return await this.constructor.findOne({ contentHash });
};
```

### TopicSummary Model Schema

```javascript
const TopicSummarySchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    unique: true
  },
  summaryText: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 2000
  },
  sourcesUsed: [{
    type: String
  }],
  articleIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  }],
  sourceCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware
TopicSummarySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
TopicSummarySchema.index({ topic: 1 });
TopicSummarySchema.index({ createdAt: -1 });
```

### Duplicate Detection

```javascript
const crypto = require('crypto');

function generateContentHash(content) {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');
}

// Usage
const hash = generateContentHash(article.body);
const existing = await Evidence.findOne({ contentHash: hash });
```

### Database Connection

```javascript
// backend/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Index Strategy

**Evidence Collection:**
- `url` (unique) - Prevent duplicate URLs
- `topic` - Fast queries by topic
- `publishDate` - Sorting by date
- `contentHash` - Duplicate detection
- `{ topic, publishDate: -1 }` - Compound index for topic queries

**TopicSummary Collection:**
- `topic` (unique) - One summary per topic
- `createdAt` - Sorting by recency

**FollowedTopic Collection:**
- `sessionId` - Session-based queries
- `topic` - Topic-based queries
- `userId` - Future user-based queries
- `{ sessionId, topic }` - Compound unique index

## Dependencies

- MongoDB (local or Atlas)
- Mongoose (already installed from MS1-001)
- Node.js crypto module (built-in)

## Blockers

- MongoDB connection credentials
- Understanding of data relationships

## Out of Scope

- Data migration scripts (future)
- Database backup strategies (future)
- Database sharding or replication (future)
- Performance optimization beyond basic indexing (future)

## Notes

This story establishes foundational database schema for Milestone 1. The schema is designed to be extensible for future milestones, including user authentication, notifications, and advanced features.

All models should have proper validation, indexes for performance, and methods for common operations. Consider using Mongoose middleware for automatic timestamp updates and data validation.

The duplicate detection logic is critical for maintaining data quality, especially when ingesting from multiple sources that may syndicate the same content.

## Dev Agent Record

### Agent Model Used
- Model: Claude (Anthropic)

### Debug Log References
- Removed deprecated MongoDB connection options (useNewUrlParser, useUnifiedTopology)
- Fixed duplicate index warnings in Evidence model
- Resolved Mongoose 9.x middleware compatibility issues
- Fixed validation issues with minimum text length in tests

### Completion Notes
- All 10 tasks completed successfully (9 completed, 1 optional skipped)
- Evidence model updated with topic, contentHash, and duplicate detection
- TopicSummary model created with proper validation and methods
- FollowedTopic model created with follow/unfollow/list methods
- Database connection utilities created with health check
- All indexes defined and verified
- All models tested and validated
- Comprehensive documentation created

### File List
**Backend Models:**
- /backend/models/Evidence.js - Updated with Milestone 1 requirements
- /backend/models/TopicSummary.js - Created with all required fields and methods
- /backend/models/FollowedTopic.js - Created with follow/unfollow functionality
- /backend/models/index.js - Already exports all models (verified)

**Backend Utilities:**
- /backend/utils/database.js - Database connection and utility functions (created)

**Backend Tests:**
- /backend/test-database.js - Comprehensive database model tests (created)

**Backend Documentation:**
- /backend/config/database.md - Database schema and index documentation (created)

**Documentation:**
- /docs/stories/milestone1-database-schema.md - Story file (updated)

### Change Log
- Updated Evidence model with topic, contentHash fields
- Implemented SHA-256 hash generation for duplicate detection
- Created TopicSummary model with unique topic constraint
- Created FollowedTopic model with session-based following
- Implemented database connection utilities with error handling
- Created comprehensive index strategy documentation
- All models have proper validation and methods
- Created and passed all database tests
- Fixed Mongoose 9.x compatibility issues
