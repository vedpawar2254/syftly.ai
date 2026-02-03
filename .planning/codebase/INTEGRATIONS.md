# External Integrations

**Analysis Date:** 2026-02-03

## APIs & External Services

**LLM Provider:**
- OpenAI GPT-4o-mini - AI-powered news synthesis and topic matching
  - SDK/Client: LangChain OpenAI (`@langchain/openai`)
  - Auth: `OPENAI_API_KEY` environment variable
  - Model: `gpt-4o-mini` with temperature 0.7 (`backend/graph/newsGraph.js`)
  - Used for: Synthesizing multiple news articles into unified summaries with source attribution

**RSS Feeds:**
- Indian news sources configured in `backend/config/sources.js`
  - The Hindu (National) - `https://www.thehindu.com/news/national/?service=rss`
  - Times of India (Top news) - `https://timesofindia.indiatimes.com/rssfeeds/296589292.cms`
  - Indian Express (India) - `https://indianexpress.com/section/india/feed/`
  - Parser: rss-parser 3.13.0 (`backend/agents/scraperAgent.js`)

## Data Storage

**Databases:**
- MongoDB (Document database)
  - Connection: `MONGODB_URI` environment variable (`mongodb://localhost:27017/syftlyai`)
  - Client: Mongoose 9.1.2
  - Connection config: `backend/config/db.js`
  - Connection pooling: maxPoolSize: 10, serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000

**Data Collections (Mongoose Models):**
- Evidence - News articles from RSS feeds (`backend/models/evidence.js`)
- TopicSummary - AI-synthesized topic summaries (`backend/models/TopicSummary.js`)
- FollowedTopic - User-followed topics for tracking (`backend/models/FollowedTopic.js`)
- Situation - Situation tracking (`backend/models/Situation.js`)
- Change - Change tracking within situations (`backend/models/Change.js`)
- Entity - Named entity tracking (`backend/models/Entity.js`)

**File Storage:**
- Local filesystem only - No cloud file storage configured

**Caching:**
- None - Each request fetches fresh data from RSS feeds and LLM

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based authentication
  - Implementation: `backend/middleware/auth.js`
  - Token library: jsonwebtoken 9.0.3
  - Secret: `JWT_SECRET` environment variable
  - Expiration: 7 days (configurable via `JWT_EXPIRES_IN`)
  - Password hashing: bcryptjs 3.0.3

**Auth Methods:**
- `authenticate(req, res, next)` - Required authentication middleware
- `optionalAuth(req, res, next)` - Optional authentication for endpoints that work without login

**Session Management:**
- Session ID stored in frontend localStorage (`frontend/src/utils/storage.js`)
- Session ID sent as query parameter for follow operations

## Monitoring & Observability

**Error Tracking:**
- None - No external error tracking service (e.g., Sentry) configured

**Logs:**
- Morgan 1.10.1 - HTTP request logging in development mode (`backend/server.js`)
- Custom logger utility: `backend/utils/logger.js`
- Console logging throughout agents and services for debugging

## CI/CD & Deployment

**Hosting:**
- None specified - Project appears to be in development

**CI Pipeline:**
- None - No GitHub Actions or other CI/CD configuration detected

## Environment Configuration

**Required env vars (backend):**
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT token expiration time
- `FRONTEND_URL` - Frontend URL for CORS (production)
- `LLM_PROVIDER` - LLM provider choice (openai/anthropic)
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key (if using Anthropic)

**Required env vars (frontend):**
- `VITE_API_URL` - Backend API URL (default: `http://localhost:5000/api`)

**Secrets location:**
- Environment variables in `.env` files (not committed to git)
- `.env.example` files document required variables

## Webhooks & Callbacks

**Incoming:**
- None configured

**Outgoing:**
- None configured - All RSS feeds are fetched via polling

## Cross-Origin Configuration

**CORS Policy:**
- Development: Allows `http://localhost:5173`, `http://localhost:3000`, `http://localhost:5174`
- Production: Uses `FRONTEND_URL` environment variable
- Credentials: Enabled (allows cookies/auth headers)
- Configuration: `backend/server.js`

---

*Integration audit: 2026-02-03*
