# Codebase Concerns

**Analysis Date:** 2026-02-03

## Tech Debt

**Mock Data in Production:**
- Issue: `backend/services/feed.service.js` uses mock data for `getFeedItems()` with TODO comment to replace with real implementation
- Files: `backend/services/feed.service.js:44-48`
- Impact: Primary feed endpoint returns hardcoded mock data instead of real database content
- Fix approach: Implement database aggregation from Situation and Change models as described in TODO comment

**Unused Authentication Infrastructure:**
- Issue: JWT authentication middleware and config exist but are not used on any feed endpoints (all marked as Public)
- Files: `backend/middleware/auth.js`, `backend/controllers/feed.controller.js:8, 18, 47, 67, 78`
- Impact: Auth code exists but endpoints are completely open, suggesting incomplete feature implementation
- Fix approach: Either implement proper auth on endpoints or remove unused auth code

**Duplicate Session Storage:**
- Issue: Frontend stores sessions in two places - `localStorage` key 'syftly_sessionId' and separate 'sessionId' key
- Files: `frontend/src/utils/storage.js:7,12`, `frontend/src/pages/Feed.jsx:22,27,35`
- Impact: Inconsistent session management could cause data duplication or sync issues
- Fix approach: Standardize on single session storage location

## Known Bugs

**RSS Source Failure Handling:**
- Issue: When all RSS sources fail, `scraperAgent` returns empty array without error propagation to user
- Files: `backend/agents/scraperAgent.js:109-112`
- Symptoms: User sees empty results without knowing all sources failed
- Trigger: Network issues, RSS feed downtime
- Workaround: None - user gets no feedback about source failures

**LLM Response Parsing:**
- Issue: `parseLLMResponse()` uses regex to extract JSON from LLM output, which can fail if LLM returns non-JSON formatted responses
- Files: `backend/agents/llmAgent.js:73-94`
- Symptoms: LLM responses may not parse correctly, returning summary text without structured data
- Trigger: LLM returns malformed JSON or non-JSON text
- Workaround: Fallback summary method provides generic text but loses source attribution

**Short Summary Database Save:**
- Issue: Summaries under 50 characters are silently skipped from database save
- Files: `backend/services/feed.service.js:121-123`
- Symptoms: Valid short summaries from LLM are not persisted, requiring re-synthesis
- Trigger: LLM returns brief summary (<50 chars)
- Workaround: Request synthesis again hoping for longer output

## Security Considerations

**Committed .env File:**
- Risk: Environment file containing secrets is tracked in git
- Files: `backend/.env` (tracked according to `git ls-files`)
- Current mitigation: None - secrets exposed in version control
- Recommendations: Remove `.env` from git history using `git rm --cached` and add to `.gitignore`, rotate all compromised secrets

**Hardcoded JWT Secret Default:**
- Risk: Production deployments using default JWT secret if env var not set
- Files: `backend/config/config.js:17`
- Current mitigation: Default is `'dev-secret-change-in-production'` as warning, but still used in production
- Recommendations: Throw error if `JWT_SECRET` is not set in production environment, remove default

**No Rate Limiting:**
- Risk: API endpoints can be abused to exhaust LLM quota and database resources
- Files: `backend/server.js` (no rate limiting middleware)
- Current mitigation: None
- Recommendations: Implement rate limiting using `express-rate-limit` with appropriate limits per endpoint

**No Request Size Limits:**
- Risk: Large request bodies could cause memory exhaustion or DoS
- Files: `backend/server.js:37-38` (express.json/express.urlencoded without limits)
- Current mitigation: None
- Recommendations: Add size limits: `express.json({ limit: '1mb' })`, `express.urlencoded({ extended: true, limit: '1mb' })`

**Unsanitized User Input to LLM:**
- Risk: User-provided topic strings are passed directly to LLM without sanitization, potential for prompt injection
- Files: `backend/controllers/feed.controller.js:21`, `backend/services/feed.service.js:55`, `backend/graph/newsGraph.js:149`
- Current mitigation: None - input flows directly through to LLM
- Recommendations: Validate and sanitize topic input, implement prompt injection detection, add input length limits

**Public API Endpoints:**
- Risk: All feed endpoints are public without any authentication
- Files: `backend/routes/feed.routes.js:11, 19, 27, 35, 43`, `backend/controllers/feed.controller.js:8, 18, 47, 67, 78`
- Current mitigation: None - no auth middleware applied
- Recommendations: Implement authentication, or if truly public, add IP-based rate limiting

**No Input Validation:**
- Risk: Route handlers manually validate some fields but no express-validator chains defined
- Files: `backend/controllers/feed.controller.js:23-28, 53-58, 84-89`
- Current mitigation: Manual validation in controllers, inconsistent
- Recommendations: Implement comprehensive validation using `express-validator` with validation middleware chains

## Performance Bottlenecks

**Sequential RSS Fetching:**
- Problem: RSS feeds are fetched sequentially one by one in a loop
- Files: `backend/agents/scraperAgent.js:79-83`
- Cause: `for...of` loop with `await` instead of `Promise.all`
- Improvement path: Use `Promise.all()` or `Promise.allSettled()` to fetch all feeds concurrently

**No Response Caching:**
- Problem: Every topic synthesis triggers full RSS fetch and LLM call, even for recently synthesized topics
- Files: `backend/services/feed.service.js:55-140`
- Cause: Database TTL index exists but not used for cache lookup before synthesis
- Improvement path: Check database for existing non-expired summary before triggering synthesis workflow

**Synchronous LLM Calls:**
- Problem: LLM requests block HTTP response, no queuing or batching
- Files: `backend/agents/llmAgent.js:126`, `backend/graph/newsGraph.js:163-165`
- Cause: Direct `await llm.invoke()` in request handler
- Improvement path: Implement async job queue for LLM processing, return job ID to client, provide status endpoint

**No Database Connection Pooling Config:**
- Problem: MongoDB connection uses default settings without explicit pool configuration
- Files: `backend/utils/database.js:14-17`
- Cause: No pool size or timeout configuration in mongoose.connect options
- Improvement path: Configure pool size based on expected load, add connection timeout and retry settings

## Fragile Areas

**External RSS Feed Dependency:**
- Files: `backend/config/sources.js:8-30`, `backend/agents/scraperAgent.js`
- Why fragile: Application breaks if RSS feeds go down, change URL structure, or become unavailable
- Safe modification: Add feed health checking, fallback sources, graceful degradation
- Test coverage: No automated tests for feed parsing or failure scenarios

**LLM API Dependency:**
- Files: `backend/graph/newsGraph.js:42-46`, `backend/agents/llmAgent.js`
- Why fragile: Application depends on external LLM service (OpenAI) - quota limits, outages, or cost changes cause failures
- Safe modification: Implement caching, multiple LLM provider support, graceful fallbacks
- Test coverage: No automated tests for LLM integration or error handling

**localStorage Availability:**
- Files: `frontend/src/utils/storage.js`, `frontend/src/pages/Feed.jsx:22-43`
- Why fragile: localStorage can be disabled, full, or blocked by browser settings/private mode
- Safe modification: Add try-catch with sessionStorage fallback or cookie-based storage
- Test coverage: No tests for localStorage failure scenarios

**Generic Fallback Summary:**
- Files: `backend/agents/llmAgent.js:156-164`
- Why fragile: When LLM fails, fallback returns generic template text that provides no actual value
- Safe modification: Improve fallback to extract key terms from articles, return article snippets
- Test coverage: No tests for LLM failure scenarios

**Database Connection Without Retry Logic:**
- Files: `backend/utils/database.js:10-40`
- Why fragile: Single connection attempt without retry logic on connection failures
- Safe modification: Implement exponential backoff retry logic for database connections
- Test coverage: No tests for database connection failures

## Scaling Limits

**LLM API Quota:**
- Current capacity: Limited by OpenAI API quota and rate limits
- Limit: Unknown - depends on OpenAI account tier and concurrent request handling
- Scaling path: Implement async job queue, add caching layer, consider multiple LLM providers

**RSS Feed Rate Limits:**
- Current capacity: Unknown - no explicit rate limiting configured
- Limit: Could be blocked by RSS feed providers if requested too frequently
- Scaling path: Add request caching, implement rate limiting, consider CDN for feed caching

**Database Connection Pool:**
- Current capacity: MongoDB default pool (typically 100 connections)
- Limit: Max concurrent database operations limited by pool size
- Scaling path: Configure pool size explicitly, add read replicas if needed

**No Horizontal Scaling Support:**
- Current capacity: Single server deployment implied
- Limit: Memory and CPU limited to single machine
- Scaling path: Add stateless session management, implement distributed caching, containerize for orchestration

## Dependencies at Risk

**Express 5.2.1:**
- Risk: Express 5.x is still in release candidate/beta phase, may have breaking changes
- Impact: Potential for unexpected bugs or API changes in future Express releases
- Migration plan: Monitor for stable Express 5.0 release, test thoroughly before upgrading

**LangChain Dependencies:**
- Risk: Multiple LangChain packages (`langchain`, `@langchain/openai`, `@langchain/langgraph`) - potential version conflicts
- Impact: Breaking changes in LangChain could break the workflow
- Migration plan: Pin versions in package.json, follow LangChain release notes closely, test updates

**rss-parser:**
- Risk: RSS feed format changes could break parsing
- Impact: Article extraction may fail or return incomplete data
- Migration plan: Add feed validation, implement multiple parser strategies, monitor feed changes

## Missing Critical Features

**User Authentication System:**
- Problem: No user registration, login, or session management implemented
- Blocks: Personalized feeds, user preferences, secure access control
- Impact: Cannot implement user-specific features or secure the API

**Persistent Sessions:**
- Problem: Sessions are only stored in client-side localStorage, not server-persisted
- Blocks: Cross-device sync, server-side personalization
- Impact: Users lose data when clearing localStorage or using different devices

**Error Monitoring/Alerting:**
- Problem: No centralized error tracking or alerting system
- Blocks: Production issue detection, error trend analysis
- Impact: Production issues may go unnoticed until user reports

**API Documentation:**
- Problem: No OpenAPI/Swagger documentation or API specification
- Blocks: Easy frontend integration, third-party developer access
- Impact: Developers must read code to understand API contracts

**Background Job Processing:**
- Problem: Long-running LLM synthesis blocks HTTP response
- Blocks: Asynchronous processing, job queuing
- Impact: Poor user experience on slow syntheses, potential timeout errors

## Test Coverage Gaps

**No Unit Tests:**
- What's not tested: All service layer functions, utilities, models, controllers
- Files: `backend/services/*`, `backend/utils/*`, `backend/models/*`, `backend/controllers/*`
- Risk: Refactoring can break existing functionality without detection
- Priority: High - critical business logic is untested

**No Integration Tests:**
- What's not tested: API endpoint behavior, database interactions, RSS feed integration
- Files: `backend/routes/*`, `backend/services/feed.service.js`, `backend/agents/*`
- Risk: Integration failures between components can go undetected
- Priority: High - external service integrations are fragile

**No Frontend Tests:**
- What's not tested: React components, API client functions, utility functions
- Files: `frontend/src/components/*`, `frontend/src/api/*`, `frontend/src/pages/*`
- Risk: UI bugs and frontend errors can be deployed without detection
- Priority: Medium - UX critical but less data-sensitive than backend

**No E2E Tests:**
- What's not tested: Full user flows from frontend to backend to database
- Files: All user-facing functionality
- Risk: Critical user journeys can break without detection
- Priority: Medium - important for regression testing but slower feedback cycle

**Manual Test Files Not Automated:**
- What's not tested: `backend/test-integration.js`, `backend/test-database.js`, `backend/test-llm.js` exist but are not part of CI
- Files: `backend/test-*.js`
- Risk: Valuable manual test scripts not integrated into automated test suite
- Priority: Low - tests exist, just need automation

---

*Concerns audit: 2026-02-03*
