# Architecture

**Analysis Date:** 2026-02-03

## Pattern Overview

**Overall:** Monorepo with MVC + Service Layer + AI Workflow

**Key Characteristics:**
- Frontend and backend are separate Node.js applications in a monorepo
- Backend follows MVC pattern with explicit service layer for business logic
- AI/LLM functionality implemented as LangGraph workflow with stateful nodes
- REST API with standardized JSON responses
- MongoDB for persistence with Mongoose ODM
- Session-based user state management (localStorage + database)

## Layers

**Presentation Layer (Frontend):**
- Purpose: React SPA for user interface and interactions
- Location: `frontend/src/`
- Contains: Pages, components, API clients, utilities
- Depends on: Backend REST API (`/api` endpoints)
- Used by: End users via browser

**API Layer (Backend Routes):**
- Purpose: Define REST endpoints and HTTP request handling
- Location: `backend/routes/`
- Contains: Express route definitions (`*.routes.js`)
- Depends on: Controllers, middleware
- Used by: Frontend API clients

**Controller Layer:**
- Purpose: Request/response handling and validation
- Location: `backend/controllers/`
- Contains: Express route handlers (`*.controller.js`)
- Depends on: Services, asyncHandler utility
- Used by: Routes

**Service Layer:**
- Purpose: Business logic, database operations, external integrations
- Location: `backend/services/`
- Contains: Core application logic (`*.service.js`)
- Depends on: Models, LangGraph workflow, agents
- Used by: Controllers

**AI Workflow Layer:**
- Purpose: Stateful multi-step LLM processing with LangGraph
- Location: `backend/graph/`
- Contains: Workflow definitions (`newsGraph.js`)
- Depends on: Agents, LangChain SDK
- Used by: Services

**Agent Layer:**
- Purpose: Specialized AI agents for specific tasks
- Location: `backend/agents/`
- Contains: LLM agent, scraper agent
- Depends on: OpenAI API, RSS feeds
- Used by: LangGraph workflow

**Data Layer:**
- Purpose: Database schema definition and data access
- Location: `backend/models/`
- Contains: Mongoose schemas and models
- Depends on: MongoDB via Mongoose
- Used by: Services, other models

**Middleware Layer:**
- Purpose: Cross-cutting concerns (auth, validation, error handling)
- Location: `backend/middleware/`
- Contains: Express middleware functions
- Depends on: Utils, config
- Used by: Express app

## Data Flow

**Topic Synthesis Flow (Main Feature):**

1. User enters topic in frontend search form
2. Frontend calls `GET /api/feed/topic?topic={topic}` via `frontend/src/api/feed.js`
3. Backend route `backend/routes/feed.routes.js` routes to controller
4. Controller `backend/controllers/feed.controller.js.getTopicFeed()` validates request
5. Controller calls service `backend/services/feed.service.js.getTopicSynthesis(topic)`
6. Service executes LangGraph workflow via `backend/graph/newsGraph.js.executeNewsGraph(topic)`

7. **Scraper Agent Node** (`backend/agents/scraperAgent.js`):
   - Fetches articles from configured RSS feeds
   - Filters by topic keywords
   - Returns top 20 relevant articles

8. **LLM Agent Node** (`backend/agents/llmAgent.js`):
   - Receives articles from scraper
   - Calls OpenAI GPT-4o-mini for semantic synthesis
   - Generates abstractive summary with source attribution

9. Service stores results in MongoDB:
   - Articles as `Evidence` documents (immutable)
   - Summary as `TopicSummary` document (with 24h TTL)

10. Response flows back: Service → Controller → Route → API client → Frontend
11. Frontend displays synthesis and article list

**Follow/Unfollow Flow:**

1. User clicks follow/unfollow button
2. Frontend calls `POST/DELETE /api/feed/follow` via `frontend/src/api/feed.js`
3. Route → Controller → Service (`followTopic` / `unfollowTopic`)
4. Service creates/updates `FollowedTopic` document in MongoDB
5. Response returned and local storage updated via `frontend/src/utils/storage.js`

**State Management:**
- Frontend: React hooks (`useState`, `useEffect`) for component state
- Session state: localStorage via `frontend/src/utils/storage.js`
- Backend state: MongoDB documents (Evidence, TopicSummary, FollowedTopic)
- LangGraph workflow state: Passed through nodes via `StateAnnotation`

## Key Abstractions

**Evidence:**
- Purpose: Immutable article storage from RSS feeds
- Examples: `backend/models/evidence.js`
- Pattern: Mongoose schema with pre-save hooks for immutability enforcement
- Unique by URL, indexed by topic and publishDate

**TopicSummary:**
- Purpose: AI-synthesized summaries with TTL expiration
- Examples: `backend/models/TopicSummary.js`
- Pattern: One summary per topic, auto-expired after 24h
- References Evidence via articleIds array

**FollowedTopic:**
- Purpose: User session tracking for followed topics
- Examples: `backend/models/FollowedTopic.js`
- Pattern: Soft-delete via `isActive` flag
- Scoped to sessionId (or userId when auth implemented)

**LangGraph State:**
- Purpose: Workflow state passed between AI nodes
- Examples: `backend/graph/newsGraph.js` (StateAnnotation)
- Pattern: Typed state object with reducers for immutable updates
- Fields: topic, articles, summary, sources, error

**API Response:**
- Purpose: Standardized JSON response format
- Examples: `backend/utils/apiResponse.js`
- Pattern: `{ success: boolean, message: string, data: any }`
- Used across all controllers via `success()` and `error()` helpers

**AsyncHandler:**
- Purpose: Eliminate try-catch boilerplate in async route handlers
- Examples: `backend/utils/asyncHandler.js`
- Pattern: Higher-order function wrapping async handlers
- Catches errors and passes to Express error middleware

## Entry Points

**Backend Server:**
- Location: `backend/server.js`
- Triggers: `npm start` or `npm run dev`
- Responsibilities:
  - Initialize Express app
  - Connect to MongoDB
  - Configure middleware (helmet, cors, morgan, body parsing)
  - Mount API routes at `/api`
  - Global error handling
  - Start HTTP server on configured port (default: 5002)

**Frontend App:**
- Location: `frontend/src/main.jsx`
- Triggers: Vite dev server or build execution
- Responsibilities:
  - Mount React app to DOM
  - Import global styles

**LangGraph Workflow:**
- Location: `backend/graph/newsGraph.js`
- Triggers: Service layer calls `executeNewsGraph(topic)`
- Responsibilities:
  - Build and compile workflow graph
  - Execute stateful multi-step processing
  - Return synthesis result or error

**React Router App:**
- Location: `frontend/src/App.jsx`
- Triggers: Browser URL navigation
- Responsibilities:
  - Define route configuration (`/`, `/feed`, `/feed/:topic`)
  - Manage navigation state
  - Provide Layout wrapper to all routes

## Error Handling

**Strategy:** Global Express error middleware with operational error classification

**Patterns:**

**Controller Level:**
- All async route handlers wrapped with `asyncHandler` from `backend/utils/asyncHandler.js`
- Automatically catches errors and passes to error middleware
- Example: `export const getTopicFeed = asyncHandler(async (req, res) => { ... })`

**Middleware Level:**
- `backend/middleware/errorHandler.js` provides global error handler
- Catches ApiError class errors with custom status codes
- Handles Mongoose errors: ValidationError (400), CastError (400), duplicate key (409)
- Logs errors with request context (url, method, stack)
- Returns standardized error response: `{ success: false, message, stack? }`

**Service Level:**
- Services throw Error with descriptive messages
- Example: `throw new Error('Failed to generate synthesis: ${error.message}')`
- Caught by controller's asyncHandler and passed to error middleware

**AI Agent Level:**
- LangGraph workflow returns error state instead of throwing
- Scraper agent catches fetch errors and returns error in state
- LLM agent catches synthesis errors and returns error in state
- Service checks for `result.error` and returns appropriate response

**Frontend Level:**
- API client (`frontend/src/api/feed.js`) catches axios errors
- Extracts error message from `err.response?.data?.message`
- Component displays error message in UI

## Cross-Cutting Concerns

**Logging:** Custom logger utility at `backend/utils/logger.js` used throughout backend. Morgan middleware logs HTTP requests in dev mode.

**Validation:** Route-level validation using express-validator (imported but not actively used). Controller-level validation with early returns for missing parameters.

**Authentication:** Not yet implemented. Session-based tracking via `sessionId` stored in localStorage and database. JWT configuration exists in `backend/config/config.js` but not used.

**Security:** Helmet middleware for HTTP headers. CORS configured for specific origins. MongoDB connection with connection pooling. Environment variables via dotenv.

---

*Architecture analysis: 2026-02-03*
