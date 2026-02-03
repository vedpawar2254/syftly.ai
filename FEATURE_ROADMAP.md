# Syftly.ai - Feature Roadmap & Implementation Plan

## Vision & Core Value

**Vision:** Help users understand the world as it is — through personalized, evolving intelligence that synthesizes news into coherent situation narratives.

**Core Value:** Users can quickly grasp complex, evolving situations through AI-synthesized summaries that evolve over time, personalized to their unique information consumption preferences.

---

## Product Philosophy

Syftly.ai is not just a news aggregator — it's a **situation intelligence platform**. Traditional news apps show you articles. Syftly.ai shows you **stories that evolve**:

- **Situation Feed:** A timeline of how a story develops over time, with each evolution synthesized into a coherent narrative
- **Hyper-Personalized Topics:** Users don't just follow broad topics — they follow specific angles, regions, or perspectives
- **User-Tuned Summaries:** The same story can be summarized differently depending on whether the user wants "quick headlines" vs "deep analysis" vs "multiple perspectives"
- **Community Intelligence:** Users can provide corrections and context, building collective understanding

---

## Current State (Milestone 1 - Completed)

### What's Working ✓

- **Topic-Based Ingestion:** Users can type a topic (e.g., "ISRO launches", "Indian elections") and the system fetches relevant articles
- **Multi-Source Synthesis:** Articles from 3 Indian news sources (The Hindu, Times of India, Indian Express) are synthesized into one summary
- **LangGraph Workflow:** 2-agent system (Scraper Agent + LLM Agent) orchestrates the flow
- **Follow Feature:** Users can follow topics (session-based via localStorage)
- **Feed Display:** Shows synthesized summary with source attribution and supporting articles
- **Database Models:** Evidence, TopicSummary, FollowedTopic models with proper indexing
- **Navigation:** Basic routing structure (`/feed`, `/feed/:topic`)

### Technical Foundation

**Backend:**
- Node.js + Express
- LangGraph for agent orchestration
- MongoDB + Mongoose for data persistence
- RSS feed aggregation (3 Indian sources)

**Frontend:**
- React with Vite
- Axios for API calls
- localStorage for session persistence

### Known Gaps & Issues

**Code Quality Issues to Fix:**
- [ ] Code cleanup and refactoring (TODOs, commented code, inconsistent patterns)
- [ ] Error handling improvements (graceful degradation, user-friendly messages)
- [ ] Performance optimization (caching, database query optimization)
- [ ] Type safety (add TypeScript or JSDoc)
- [ ] API rate limiting (prevent abuse, manage LLM costs)
- [ ] Logging and monitoring (for debugging and production readiness)

**Feature Gaps:**
- [ ] No user authentication (currently session-based only)
- [ ] No user profiles (can't set preferences yet)
- [ ] No situation evolution tracking (each fetch creates new summary, doesn't connect to previous)
- [ ] No hyper-personalized topics (follows are just keywords)
- [ ] No user intent tuning (all summaries same format)
- [ ] No comments/corrections feature
- [ ] Limited to India news (3 sources only)
- [ ] No notifications

---

## Feature Roadmap

### Priority Framework

**P0 - Critical Core** (Must have for viable product)
- Features that define the core value proposition
- Without these, users can't experience the unique value

**P1 - Important Enhancements** (Significantly improves user experience)
- Makes the product more useful and engaging
- Differentiators from competitors

**P2 - Nice to Have** (Polish and edge cases)
- Improvements that are nice but not critical

---

## Feature Breakdown

---

## 1. User Authentication & Profile System
**Priority:** P0

### 1.1 User Authentication
**Goal:** Users can create accounts and securely authenticate.

**Requirements:**
- [ ] User can sign up with email and password
- [ ] User receives email verification after signup
- [ ] User can log in with email/password
- [ ] User can reset password via email link
- [ ] User session persists across browser refreshes
- [ ] User can log out from any page
- [ ] Secure password storage (bcrypt/hashing)
- [ ] JWT-based session management
- [ ] Session refresh token mechanism

**Tech Notes:**
- Backend: JWT tokens, bcrypt for password hashing
- Database: User model (email, passwordHash, verified, createdAt)
- Email: Nodemailer with SMTP or transactional email service (SendGrid, AWS SES)

**Dependencies:** None (foundational)

**Effort:** 3-5 days

---

### 1.2 User Profile
**Goal:** Users have a profile that can be viewed by others (eventually) and configured by themselves.

**Requirements:**
- [ ] User can view their own profile
- [ ] User can edit profile fields:
  - Display name
  - Bio (max 500 chars)
  - Avatar image upload
  - Location (optional)
- [ ] User can view other users' profiles (read-only initially)
- [ ] Profile displays: followed topics count, activity summary
- [ ] User can delete their account with confirmation

**Tech Notes:**
- Backend: Profile endpoints, image upload to S3/Cloudinary
- Database: Profile model linked to User
- Frontend: Profile page, edit form, avatar upload component

**Dependencies:** Authentication

**Effort:** 2-3 days

---

### 1.3 Personalization Settings (The "Personalize Button")
**Goal:** Users can set how they want to consume news, and summaries are tuned accordingly.

**Requirements:**
- [ ] User can access personalization settings
- [ ] **Summary Length Preference:**
  - Quick headline style (50-100 words)
  - Standard summary (150-300 words)
  - Detailed analysis (300-500 words)
- [ ] **Summary Style Preference:**
  - Factual/objective (just facts)
  - Narrative/story format (engaging story)
  - Multiple perspectives (shows different viewpoints)
  - Bullet points (structured)
- [ ] **Topic Scope Preference:**
  - National only
  - International + National
  - Regional focus (user selects regions)
- [ ] **Language Preference:**
  - English only (v1)
  - Multi-language support (v2)
- [ ] Preferences are applied to all summaries generated for the user
- [ ] User can override preference on individual topics (e.g., "go deep on this one")

**Tech Notes:**
- Backend: Add preferences to User model, pass to LLM agent as system prompt
- LLM: Use preference to guide summarization style
- Database: User.preferences object { summaryLength, summaryStyle, topicScope, language }
- Frontend: Settings page with preference selectors

**Dependencies:** Authentication, Profile

**Effort:** 2-3 days

---

## 2. Enhanced Feed System
**Priority:** P0

### 2.1 Main Feed Page Improvements
**Goal:** The feed is polished, performant, and delightful to use.

**Requirements:**
- [ ] Clean, modern UI with loading states
- [ ] Optimistic UI updates (follow button toggles immediately)
- [ ] Skeleton loaders for better perceived performance
- [ ] Error boundaries for graceful failures
- [ ] Responsive design (mobile-friendly)
- [ ] Keyboard shortcuts (topic search focus, refresh feed)
- [ ] Pull-to-refresh on mobile
- [ ] Empty states (no followed topics, no articles found)
- [ ] Pagination or infinite scroll for followed topics
- [ ] Cached summaries (don't re-fetch if recent)

**Tech Notes:**
- Frontend: Component improvements, loading states, error handling
- Backend: Add caching layer (Redis or in-memory) for topic summaries
- Cache TTL: 15-30 minutes for hot topics, 1-2 hours for others

**Dependencies:** None (enhancement)

**Effort:** 2-3 days

---

### 2.2 Topic Detail Page
**Goal:** Deep dive into a single topic with full context.

**Requirements:**
- [ ] URL structure: `/topic/:topicSlug`
- [ ] Page displays:
  - Topic title and metadata (last updated, sources used)
  - Current AI-synthesized summary (prominent)
  - Timeline of situation evolution (see 2.3 below)
  - All supporting articles with full text preview
  - Related topics (suggestions based on content)
- [ ] User can:
  - View full article by clicking external link
  - Share topic via shareable link
  - Bookmark/save topic
- [ ] SEO-friendly URLs and meta tags

**Tech Notes:**
- Backend: Add `/api/topic/:topicSlug` endpoint with full data
- Database: Enhance TopicSummary model with evolution tracking
- Frontend: New TopicDetail page component
- SEO: Add meta tags, structured data (JSON-LD)

**Dependencies:** Feed page, basic synthesis

**Effort:** 3-4 days

---

### 2.3 Situation Evolution Timeline
**Goal:** Users can see how a story has evolved over time, with each major update synthesized into the narrative.

**Requirements:**
- [ ] System tracks when a topic's summary meaningfully changes
- [ ] Timeline shows:
  - Date/time of each evolution
  - Key developments in that period
  - New articles that contributed to the evolution
  - Comparison to previous version (what changed)
- [ ] User can:
  - Click any timeline point to see that version's summary
  - See diff highlighting what changed between versions
  - Expand/collapse timeline for cleaner view
- [ ] Automatic evolution triggers:
  - New articles with significant new information
  - Contradictory information emerging
  - User-reported corrections (see 3.3 below)
- [ ] Store full evolution history

**Tech Notes:**
- Database: TopicEvolution model linked to TopicSummary
  ```javascript
  {
    topicSummaryId: ObjectId,
    version: Number,
    summaryText: String,
    newArticleIds: [ObjectId],
    changedFromPrevious: String, // what changed
    timestamp: Date,
    sourcesUsed: [String]
  }
  ```
- Backend: Background job to check for evolution every 1-2 hours
- LLM: Use to compare versions and identify changes
- Frontend: Timeline component with visual indicators

**Dependencies:** Topic Detail Page, background job system

**Effort:** 4-5 days

---

## 3. Advanced Topic Management
**Priority:** P1

### 3.1 Hyper-Personalized Topics
**Goal:** Users can follow topics with specific angles, not just broad keywords.

**Requirements:**
- [ ] User can create custom topic queries with filters:
  - **Keyword:** "elections" + "Gujarat" → Gujarat elections specifically
  - **Source filter:** Only from specific publications
  - **Timeframe:** Last 7 days, last 30 days, all time
  - **Language:** English, Hindi, etc. (v2)
  - **Region:** National, state-specific, international
- [ ] User can save these queries as "followed topics"
- [ ] System displays saved queries in sidebar/followed topics list
- [ ] System uses these filters when fetching articles for synthesis
- [ ] Users can edit or delete their custom queries

**Tech Notes:**
- Database: Enhance FollowedTopic model with query structure
  ```javascript
  {
    userId: ObjectId,
    topic: String, // display name
    query: {
      keywords: [String],
      sources: [String],
      timeframe: String, // '7d', '30d', 'all'
      region: String
    },
    createdAt: Date,
    isActive: Boolean
  }
  ```
- Backend: Pass query filters to scraper and LLM agents
- Frontend: Query builder UI with filter controls

**Dependencies:** Authentication, Profile

**Effort:** 3-4 days

---

### 3.2 Followed Topics Page
**Goal:** Dedicated page to manage and view all followed topics.

**Requirements:**
- [ ] URL: `/topics` or `/following`
- [ ] Page displays:
  - List of all followed topics
  - Each topic shows: last updated, new articles count, summary snippet
  - Grouped by custom categories (optional)
  - Search/filter followed topics
- [ ] User can:
  - Unfollow any topic with confirmation
  - Edit topic filters (if hyper-personalized)
  - Set notification preference per topic (when notifications exist)
  - Sort by: most recent, most followed, alphabetical
- [ ] Show "topics with updates since last visit" indicator

**Tech Notes:**
- Backend: `/api/topics/followed` endpoint with filtering/sorting
- Database: Query FollowedTopic with aggregation for update counts
- Frontend: FollowedTopics page component with list/grid view

**Dependencies:** Authentication, Follow feature (existing)

**Effort:** 2-3 days

---

### 3.3 Comments & Corrections
**Goal:** Users can provide context and corrections, building collective intelligence.

**Requirements:**
- [ ] User can:
  - Add comments on any topic summary
  - Report factual inaccuracies with evidence
  - Suggest additional context or links
- [ ] Comment types:
  - General discussion
  - Factual correction (with source URL)
  - Additional context
- [ ] User can report inappropriate comments
- [ ] System highlights corrections prominently
- [ ] Corrections can trigger summary evolution (see 2.3)
- [ ] Threaded replies (initially 1-level deep)
- [ ] User can edit/delete own comments
- [ ] Admin/mod tools (basic: delete comments, ban users)

**Tech Notes:**
- Database: Comment model
  ```javascript
  {
    topicSummaryId: ObjectId,
    userId: ObjectId,
    type: Enum('discussion', 'correction', 'context'),
    content: String,
    sourceUrl: String, // for corrections
    parentId: ObjectId, // for replies
    createdAt: Date,
    updatedAt: Date,
    isDeleted: Boolean,
    reports: [ObjectId] // for moderation
  }
  ```
- Backend: CRUD endpoints for comments, report endpoint
- Frontend: Comment thread component, report button
- Moderation: Basic admin interface for managing comments

**Dependencies:** Authentication, Topic Detail Page

**Effort:** 4-5 days

---

## 4. Code Quality & Infrastructure
**Priority:** P0

### 4.1 Code Cleanup & Refactoring
**Goal:** Codebase is clean, maintainable, and follows best practices.

**Requirements:**
- [ ] Remove TODO comments (address or create tickets)
- [ ] Remove dead/commented code
- [ ] Consistent code formatting (Prettier config)
- [ ] Consistent naming conventions
- [ ] Extract reusable utilities
- [ ] DRY: Remove duplicated logic
- [ ] Improve component modularity (single responsibility)
- [ ] Add JSDoc comments for complex functions
- [ ] Clean up unused dependencies

**Tech Notes:**
- Run `npm audit` to identify security issues
- Use ESLint for code quality checks
- Add Prettier for formatting
- Review all files for improvements

**Dependencies:** None

**Effort:** 2-3 days

---

### 4.2 Error Handling Improvements
**Goal:** All errors are handled gracefully with user-friendly messages.

**Requirements:**
- [ ] Global error boundary in React (catches component errors)
- [ ] Global error handler in Express (catches server errors)
- [ ] Meaningful error messages for users:
  - "No articles found for this topic"
  - "Unable to generate summary, please try again"
  - "Connection lost, check your internet"
- [ ] Error logging for developers (console logs, file logging)
- [ ] Graceful degradation (show cached data if API fails)
- [ ] Retry logic for transient failures (network issues)
- [ ] Error reporting (optional: Sentry or similar)

**Tech Notes:**
- Frontend: React ErrorBoundary component
- Backend: Express error middleware
- Logging: Winston or similar
- Frontend: Axios interceptors for error handling

**Dependencies:** None

**Effort:** 2-3 days

---

### 4.3 Performance Optimization
**Goal:** App is fast and responsive.

**Requirements:**
- [ ] Add caching layer (Redis or in-memory cache):
  - Cache topic summaries for 15-30 minutes
  - Cache RSS feed responses for 5-10 minutes
  - Cache user session data
- [ ] Database query optimization:
  - Review slow queries with `explain()`
  - Add missing indexes
  - Use aggregation instead of multiple queries
- [ ] Frontend optimization:
  - Lazy loading of components (React.lazy, Suspense)
  - Image optimization (lazy loading, WebP format)
  - Code splitting (route-based)
  - Reduce bundle size (tree shaking)
- [ ] API rate limiting:
  - Prevent abuse (too many requests)
  - Manage LLM API costs
  - Per-user and per-IP limits
- [ ] Background job queue (for evolution checking, notifications):
  - Use Bull or similar queue system
  - Offload long-running tasks

**Tech Notes:**
- Cache: Redis (recommended) or Node-cache (dev)
- Database: MongoDB indexes, aggregation pipelines
- Frontend: React performance best practices
- Rate limiting: express-rate-limit
- Queue: Bull with Redis backend

**Dependencies:** None (infrastructure)

**Effort:** 4-5 days

---

### 4.4 Type Safety
**Goal:** Add TypeScript or comprehensive JSDoc for better DX and fewer bugs.

**Requirements:**
- [ ] Choose approach:
  - Option A: Migrate to TypeScript (more effort, better tooling)
  - Option B: Add JSDoc type annotations (less effort, good IDE support)
- [ ] Define types for:
  - Database models (schemas)
  - API request/response interfaces
  - Component props
  - Shared utility types
- [ ] Configure type checking in build process
- [ ] Fix type errors
- [ ] Enable IDE autocomplete with types

**Tech Notes:**
- If TypeScript: `npm install typescript @types/*`
- If JSDoc: Add comments above functions with types
- VS Code provides excellent JSDoc autocomplete

**Dependencies:** None

**Effort:** 3-4 days (TypeScript), 2-3 days (JSDoc)

---

### 4.5 Logging & Monitoring
**Goal:** Debug and troubleshoot issues in development and production.

**Requirements:**
- [ ] Structured logging:
  - Request logging (method, path, response time)
  - Error logging (stack traces, context)
  - Database query logging
  - LLM API call logging (for cost tracking)
- [ ] Log levels: debug, info, warn, error
- [ ] Log to files with rotation (prevent disk fill)
- [ ] Dashboard or log viewer (optional)
- [ ] Performance metrics:
  - Response times
  - Error rates
  - LLM API costs
- [ ] Health check endpoint (`/health`)

**Tech Notes:**
- Logging: Winston or Pino
- Metrics: Custom dashboard or APM (Sentry, Datadog - future)
- File rotation: Daily or size-based

**Dependencies:** None

**Effort:** 2-3 days

---

## 5. User Experience Enhancements
**Priority:** P1

### 5.1 Search & Discovery
**Goal:** Users can easily discover new topics and content.

**Requirements:**
- [ ] Global search bar (accessible from any page)
- [ ] Search suggestions as user types
- [ ] Search results show:
  - Matching topics (followed and trending)
  - Recent summaries
  - Related articles
- [ ] Trending topics section (show popular topics)
- [ ] "Recommended for you" based on followed topics
- [ ] Topic suggestions on empty states

**Tech Notes:**
- Database: Text search indexes for content
- Backend: Search API with relevance scoring
- Frontend: Search input with autocomplete

**Dependencies:** Topic Detail Page, Followed Topics

**Effort:** 3-4 days

---

### 5.2 Notifications (v2)
**Goal:** Users stay informed about their followed topics.

**Requirements:**
- [ ] In-app notification center:
  - Shows notifications in bell icon
  - Mark as read/unread
  - Notification history
- [ ] Notification types:
  - New evolution in followed topic
  - Correction on followed topic
  - Reply to user's comment
- [ ] Email notifications (optional per user):
  - Daily digest of followed topics
  - Major story breaking
- [ ] Push notifications (future, mobile)
- [ ] User can manage notification preferences

**Tech Notes:**
- Database: Notification model
- Backend: Background job to check for updates and create notifications
- Email: Transactional email service
- Frontend: Notification center component

**Dependencies:** Situation Evolution, Comments, Email setup

**Effort:** 3-4 days

---

### 5.3 Bookmarking & Reading List
**Goal:** Users can save topics/articles to read later.

**Requirements:**
- [ ] User can bookmark any topic or article
- [ ] Reading list page (`/reading-list`)
- [ ] Bookmarks are synced across devices (when auth exists)
- [ ] User can add notes to bookmarks
- [ ] User can organize bookmarks into folders/tags
- [ ] Mark as read/unread
- [ ] Archive old bookmarks

**Tech Notes:**
- Database: Bookmark model linked to User and TopicSummary/Article
- Frontend: Bookmark button, ReadingList page

**Dependencies:** Authentication

**Effort:** 2-3 days

---

## 6. Expansion & Scale (Future)
**Priority:** P2

### 6.1 Multi-Source Expansion
**Goal:** More news sources, international coverage.

**Requirements:**
- [ ] Add RSS feeds for major international sources:
  - Reuters, BBC, AP, AFP
  - Regional sources by continent
  - Niche sources (tech, science, business)
- [ ] Source management UI (admin can add/remove sources)
- [ ] Source reliability scoring
- [ ] Source filtering per user preference

**Effort:** 2-3 days per major region

---

### 6.2 Multi-Language Support
**Goal:** Non-English speakers can use the app.

**Requirements:**
- [ ] UI localization (translations for all text)
- [ ] Multi-language topic search
- [ ] Summaries in user's preferred language
- [ ] Language-specific news sources
- [ ] RTL support for Arabic, Hebrew, etc.

**Effort:** 5-7 days (per language)

---

### 6.3 Mobile App
**Goal:** Native mobile experience.

**Requirements:**
- [ ] React Native or Flutter app
- [ ] Push notifications
- [ ] Offline mode (read cached content)
- [ ] Mobile-specific features

**Effort:** 2-3 weeks (minimum viable app)

---

### 6.4 Advanced AI Features
**Goal:** Smarter synthesis and personalization.

**Requirements:**
- [ ] Semantic topic clustering (group related articles)
- [ ] Contradiction detection and resolution
- [ ] User behavior learning (improve recommendations)
- [ ] Personalized ranking of articles
- [ ] Sentiment analysis for topics
- [ ] Predictive insights (what might happen next)

**Effort:** 5-10 days (per feature)

---

## Proposed Development Sequence

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Stabilize existing code, add authentication

1. Code cleanup & refactoring (2 days)
2. Error handling improvements (2 days)
3. User authentication (3 days)
4. Basic profile page (2 days)
5. Testing and deployment (1 day)

**Outcome:** Clean, authenticated foundation ready for feature building

---

### Phase 2: Personalization (Weeks 3-4)
**Goal:** Users can personalize their experience

1. Personalization settings ("Personalize button") (3 days)
2. Enhanced main feed (2 days)
3. Topic detail page (4 days)
4. Testing and refinement (1 day)

**Outcome:** Users can customize how they consume news

---

### Phase 3: Advanced Features (Weeks 5-6)
**Goal:** Situation evolution and advanced topic management

1. Situation evolution timeline (5 days)
2. Hyper-personalized topics (3 days)
3. Followed topics page (2 days)
4. Testing and bug fixes (1 day)

**Outcome:** Core differentiated features are live

---

### Phase 4: Community (Weeks 7-8)
**Goal:** Collective intelligence through corrections

1. Comments & corrections (5 days)
2. Search & discovery (3 days)
3. Bookmarking (2 days)
4. Testing and polish (1 day)

**Outcome:** Users can contribute and discover content

---

### Phase 5: Performance & Scale (Weeks 9-10)
**Goal:** Production-ready performance

1. Performance optimization (5 days)
2. Type safety (3 days)
3. Logging & monitoring (2 days)
4. Testing and deployment (1 day)

**Outcome:** App is fast, reliable, and production-ready

---

## Technical Debt & Non-Functional Requirements

### Security
- [ ] Input validation and sanitization
- [ ] SQL injection prevention (MongoDB injection)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Secure headers (Helmet.js)
- [ ] Environment variable management
- [ ] Secrets management (production)

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader support (ARIA labels)
- [ ] Color contrast compliance
- [ ] Focus management
- [ ] Semantic HTML

### Testing
- [ ] Unit tests for critical functions
- [ ] Integration tests for API endpoints
- [ ] E2E tests for key user flows
- [ ] Test coverage reporting
- [ ] CI/CD pipeline with automated tests

### Deployment & DevOps
- [ ] Production deployment strategy (Vercel, AWS, etc.)
- [ ] Database backup strategy
- [ ] Environment-specific configs (dev, staging, prod)
- [ ] CI/CD pipeline
- [ ] Rollback procedure
- [ ] Monitoring and alerting (production)

---

## Success Metrics

### User Engagement
- Daily active users (DAU)
- Weekly active users (WAU)
- Average session duration
- Topics followed per user
- Return rate (users who come back)

### Content Quality
- Average summary satisfaction (user ratings)
- Correction rate (how often users report issues)
- Summary evolution frequency (how often stories change)
- Source diversity (articles per summary)

### Technical Performance
- Page load time (p50, p95)
- API response time (p50, p95)
- Error rate (< 1% target)
- Uptime (> 99% target)
- LLM API cost per user

---

## Risk & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| LLM API costs too high | High | Medium | Caching, rate limiting, efficient prompting |
| Users provide poor corrections | Medium | High | Verification system, trusted users flag |
| RSS feeds change or shut down | High | Low | Multiple sources, web scraping fallback |
| Performance issues at scale | High | Medium | Caching, database optimization, CDN |
| Competition launches similar | Medium | High | Focus on unique features (evolution, personalization) |

---

## Open Questions & Decisions Needed

1. **LLM Provider:** OpenAI vs Anthropic vs open-source models?
   - Cost, quality, rate limits differ
   - Impact on feature capabilities

2. **Hosting/Infrastructure:** Where to deploy?
   - Backend: Railway, Render, AWS, GCP?
   - Database: MongoDB Atlas, self-hosted?
   - Caching: Redis Cloud, self-hosted?

3. **Email Service:** Which provider for transactional emails?
   - SendGrid, AWS SES, Mailgun, etc.

4. **Monetization Strategy:** How will this sustain itself?
   - Freemium model?
   - Subscription tiers?
   - API for developers?

5. **Data Retention:** How long to store old article data?
   - Privacy implications
   - Storage costs

---

## Next Steps

### Immediate (This Week)
1. Review and prioritize this roadmap
2. Set up project tracking (GitHub Projects, Linear, etc.)
3. Begin Phase 1: Code cleanup & authentication

### Short-term (Next 2-4 Weeks)
1. Complete Phase 1: Foundation
2. Begin Phase 2: Personalization
3. Gather user feedback on early features

### Medium-term (Next 2-3 Months)
1. Complete core features through Phase 4
2. Launch beta to friends/family
3. Iterate based on feedback

### Long-term (6+ Months)
1. Scale infrastructure
2. Expand to international markets
3. Explore monetization options

---

*Last updated: February 3, 2026*
*Created from todo.md and existing codebase analysis*
