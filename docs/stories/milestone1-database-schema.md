# Story: Milestone 1 - Database Schema and Extensions

**Epic:** Core Platform Foundation
**Priority:** High
**Status:** Not Started
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
- [ ] Review existing `backend/models/Evidence.js`
- [ ] Ensure required fields exist:
  - `title`: String, required, indexed
  - `body`: String, required
  - `source`: String, required, indexed
  - `url`: String, required, unique, indexed
  - `publishDate`: Date
  - `fetchedAt`: Date, default: Date.now
  - `topic`: String, indexed
  - `contentHash`: String (for duplicate detection)
- [ ] Add compound index: { topic: 1, publishDate: -1 }
- [ ] Add validation: URL format validation
- [ ] Add validation: contentHash generation logic
- [ ] Add methods: `isDuplicate(url, contentHash)`

### Task 2: TopicSummary Model
- [ ] Create `backend/models/TopicSummary.js`
- [ ] Define schema:
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
- [ ] Add unique index on topic
- [ ] Add compound index: { topic: 1, createdAt: -1 }
- [ ] Add validation: summaryText length (150-300 words)
- [ ] Add methods: `updateSummary(summaryText, sourcesUsed)`
- [ ] Add middleware: update updatedAt on save

### Task 3: FollowedTopic Model (Create from MS1-001)
- [ ] Create `backend/models/FollowedTopic.js`
- [ ] Define schema:
  ```javascript
  {
    topic: { type: String, required: true, indexed: true },
    sessionId: { type: String, required: true, indexed: true },
    userId: { type: String, indexed: true }, // Optional, for future auth
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }
  ```
- [ ] Add compound index: { sessionId: 1, topic: 1 }
- [ ] Add compound index: { userId: 1, topic: 1 } (for future)
- [ ] Add unique index: { sessionId: 1, topic: 1, isActive: 1 }
- [ ] Add methods: `follow()`, `unfollow()`, `listFollowed(sessionId)`

### Task 4: Database Configuration
- [ ] Review `backend/config/database.js` or connection setup
- [ ] Ensure MongoDB connection string is configured via environment variable
- [ ] Add connection retry logic
- [ ] Add error handling for connection failures
- [ ] Add connection status logging
- [ ] Test connection on application startup

### Task 5: Duplicate Detection Logic
- [ ] Create utility function `generateContentHash(content)`
- [ ] Implement hash algorithm (e.g., SHA-256 or MD5)
- [ ] Add method to Evidence model to check for duplicates
- [ ] Test duplicate detection with identical articles
- [ ] Test duplicate detection with near-duplicate articles
- [ ] Update scraper to use duplicate detection

### Task 6: Database Indexes
- [ ] Review and add necessary indexes:
  - Evidence: url (unique), topic, publishDate, contentHash
  - Evidence: compound { topic, publishDate: -1 }
  - TopicSummary: topic (unique), createdAt
  - FollowedTopic: sessionId, topic, userId
  - FollowedTopic: compound { sessionId, topic }
- [ ] Test index performance with sample queries
- [ ] Document index strategy in `backend/config/database.md`

### Task 7: Model Relationships
- [ ] Define relationships in models:
  - TopicSummary → Evidence (hasMany)
  - FollowedTopic → Topic (virtual)
- [ ] Add populate() methods for queries
- [ ] Test relationships with sample data
- [ ] Ensure cascade delete rules (if needed)

### Task 8: Database Utilities
- [ ] Create `backend/utils/database.js`:
  - `connect()` - database connection helper
  - `disconnect()` - graceful disconnect
  - `ensureIndexes()` - verify indexes exist
  - `clearCollections()` - for testing
- [ ] Add database health check endpoint (optional)

### Task 9: Seed Data (Optional)
- [ ] Create seed script `backend/scripts/seed.js`
- [ ] Add sample Evidence records
- [ ] Add sample TopicSummary records
- [ ] Add sample FollowedTopic records
- [ ] Document seed data format
- [ ] Test seed script

### Task 10: Testing
- [ ] Test model creation and validation
- [ ] Test required field constraints
- [ ] Test unique constraints
- [ ] Test index performance
- [ ] Test duplicate detection
- [ ] Test relationships and populate
- [ ] Test database connection and error handling
- [ ] Test with real data from RSS feeds

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

This story establishes the foundational database schema for Milestone 1. The schema is designed to be extensible for future milestones, including user authentication, notifications, and advanced features.

All models should have proper validation, indexes for performance, and methods for common operations. Consider using Mongoose middleware for automatic timestamp updates and data validation.

The duplicate detection logic is critical for maintaining data quality, especially when ingesting from multiple sources that may syndicate the same content.
