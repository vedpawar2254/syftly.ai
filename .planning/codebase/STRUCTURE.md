# Codebase Structure

**Analysis Date:** 2026-02-03

## Directory Layout

```
syftlyai/
├── backend/                 # Express.js REST API server
│   ├── agents/             # AI agents (LLM, scraper)
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── graph/              # LangGraph workflow definitions
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express route definitions
│   ├── services/           # Business logic layer
│   ├── utils/              # Utility functions
│   ├── server.js           # Backend entry point
│   └── package.json
├── frontend/               # React SPA client
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── assets/        # Static assets
│   │   ├── components/    # React components
│   │   │   ├── Layout/   # Layout wrapper component
│   │   │   └── ui/       # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── mocks/        # Mock data for testing
│   │   ├── pages/        # Route components
│   │   ├── services/      # Frontend services (minimal)
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # React Router configuration
│   │   └── main.jsx      # Frontend entry point
│   ├── public/            # Public static files
│   └── package.json
├── .bmad-core/            # BMAD framework configuration
├── .claude/               # Claude AI configuration
├── .cursor/               # Cursor AI configuration
├── .gemini/               # Gemini AI configuration
├── .github/               # GitHub configuration
├── .planning/             # Planning documents
│   └── codebase/         # Codebase analysis documents
├── docs/                  # Project documentation
├── Documenting_the_whole_process/  # Process documentation
├── AGENTS.md             # Agent definitions for AI tools
├── opencode.jsonc        # OpenCode configuration
├── README.md             # Project README
└── todo.md               # Project tasks
```

## Directory Purposes

**backend/:** Express.js REST API server providing news synthesis and follow functionality. Contains all server-side code including AI agents, database models, and API endpoints.

**backend/agents/:** AI agent implementations for specific tasks. Contains `llmAgent.js` for LLM-based synthesis and `scraperAgent.js` for RSS feed fetching.

**backend/config/:** Configuration files for server settings, database connection, and external resources. Contains `config.js` (environment variables), `db.js` (MongoDB connection), and `sources.js` (RSS feed URLs).

**backend/controllers/:** Express route handlers that implement request/response logic. Controllers validate input, call services, and format responses.

**backend/graph/:** LangGraph workflow definitions implementing stateful multi-step AI processing. Contains `newsGraph.js` with scraper → LLM workflow.

**backend/middleware/:** Express middleware for cross-cutting concerns. Contains `errorHandler.js`, `auth.js`, and `validate.js`.

**backend/models/:** Mongoose schema definitions for MongoDB collections. Contains `Evidence`, `Entity`, `Situation`, `Change`, `TopicSummary`, and `FollowedTopic` models.

**backend/routes/:** Express route definitions that map HTTP endpoints to controllers. Contains `feed.routes.js`, `situation.routes.js`, `health.routes.js`, and `index.js` (router aggregator).

**backend/services/:** Business logic layer implementing core application features. Services coordinate between controllers, models, agents, and graphs.

**backend/utils/:** Utility functions and helpers used across the backend. Contains `apiResponse.js`, `asyncHandler.js`, `logger.js`, and `database.js`.

**frontend/:** React SPA client application built with Vite. Contains all client-side code including components, pages, and API integration.

**frontend/src/api/:** API client functions for backend communication. Contains `feed.js` with axios-based API calls.

**frontend/src/assets/:** Static assets like images, fonts, and stylesheets.

**frontend/src/components/:** React components organized by function. Contains `FollowedTopics.jsx`, `FollowButton.jsx`, `Layout/` directory for page wrapper, and `ui/` for reusable UI components.

**frontend/src/hooks/:** Custom React hooks (currently empty).

**frontend/src/mocks/:** Mock data used for development and testing.

**frontend/src/pages/:** Route-level components that render at specific URLs. Contains `Feed.jsx`, `Landing.jsx`, `NotFound.jsx`, and `index.js` barrel export.

**frontend/src/services/:** Frontend service layer (minimal, mostly unused).

**frontend/src/utils/:** Utility functions for frontend operations. Contains `storage.js` for localStorage management, `format.js` for formatting helpers, and `safeGet.js` for safe property access.

## Key File Locations

**Entry Points:**
- `backend/server.js`: Backend Express server initialization
- `frontend/src/main.jsx`: Frontend React app mount point
- `frontend/src/App.jsx`: React Router configuration and navigation

**Configuration:**
- `backend/config/config.js`: Environment variables and server config
- `backend/config/db.js`: MongoDB connection setup
- `backend/config/sources.js`: RSS feed source URLs
- `backend/package.json`: Backend dependencies and scripts
- `frontend/package.json`: Frontend dependencies and scripts
- `.env.example`: Environment variable template

**Core Logic:**
- `backend/services/feed.service.js`: Main business logic for feed synthesis and follow features
- `backend/graph/newsGraph.js`: LangGraph workflow orchestration
- `backend/agents/llmAgent.js`: LLM synthesis logic
- `backend/agents/scraperAgent.js`: RSS feed fetching logic
- `frontend/src/api/feed.js`: Frontend API client
- `frontend/src/utils/storage.js`: LocalStorage management

**Models:**
- `backend/models/evidence.js`: Article storage schema
- `backend/models/TopicSummary.js`: AI summary schema
- `backend/models/FollowedTopic.js`: Followed topics schema
- `backend/models/index.js`: Model barrel export
- `backend/models/Situation.js`: Situation schema (for future features)
- `backend/models/Change.js`: Change schema (for future features)
- `backend/models/Entity.js`: Entity schema (for future features)

**Controllers:**
- `backend/controllers/feed.controller.js`: Feed endpoint handlers
- `backend/controllers/situation.controller.js`: Situation endpoint handlers

**Routes:**
- `backend/routes/index.js`: Route aggregator
- `backend/routes/feed.routes.js`: Feed API routes
- `backend/routes/situation.routes.js`: Situation API routes
- `backend/routes/health.routes.js`: Health check routes

**Testing:**
- `backend/test-*.js`: Integration and unit test files
- `frontend/src/mocks/`: Mock data for testing

**Documentation:**
- `README.md`: Project overview and setup
- `AGENTS.md`: AI tool agent definitions
- `todo.md`: Project task tracking
- `docs/`: Additional documentation

## Naming Conventions

**Files:**
- Component files: PascalCase (e.g., `FollowedTopics.jsx`, `Feed.jsx`)
- Utility files: camelCase (e.g., `storage.js`, `format.js`)
- Model files: PascalCase (e.g., `Evidence.js`, `TopicSummary.js`)
- Controller files: PascalCase with `.controller.js` suffix (e.g., `feed.controller.js`)
- Route files: PascalCase with `.routes.js` suffix (e.g., `feed.routes.js`)
- Service files: PascalCase with `.service.js` suffix (e.g., `feed.service.js`)
- Agent files: PascalCase with `Agent.js` suffix (e.g., `llmAgent.js`, `scraperAgent.js`)
- Graph files: PascalCase (e.g., `newsGraph.js`)
- Middleware files: camelCase (e.g., `errorHandler.js`, `auth.js`)

**Directories:**
- All lowercase (e.g., `components`, `services`, `models`)

**Functions:**
- camelCase (e.g., `getTopicSynthesis`, `followTopic`, `handleSearch`)
- Async functions: camelCase with `async` keyword

**Variables:**
- camelCase (e.g., `searchQuery`, `synthesis`, `followedTopics`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `STORAGE_KEY`)

**React Components:**
- Component name: PascalCase (e.g., `FollowedTopics`, `Feed`)
- Props: camelCase (e.g., `onTopicSelect`, `isCurrentlyFollowed`)

**MongoDB Models:**
- Model name: PascalCase (e.g., `Evidence`, `TopicSummary`)
- Collection fields: snake_case (e.g., `summaryText`, `articleIds`, `publishDate`)
- Schema names: PascalCase + `Schema` suffix (e.g., `evidenceSchema`, `topicSummarySchema`)

**API Endpoints:**
- kebab-case for route paths (e.g., `/feed/topic`, `/feed/follow`)
- Controller functions: camelCase with descriptive names (e.g., `getTopicFeed`, `followTopicController`)

## Where to Add New Code

**New Feature (Backend API):**
- Routes: `backend/routes/{feature}.routes.js`
- Controllers: `backend/controllers/{feature}.controller.js`
- Services: `backend/services/{feature}.service.js`
- Models: `backend/models/{Model}.js`
- Tests: `backend/test-{feature}.js`

**New Feature (Frontend):**
- Pages: `frontend/src/pages/{Feature}.jsx`
- Components: `frontend/src/components/{Component}.jsx`
- API calls: Add to or create new file in `frontend/src/api/`
- Utilities: `frontend/src/utils/{utility}.js`
- Tests: Create test file alongside component or in separate test directory

**New AI Agent:**
- Implementation: `backend/agents/{agent}Agent.js`
- Integration: Add node to `backend/graph/newsGraph.js` or create new graph file

**New LangGraph Workflow:**
- Implementation: `backend/graph/{workflowName}.js`
- Pattern: Follow `newsGraph.js` structure with StateAnnotation and execute function

**New Database Model:**
- Schema: `backend/models/{Model}.js`
- Export: Add to `backend/models/index.js`

**New Utility Function:**
- Backend: `backend/utils/{utility}.js`
- Frontend: `frontend/src/utils/{utility}.js`

**New UI Component:**
- Reusable component: `frontend/src/components/ui/{Component}.jsx`
- Feature component: `frontend/src/components/{Component}.jsx`

**New Middleware:**
- Express middleware: `backend/middleware/{middleware}.js`

**New Configuration:**
- Environment variables: Add to `.env.example` and `backend/config/config.js`
- RSS sources: Add to `backend/config/sources.js`

## Special Directories

**.bmad-core/:** BMAD framework configuration files including agents, tasks, workflows, and templates. Generated and managed by BMAD tooling. Do not manually modify.

**.claude/, .cursor/, .gemini/, .windsurf/:** AI tool configuration directories. Contains custom prompts, rules, and workflows for different AI coding assistants. Auto-generated by respective tools.

**.github/:** GitHub-specific configuration including GitHub Actions workflows and chat modes.

**.planning/:** Planning and analysis documents. Contains `codebase/` for architecture and structure documentation. Used for project planning and codebase mapping.

**node_modules/:** Third-party dependencies. Auto-generated by npm. Do not commit.

**frontend/dist/:** Production build output. Auto-generated by Vite build process. Do not commit.

**frontend/public/:** Static assets served directly by the development server. Favicons, logos, and other static files.

**docs/:** Project documentation separate from code. Contains stories, architecture, and other documentation.

---

*Structure analysis: 2026-02-03*
