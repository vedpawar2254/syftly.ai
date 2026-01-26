# Database Configuration and Schema Documentation

This document describes the database schema, indexes, and configuration for the syftly.ai Milestone 1 implementation.

## Database Connection

**Connection URI**: Configured via `MONGODB_URI` environment variable
**Default**: `mongodb://localhost:27017/syftlyai`

### Connection Options
- `useNewUrlParser: true` - Use new URL parser
- `useUnifiedTopology: true` - Use new Server Discovery and Monitoring engine
- `serverSelectionTimeoutMS: 5000` - Timeout for server selection
- `socketTimeoutMS: 45000` - Socket timeout

## Collections and Schemas

### 1. Evidence Collection

Stores news articles fetched from RSS feeds.

#### Schema

| Field | Type | Required | Indexed | Unique | Description |
|-------|------|----------|----------|---------|-------------|
| title | String | Yes | No | No | Article title |
| body | String | Yes | No | No | Article body/content |
| source | String | Yes | Yes | No | News source name (enum) |
| url | String | Yes | No | **Yes** | Article URL |
| publishDate | Date | No | Yes | No | Article publication date |
| fetchedAt | Date | No | No | No | When article was fetched |
| topic | String | No | Yes | No | Topic this article matches |
| contentHash | String | No | Yes | No | SHA-256 hash of content |

#### Source Enum
Allowed values: `['The Hindu', 'Times of India', 'Indian Express']`

#### Indexes
- **Unique Index**: `url` - Prevents duplicate URLs
- **Single Index**: `topic` - Fast queries by topic
- **Single Index**: `publishDate` - Sorting by date
- **Single Index**: `contentHash` - Duplicate detection
- **Compound Index**: `{ topic: 1, publishDate: -1 }` - Efficient topic queries with sorting

#### Methods
- `generateHash(content)` - Static method to generate SHA-256 hash
- `isDuplicate()` - Instance method to check if this evidence is a duplicate
- `checkDuplicate(url, contentHash)` - Static method to check for duplicates

#### Constraints
- **Immutable**: Evidence documents cannot be updated (pre-save middleware prevents updates)
- **Unique URLs**: Only one article per URL
- **Duplicate Detection**: Based on content hash

---

### 2. TopicSummary Collection

Stores AI-synthesized summaries for topics.

#### Schema

| Field | Type | Required | Indexed | Unique | Description |
|-------|------|----------|----------|---------|-------------|
| topic | String | Yes | Yes | **Yes** | Topic name |
| summaryText | String | Yes | No | No | Synthesized summary (150-300 words) |
| sourcesUsed | String[] | Yes | No | No | List of source names used |
| articleIds | ObjectId[] | No | No | No | References to Evidence documents |
| articleData | Object[] | No | No | No | Quick access article data |
| sourceCount | Number | No | No | No | Number of sources |
| wordCount | Number | No | No | No | Word count of summary |
| createdAt | Date | No | Yes | No | When summary was created |
| updatedAt | Date | No | No | No | When summary was last updated |
| expiresAt | Date | No | No | No | TTL for auto-cleanup (24h) |

#### articleData Structure
```javascript
{
  title: String,
  source: String,
  url: String,
  publishDate: Date
}
```

#### Indexes
- **Unique Index**: `topic` - One summary per topic
- **Single Index**: `createdAt` - Sorting by recency
- **Compound Index**: `{ topic: 1, createdAt: -1 }` - Efficient topic queries
- **TTL Index**: `{ expiresAt: 1 }` - Auto-cleanup after 24 hours

#### Methods
- `updateSummary(summaryText, sourcesUsed, articleData)` - Update summary with new data
- `findOrCreate(topic)` - Static method to find or create summary

#### Constraints
- **Unique Topics**: Only one summary per topic
- **Word Count**: 150-300 words (1000-2000 characters)
- **Auto-Expiration**: Summaries expire after 24 hours (TTL index)

---

### 3. FollowedTopic Collection

Stores topics users are following.

#### Schema

| Field | Type | Required | Indexed | Unique | Description |
|-------|------|----------|----------|---------|-------------|
| topic | String | Yes | Yes | No | Topic name |
| sessionId | String | Yes | Yes | No | Session identifier |
| userId | String | No | Yes | No | User ID (for future auth) |
| lastSynthesizedAt | Date | No | No | No | Last time synthesis ran |
| createdAt | Date | No | Yes | No | When topic was followed |
| isActive | Boolean | No | No | No | Whether topic is still followed |

#### Indexes
- **Single Index**: `topic` - Fast queries by topic
- **Single Index**: `sessionId` - Session-based queries
- **Single Index**: `userId` - User-based queries (for future)
- **Single Index**: `createdAt` - Sorting by follow date
- **Compound Index**: `{ sessionId: 1, createdAt: -1 }` - Session queries with sorting
- **Compound Index**: `{ sessionId: 1, topic: 1 }` - Unique topic per session
- **Compound Index**: `{ userId: 1, topic: 1 }` - Unique topic per user (for future)
- **Unique Index**: `{ sessionId: 1, topic: 1, isActive: 1 }` - Prevent duplicates

#### Methods
- `unfollow()` - Instance method to mark as unfollowed (sets `isActive = false`)
- `follow(topic, sessionId, userId)` - Static method to follow a topic
- `unfollow(topic, sessionId)` - Static method to unfollow a topic
- `listFollowed(sessionId, userId)` - Static method to list followed topics
- `isFollowed(topic, sessionId)` - Static method to check if topic is followed

#### Constraints
- **Unique Follows**: One topic per session (if active)
- **Soft Delete**: Unfollowed topics have `isActive = false` (kept for history)

---

## Index Strategy

### Purpose of Indexes

1. **Performance**: Faster query execution
2. **Uniqueness**: Prevent duplicate data
3. **Sorting**: Efficient sorting operations
4. **Auto-cleanup**: TTL indexes for expired data

### Index Summary

| Collection | Index | Type | Purpose |
|------------|--------|------|---------|
| Evidence | `url` | Unique | Prevent duplicate URLs |
| Evidence | `topic` | Single | Fast topic queries |
| Evidence | `publishDate` | Single | Date sorting |
| Evidence | `contentHash` | Single | Duplicate detection |
| Evidence | `{topic, publishDate}` | Compound | Topic queries with sorting |
| TopicSummary | `topic` | Unique | One summary per topic |
| TopicSummary | `createdAt` | Single | Sort by recency |
| TopicSummary | `{topic, createdAt}` | Compound | Topic queries with sorting |
| TopicSummary | `expiresAt` | TTL | Auto-cleanup (24h) |
| FollowedTopic | `topic` | Single | Topic queries |
| FollowedTopic | `sessionId` | Single | Session queries |
| FollowedTopic | `userId` | Single | User queries (future) |
| FollowedTopic | `createdAt` | Single | Sort by follow date |
| FollowedTopic | `{sessionId, createdAt}` | Compound | Session queries with sorting |
| FollowedTopic | `{sessionId, topic}` | Compound | Unique topic per session |
| FollowedTopic | `{userId, topic}` | Compound | Unique topic per user (future) |
| FollowedTopic | `{sessionId, topic, isActive}` | Unique | Prevent duplicates |

---

## Database Utilities

Available utilities in `backend/utils/database.js`:

| Function | Purpose |
|----------|---------|
| `connectDB()` | Connect to MongoDB |
| `disconnectDB()` | Gracefully disconnect from MongoDB |
| `ensureIndexes()` | Verify all indexes exist |
| `clearCollections()` | Clear all collections (testing only) |
| `getDBStatus()` | Get connection status |
| `healthCheck()` | Database health check |

---

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | No | `mongodb://localhost:27017/syftlyai` |
| `NODE_ENV` | Environment (development/production) | No | `development` |

---

## Data Relationships

```
Evidence (articles)
    ↓ (referenced by)
TopicSummary (summary)
    ↓ (references via articleIds)
Evidence (articles)

FollowedTopic (preferences)
    ↓ (references)
Topic (virtual field)
```

---

## Performance Considerations

1. **Index Size**: Keep indexes minimal - only index fields used in queries
2. **Compound Indexes**: Order matters - put most selective fields first
3. **TTL Indexes**: Auto-cleanup prevents data bloat
4. **Soft Deletes**: Keep unfollowed topics for analytics (can be purged later)

---

## Backup and Recovery

**Not in scope for Milestone 1** - Future consideration.

---

## Scaling Considerations

**Not in scope for Milestone 1** - Future consideration:
- Sharding
- Read replicas
- Caching layer (Redis)

---

## Testing

Use `clearCollections()` in test environment to reset database state.

---

**Document Version**: 1.0
**Last Updated**: 2026-01-26
**Updated By**: Development Team
