# Technology Stack

**Analysis Date:** 2026-02-03

## Languages

**Primary:**
- JavaScript (ES Modules) - Frontend and backend codebase
- JSX - React components in frontend

**Secondary:**
- None

## Runtime

**Environment:**
- Node.js v22.19.0

**Package Manager:**
- npm
- Lockfile: present (`package-lock.json` in both `frontend/` and `backend/`)

## Frameworks

**Core:**
- React 19.2.0 - Frontend UI framework (`frontend/package.json`)
- Express 5.2.1 - Backend API server (`backend/package.json`)
- TailwindCSS 4.1.18 - CSS framework for styling (`frontend/package.json`)

**AI/ML:**
- LangChain 1.2.13 - LLM orchestration (`backend/package.json`)
- LangGraph 1.1.2 - Stateful AI workflows (`backend/package.json`)
- LangChain OpenAI 1.2.3 - OpenAI integration (`backend/package.json`)

**Testing:**
- None configured - Backend has placeholder test script (`backend/package.json`)

**Build/Dev:**
- Vite 7.2.4 - Frontend build tool and dev server (`frontend/package.json`)
- ESLint 9.39.1 - JavaScript linting (`frontend/package.json`)
- Nodemon 3.1.11 - Backend development server with auto-reload (`backend/package.json`)

## Key Dependencies

**Critical:**
- Axios 1.13.2 - HTTP client for frontend API calls (`frontend/package.json`)
- React Router DOM 7.12.0 - Client-side routing (`frontend/package.json`)
- Mongoose 9.1.2 - MongoDB ODM (`backend/package.json`)

**Infrastructure:**
- CORS 2.8.5 - Cross-origin resource sharing middleware (`backend/package.json`)
- Helmet 8.1.0 - Security HTTP headers (`backend/package.json`)
- Morgan 1.10.1 - HTTP request logger (`backend/package.json`)
- dotenv 17.2.3 - Environment variable management (`backend/package.json`)

**Authentication:**
- jsonwebtoken 9.0.3 - JWT token generation and verification (`backend/package.json`)
- bcryptjs 3.0.3 - Password hashing (`backend/package.json`)

**Content Ingestion:**
- rss-parser 3.13.0 - RSS feed parsing (`backend/package.json`)

**Validation:**
- express-validator 7.3.1 - Request validation middleware (`backend/package.json`)

## Configuration

**Environment:**
- dotenv package for `.env` file loading
- Backend config: `backend/.env.example` defines required variables
- Frontend config: `frontend/.env` defines `VITE_API_URL`

**Required env vars (backend):**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/syftlyai
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
LLM_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

**Build:**
- Frontend: `frontend/vite.config.js` - Vite configuration with React and TailwindCSS plugins
- ESLint: `frontend/eslint.config.js` - Flat config format with React plugins

## Platform Requirements

**Development:**
- Node.js v22.19.0 or compatible version
- MongoDB instance (local or remote)
- OpenAI API key for LLM features

**Production:**
- Node.js server with MongoDB database
- OpenAI API credentials
- Environment-specific configuration

---

*Stack analysis: 2026-02-03*
