# Architecture Patterns

**Domain:** AI-powered news intelligence platform
**Researched:** February 3, 2026

---

## Overview

**Recommended Architecture:** JWT-based authentication with refresh tokens, intent-injected LangGraph workflows, threaded comment system with Tiptap collaboration backend.

This architecture builds on the existing LangGraph + MongoDB + React stack, adding three major subsystems:
1. Authentication layer (JWT with refresh tokens)
2. Intent-aware synthesis (user preferences → LLM prompts)
3. Comment/correction system (MongoDB with Tiptap tracking)

---

## Component Boundaries

### Authentication Layer

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `AuthController` | Sign up, login, logout, token refresh | Express routes, AuthProvider |
| `UserService` | User CRUD, password hashing, profile management | AuthController, Mongoose User model |
| `User` Model (Mongoose) | User schema, password hash, profile data | UserService, MongoDB |
| `TokenService` | JWT generation/verification, refresh token management | AuthController |
| `RefreshTokenStore` (MongoDB) | Active refresh tokens for revocation | TokenService |
| `AuthProvider` (Frontend) | Session state, token storage, auth hooks | React components, API client |
| `authMiddleware` | JWT validation, user attachment | All protected routes |
| `SessionMiddleware` (Express) | Express session for auth state (optional) | AuthController |

**Data Flow:**
```
Frontend → AuthController → UserService → User Model (MongoDB)
         ↓ (JWT)
TokenService → Frontend (localStorage/cookies)
         ↓ (subsequent requests)
authMiddleware → TokenService → RefreshTokenStore
```

### Intent-Aware Synthesis Layer

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `IntentController` | Intent selection, per-topic override | Frontend, LangGraphService |
| `UserPreferenceService` | Load/save user synthesis preferences | IntentController, User model |
| `User` Model (extended) | `preferences: { summaryLength, summaryStyle, perspective, complexity }` | UserPreferenceService |
| `LangGraphService` | Inject user intent into LLM agent calls | IntentController, LLM agents |
| `LLMAgent` (LangGraph node) | Generate summary with intent constraints | LangGraphService |
| `TopicSummaryService` | Store summaries with intent metadata | LLM agent, TopicSummary model |

**Data Flow:**
```
Frontend → IntentController → UserPreferenceService → User Model (MongoDB)
         ↓ (load preferences)
IntentController → LangGraphService
         ↓ (with preferences)
LLMAgent receives: { topic, articles, intent: { length, style, ... } }
         ↓ (synthesized summary)
TopicSummary Model stores: { summary, intentUsed, sources, timestamp }
Frontend displays summary
```

**Intent Injection Pattern:**
```javascript
// LangGraph node with intent-aware prompt
const llmAgentNode = async (state) => {
  const intent = state.userIntent || await loadUserIntent(state.userId);
  const prompt = buildPromptWithIntent(state.articles, intent);
  const summary = await openai.chat.completions({
    messages: [
      { role: "system", content: `You are a news synthesizer. User intent: ${intent.summaryStyle}, ${intent.summaryLength}.` },
      { role: "user", content: `Synthesize: ${state.topic}\n\nArticles: ${formatArticles(state.articles)}` }
    ]
  });
  return { ...state, summary };
};
```

### Comment & Correction System

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `CommentController` | CRUD operations, moderation endpoints | Express routes, CommentService |
| `CommentService` | Business logic, threading, ownership checks | CommentController, Comment model |
| `Comment` Model (Mongoose) | Comment schema, replies, flags | CommentService, MongoDB |
| `CorrectionController` (extends CommentController) | Handle correction-specific flows | Frontend, CommentService |
| `TiptapProvider` (Frontend) | Editor state, suggestion tracking, cursors | Comment editor component |
| `HocuspocusProvider` (optional) | Real-time collaboration, presence | TiptapProvider, WebSocket backend |
| `ModerationService` | Spam detection, content validation | CommentController |
| `NotificationService` | Notify users of replies/corrections | CommentService, Email/In-app |

**Data Flow:**
```
Frontend → CommentController → CommentService → Comment Model (MongoDB)
         ↓
TiptapProvider tracks: { selections, suggestions, changes }
         ↓
User submits comment → CommentService saves with userId, contentId, position
         ↓
Real-time: Hocuspocus/WebSocket → Frontend (live updates)
```

---

## Data Models

### User Model (Mongoose)

```javascript
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationExpiresAt: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpiresAt: { type: Date },
  profile: {
    displayName: { type: String, maxlength: 50 },
    bio: { type: String, maxlength: 500 },
    avatarUrl: { type: String },
  },
  synthesisPreferences: {
    summaryLength: { type: String, enum: ['short', 'medium', 'long'], default: 'medium' },
    summaryStyle: { type: String, enum: ['narrative', 'bullet', 'perspectives', 'factual'], default: 'narrative' },
    perspective: { type: String, enum: ['balanced', 'optimistic', 'skeptical'], default: 'balanced' },
    complexity: { type: String, enum: ['beginner', 'expert', 'technical'], default: 'beginner' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 });
userSchema.index({ emailVerified: 1 });
```

### Refresh Token Model (Mongoose)

```javascript
const refreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  userAgent: { type: String }, // For security, can revoke suspicious tokens
  ipAddress: { type: String }, // For security logging
});

refreshTokenSchema.index({ userId: 1, expiresAt: 1 });
refreshTokenSchema.index({ token: 1 });

// TTL index to auto-expire old tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### Comment Model (Mongoose)

```javascript
const commentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  topicSummaryId: { type: Schema.Types.ObjectId, ref: 'TopicSummary', required: true, index: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null, index: true }, // For replies
  type: { type: String, enum: ['discussion', 'correction', 'context'], default: 'discussion', required: true },
  content: { type: String, required: true, trim: true },
  
  // Tiptap tracking for rich text collaboration
  tiptapData: {
    json: { type: Schema.Types.Mixed }, // Full Tiptap JSON document
    text: { type: String }, // Plain text fallback
    version: { type: Number, default: 1 },
    changes: [{ // Track edit history
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now },
      changeType: { type: String, enum: ['insert', 'update', 'delete'] },
      oldRange: { from: Number, to: Number },
      newRange: { from: Number, to: Number }
    }]
  },
  
  // Correction-specific fields
  correctionData: {
    sourceUrl: { type: String, validate: { validator: isUrl } },
    sourceTitle: { type: String },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    impact: { type: String, enum: ['minor', 'moderate', 'significant'] }
  },
  
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date },
  
  // Moderation
  reports: [{ userId: Schema.Types.ObjectId, ref: 'User', reason: String, timestamp: Date }],
  
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

commentSchema.index({ topicSummaryId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1, createdAt: 1 });
commentSchema.index({ userId: 1, createdAt: -1 });
```

### Enhanced TopicSummary Model (Intent Tracking)

```javascript
const topicSummarySchema = new Schema({
  topic: { type: String, required: true, index: true },
  
  // Intent metadata
  synthesisIntent: {
    summaryLength: { type: String, enum: ['short', 'medium', 'long'] },
    summaryStyle: { type: String, enum: ['narrative', 'bullet', 'perspectives', 'factual'] },
    perspective: { type: String, enum: ['balanced', 'optimistic', 'skeptical'] },
    complexity: { type: String, enum: ['beginner', 'expert', 'technical'] },
    userId: { type: Schema.Types.ObjectId, ref: 'User' } // Whose preferences were used
  },
  
  summary: { type: String, required: true },
  sources: [{ name: String, articleCount: Number }],
  articleIds: [{ type: Schema.Types.ObjectId, ref: 'Evidence' }],
  
  // Evolution tracking (future)
  evolutionVersion: { type: Number, default: 1 },
  previousVersions: [{ type: Schema.Types.ObjectId, ref: 'TopicSummary' }],
  
  createdAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date, index: true } // 24h TTL
});
```

---

## Authentication Strategy: JWT with Refresh Tokens

### Recommended Approach: JWT Access Tokens + Refresh Tokens

**Why JWT over Sessions:**
- Stateless: No server-side session storage required for validation
- Scalability: Easy to scale horizontally (token is self-contained)
- Multi-service: Same JWT works across microservices if needed
- Mobile-friendly: Tokens work well with native mobile apps
- Offline-first: Can validate token locally without database hit

**Why Refresh Tokens:**
- Security: Short-lived access tokens (15 min) limit exposure if compromised
- UX: Long-lived refresh tokens (7-30 days) maintain session
- Revocation: Refresh tokens stored in DB for invalidation
- Rotation: New refresh tokens issued on refresh, old ones revoked

### JWT Configuration

```javascript
// backend/services/tokenService.js
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (userId) => {
  const token = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  // Store in DB for revocation
  return createRefreshToken(userId, token);
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
```

### Refresh Token Flow

```
1. User logs in → Backend issues access token (15m) + refresh token (7d)
2. Access token stored in memory/cookie, refresh token in secure HttpOnly cookie
3. Request to protected API → authMiddleware validates access token
4. Access token expired (401) → Frontend calls /auth/refresh
5. Backend validates refresh token from DB → Issues new access + new refresh
6. Old refresh token revoked, new one issued
7. Frontend updates tokens, retries request
```

### Token Storage Options (Frontend)

| Method | Access Token | Refresh Token | Notes |
|---------|-------------|----------------|-------|
| Memory | ✓ | ✗ | Lost on refresh, good for SPA re-renders |
| localStorage | ✓ | ✗ | Vulnerable to XSS, persists across tabs |
| Cookie (HttpOnly) | ✓ | ✓ | Most secure, CSRF protection needed |
| Cookie (HttpOnly + SameSite=Strict) | ✓ | ✓ | Recommended for production |

**Recommended:** HttpOnly cookie for refresh token, memory for access token.

---

## Intent-Aware Synthesis Architecture

### Intent Dimensions

| Dimension | Values | LLM Prompt Impact |
|-----------|--------|-------------------|
| **Summary Length** | short (50-100 words), medium (150-300), long (300-500) | Token limit constraint in prompt: "Keep response under X words" |
| **Summary Style** | narrative, bullet, perspectives, factual | Template selection: "Format as bullet points" vs "Write as narrative story" |
| **Perspective** | balanced, optimistic, skeptical | Framing instruction: "Emphasize sources that agree" vs "Highlight disagreements" |
| **Complexity** | beginner, expert, technical | Vocabulary and explanation: "Explain technical terms for beginners" |

### Intent Propagation Flow

```
User Profile → MongoDB (stored preferences)
     ↓ (on topic search)
Frontend sends: { topic, intent: { length: 'short', style: 'bullet' } }
     ↓
IntentController merges with profile defaults
     ↓
LangGraph receives: { topic, articles, intent, userId }
     ↓
LLM Agent constructs system prompt:
  "You are synthesizing news. User intent: short, bullet-style summary."
     ↓
LLM generates summary with constraints
     ↓
TopicSummary stored with: { summary, synthesisIntent, intentUsed }
```

### LangGraph Integration Pattern

```javascript
// backend/graph/newsGraph.js (enhanced)
import { StateGraph, Annotation } from "@langchain/langgraph";

const GraphState = Annotation({
  topic: string,
  articles: array,
  userId: string, // New field
  userIntent: { // New field
    summaryLength: string,
    summaryStyle: string,
    perspective: string,
    complexity: string
  },
  summary: string,
  error: string
});

async function llmSynthesisNode(state: GraphState) {
  const { articles, userIntent, userId } = state;
  
  // Load user profile if intent not provided
  let intent = userIntent;
  if (!intent) {
    const user = await User.findById(userId);
    intent = user.synthesisPreferences;
  }
  
  // Build intent-aware prompt
  const systemPrompt = buildIntentPrompt(intent);
  
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Synthesize ${state.topic}:\n\n${formatArticles(articles)}` }
  ];
  
  const response = await openai.chat.completions({
    model: "gpt-4o-mini",
    messages,
    max_tokens: getMaxTokens(intent.summaryLength)
  });
  
  const summary = response.choices[0].message.content;
  
  // Store with intent metadata
  await TopicSummary.create({
    topic: state.topic,
    summary,
    synthesisIntent: intent,
    intentUsed: intent,
    articleIds: articles.map(a => a._id),
    userId
  });
  
  return { ...state, summary };
}

const newsGraph = new StateGraph({
  state: GraphState,
  nodes: {
    scraper: scraperAgentNode,
    llm: llmSynthesisNode // Enhanced with intent
  },
  entry: "scraper"
});
```

### Per-Topic Intent Override

```javascript
// Frontend intent controls
function TopicDetailPage({ topicId }) {
  const [intent, setIntent] = useState(null);
  
  const handleOverride = (newIntent) => {
    setIntent(newIntent);
    // Immediately re-synthesize with new intent
    resynthesize(topicId, newIntent);
  };
  
  return (
    <div>
      <IntentControls current={intent} onOverride={handleOverride} />
      <Summary content={summary} intentUsed={intent} />
    </div>
  );
}
```

---

## Comment & Correction System Architecture

### Threading Model

```
TopicSummary (root)
  ├─ Comment A (discussion, level 0)
  │   ├─ Comment B (reply to A, level 1)
  │   └─ Comment C (reply to A, level 1)
  ├─ Comment D (correction, level 0)
  │   └─ Comment E (reply to correction, level 1)
  └─ Comment F (context, level 0)
```

### Correction Workflow

```
User flags comment as "correction"
  → User provides source URL (required)
  → System validates URL
  → Comment marked with type: 'correction', correctionData: { sourceUrl, verified: false }
  → Other users/moderators can "verify" corrections
  → Verified corrections trigger:
      - Topic summary re-synthesis
      - Correction highlighted in feed
      - Notifier to topic followers
```

### Tiptap Integration Pattern

```javascript
// backend/services/tiptapService.js
const Tiptap = require('@tiptap/core').default;
const StarterKit = require('@tiptap/starter-kit').default;

const collaborationExtension = require('@tiptap/extension-collaboration').default;

// Initialize Tiptap with collaboration
const editor = new TiptapEditor({
  extensions: [
    StarterKit,
    collaborationExtension.configure({
      documentId: 'comment-123',
      userId: req.user._id
    })
  ]
});

// WebSocket events for real-time collaboration
ws.on('tiptap-update', (data) => {
  if (data.userId !== currentUserId) {
    editor.commands.insertContent({
      from: data.position,
      to: data.newPosition,
      insert: data.text
    });
  }
});

// Store Tiptap document snapshots on save
function saveCommentSnapshot(doc) {
  const snapshot = doc.getJSON();
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { tiptapData: { json: snapshot, version: incrementVersion() } }
  );
}
```

### Moderation Strategy

**Spam Detection:**
- Rate limiting: Max 5 comments/minute/user
- Content patterns: Flag repetitive text, link-only comments
- New user probation: First 3 comments require manual approval

**Content Validation:**
- Sanitize HTML (Tiptap already provides safe output)
- URL validation for corrections (use `is-url` package)
- Length limits: Max 2000 chars for discussion, 500 for corrections

**Abuse Reporting:**
```javascript
// Frontend report button
<ReportButton commentId={comment.id} onReport={(reason) => {
  api.post('/comments/:id/report', { reason });
}} />

// Backend handler
const reportComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  comment.reports.push({
    userId: req.user._id,
    reason: req.body.reason,
    timestamp: new Date()
  });
  
  // Auto-hide if > 3 reports
  if (comment.reports.length >= 3) {
    comment.hidden = true;
  }
  
  await comment.save();
};
```

---

## Suggested Build Order

### Phase 1: Authentication Foundation (Week 1-2)

**Why first:** All other features depend on user identification

1. **User Model & Token Service**
   - Create User schema with synthesis preferences
   - Implement TokenService with JWT generation/verification
   - Create RefreshToken model with TTL index
   - Password hashing with bcryptjs

2. **Auth Controller & Routes**
   - POST /auth/signup (with email verification flow)
   - POST /auth/login (returns access + refresh tokens)
   - POST /auth/refresh (validates refresh token)
   - POST /auth/logout (revokes refresh tokens)
   - GET /auth/verify-email (verification flow)

3. **Auth Middleware**
   - JWT validation middleware for protected routes
   - User attachment middleware (req.user = decoded.userId)
   - Token refresh on 401 errors (automatic retry)

4. **Frontend Auth Provider**
   - Better Auth React hooks (useSession, signIn, signOut)
   - Token storage (access in memory, refresh in HttpOnly cookie)
   - Protected route wrapper

### Phase 2: Intent-Aware Synthesis (Week 3-4)

**Why second:** Independent of comments, builds on existing LangGraph

1. **User Model Extension**
   - Add synthesisPreferences subdocument
   - Migration script for existing users (default preferences)

2. **Intent Service & Controller**
   - GET /intent/preferences (load user defaults)
   - PUT /intent/preferences (save user defaults)
   - Intent merge logic (default + override)

3. **LangGraph Enhancement**
   - Extend state with userIntent field
   - Enhance LLM agent node with prompt builder
   - TopicSummary model updated with synthesisIntent tracking

4. **Frontend Intent Controls**
   - Intent selection component (length, style, perspective, complexity)
   - Per-topic override button
   - Intent display on summary cards

### Phase 3: Comment System (Week 5-6)

**Why third:** Independent of synthesis, requires auth foundation

1. **Comment Model & Service**
   - Comment schema with threading, Tiptap data, correction fields
   - CommentService (CRUD, ownership checks, threading queries)

2. **Comment Controller & Routes**
   - POST /comments (create with tiptap data)
   - GET /comments/:topicSummaryId (threaded list)
   - PUT /comments/:id (edit with version tracking)
   - DELETE /comments/:id (soft delete)
   - POST /comments/:id/report (moderation)

3. **Frontend Tiptap Integration**
   - TiptapProvider setup with collaboration extension
   - Comment editor component
   - Comment display with TiptapContentRenderer

4. **Moderation & Corrections**
   - Report endpoints
   - Correction verification workflow
   - Auto-hide threshold (>3 reports)

### Phase 4: Integration & Polish (Week 7-8)

1. **Correction-Driven Evolution**
   - Workflow: verified correction → trigger topic re-synthesis
   - Updated TopicSummary displayed with "updated based on correction" badge

2. **Real-Time Collaboration (Optional)**
   - WebSocket server (Socket.io) for Tiptap cursors
   - Hocuspocus or self-hosted backend
   - Presence indicators in comment threads

3. **Performance & Caching**
   - Comment count caching per topic
   - Intent-aware summary caching (different cache keys per intent)
   - Refresh token blacklisting (in-memory set)

---

## Patterns to Follow

### JWT Token Rotation Pattern

```javascript
// backend/services/tokenService.js
const rotateRefreshToken = async (oldRefreshToken, userId) => {
  // Revoke old token
  await RefreshToken.findOneAndUpdate(
    { token: oldRefreshToken, userId },
    { revoked: true }
  );
  
  // Issue new one
  const newRefreshToken = await generateRefreshToken(userId);
  return newRefreshToken;
};
```

### Intent Fallback Pattern

```javascript
// backend/services/intentService.js
const getEffectiveIntent = async (userId, explicitIntent) => {
  if (explicitIntent) {
    return explicitIntent; // User override takes priority
  }
  
  const user = await User.findById(userId);
  return user.synthesisPreferences || DEFAULT_INTENT;
};
```

### Comment Threading Query Pattern

```javascript
// backend/services/commentService.js
const getCommentThread = async (topicSummaryId) => {
  // Get root comments (level 0) in one query
  const rootComments = await Comment.find({ 
    topicSummaryId, 
    parentId: null,
    isDeleted: false 
  }).sort({ createdAt: -1 });
  
  // Batch fetch all replies in one query
  const allCommentIds = rootComments.map(c => c._id);
  const replies = await Comment.find({
    parentId: { $in: allCommentIds },
    isDeleted: false
  });
  
  // Build tree in-memory
  return buildCommentTree(rootComments, replies);
};
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Session-Based Auth Without Token Refresh
**What:** Long-lived JWT or session cookies without refresh mechanism
**Why bad:** Compromised token valid until expiration (could be days/weeks)
**Instead:** Short-lived access tokens (15m) + refresh tokens (7d) with revocation capability

### Anti-Pattern 2: Intent as Implicit Context
**What:** Inferring intent from browsing behavior or topic content
**Why bad:** Black-box UX, privacy concerns, unpredictable results
**Instead:** Explicit intent controls (user chooses) + profile-saved defaults

### Anti-Pattern 3: Nested Comments Beyond 2 Levels
**What:** Unlimited depth comment threads
**Why bad:** Signal-to-noise ratio decreases, UI complexity explodes
**Instead:** 1-level replies (parent-child) or max 2 levels with "load more"

### Anti-Pattern 4: Comments Stored in TopicSummary
**What:** Embedded comments array in TopicSummary document
**Why bad:** Document size limit (16MB), no separate querying/indexing
**Instead:** Separate Comment model with foreign key to TopicSummary

---

## Scalability Considerations

| Concern | At 100 Users | At 10K Users | At 1M Users |
|---------|--------------|--------------|-------------|
| **Auth Token Storage** | In-memory refresh tokens | MongoDB with TTL index | Redis for distributed token revocation |
| **Comment Queries** | Nested queries fast enough | Add comment count cache | Sharded MongoDB by topicSummaryId |
| **Intent-Aware Summaries** | Same cache key per topic | Cache by (topic + intent) | CDN for cached summaries |
| **Tiptap Collaboration** | Not enabled | WebSocket server needed | Multiple Hocuspocus instances with load balancing |

---

## Sources

- **HIGH confidence:** Better Auth official docs (https://better-auth.com/docs)
- **HIGH confidence:** Express session middleware docs (https://expressjs.com/en/resources/middleware/session.html)
- **HIGH confidence:** LangChain docs (https://docs.langchain.com)
- **HIGH confidence:** Tiptap docs (https://tiptap.dev/docs)
- **HIGH confidence:** Mongoose docs (https://mongoosejs.com/docs)
- **MEDIUM confidence:** JWT vs Sessions comparison (based on industry best practices, no direct source comparison performed)

---

*Architecture research: 2026-02-03*
