# Technology Stack

**Project:** Syftlyai
**Researched:** February 3, 2025
**Overall confidence:** HIGH

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js | 20+ LTS | Backend runtime | Industry standard, long-term support, V8 engine optimizations |
| Express | 5.2.1 | Backend server | Mature ecosystem, lightweight, works well with all auth options |
| React | 18+ | Frontend framework | Existing stack, vast ecosystem, stable API |
| Vite | Latest | Frontend build tool | Existing stack, fast HMR, modern bundling |

### Authentication
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Better Auth** | 1.4.18 | Primary auth solution | Future of Auth.js, framework-agnostic, TypeScript-first, comprehensive feature set, plugin ecosystem for 2FA/passkey/multi-tenancy, AI tooling built-in (LLMs.txt, MCP, skills), migration path from Auth.js |
| @auth/express | 0.12.1 | Fallback/alternative | Proven Auth.js implementation for Express, stable, mature ecosystem, can migrate to Better Auth later |
| MongoDB + Mongoose | Existing | User/session storage | Already in stack, Better Auth has MongoDB adapter |

**Rationale:** Better Auth is now the successor to Auth.js/NextAuth after their acquisition. It's actively maintained, framework-agnostic, and includes built-in AI tooling. Auth.js/Express remains a stable alternative if migration is a concern.

### LLM & Intent-Aware Synthesis
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **LangChain JS** | 1.2.16 | Core LLM framework | Existing stack, standard model interface, comprehensive integrations, agent architecture |
| **LangGraph** | Latest (existing) | Agent orchestration | Existing stack, supports deterministic/agentic workflows, streaming, persistence, human-in-the-loop |
| **@langchain/openai** | 1.1.10 | OpenAI integration | Existing stack, supports GPT-4 models, streaming responses |
| **@langchain/anthropic** | 1.2.4 | Anthropic integration | Existing stack, Claude models, excellent for synthesis tasks |
| **@langchain/community** | 1.2.16 | Additional integrations | Community-maintained providers, broader model support |
| LangSmith | - | Debugging/observability | ESSENTIAL for complex agent debugging, trace visualization, performance metrics |

**Rationale:** Your existing LangGraph + LangChain stack aligns with 2025 best practices. LangSmith is highly recommended for observability. For RAG/retrieval, use LangChain's retriever patterns with MongoDB Atlas Vector Search (newer than your existing Mongoose setup).

### Rich Text & Comment/Correction System
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Tiptap** | 3.x (via @tiptap/react 3.18.0) | Headless editor | Headless = full UI control, framework-agnostic, React-first API, 100+ extensions, modern ProseMirror-based, smaller bundle size |
| @tiptap/extension-collaboration | 3.18.0 | Real-time collaboration | Y.js-based CRDT synchronization, offline-first, works with custom backend |
| @tiptap/extension-collaboration-cursor | 2.26.2 | Multi-user cursors | Shows where other users are typing, essential for real-time collaboration |
| @tiptap/extension-suggestion | Latest | Track changes/suggestions | Accept/decline edits, document review workflow, correction system foundation |
| **Hocuspocus** (Tiptap Cloud or self-hosted) | Latest | Collaboration backend | Official Tiptap backend, handles WebSockets/CRDTs, can self-host or use Cloud |

**Rationale:** Tiptap is the modern choice for React apps needing rich text + collaboration. It's headless (build your own UI) and has first-class collaboration support. Comments can be built on top of suggestion tracking or integrated via Tiptap Cloud services.

### Database
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **MongoDB** | 6+ | Primary database | Existing stack, JSON flexibility, scales well |
| **Mongoose** | 9.1.5 | ODM | Existing stack, schema validation, middleware support |
| **MongoDB Atlas Vector Search** | Atlas feature | Semantic search | Add vector search to existing MongoDB (no new DB needed), LangChain has @langchain/mongodb integration |

**Rationale:** Stick with MongoDB but add Atlas Vector Search for RAG capabilities. LangChain has first-class MongoDB integration (`@langchain/mongodb` package).

### Comment System Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Custom Mongoose schemas | - | Comment storage | Full control over schema, relationship with users and documents |
| Express REST API | - | Comment CRUD | Fits existing backend architecture |
| Real-time (Socket.io or ws) | Latest | Live comment updates | Required for real-time collaboration features |

**Note on Tiptap Cloud:** Tiptap offers cloud services for comments, track changes, and real-time collaboration. Consider this for MVP if you want faster development. Self-hosted Hocuspocus gives full control but requires WebSocket infrastructure.

## Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **zod** | Latest | Schema validation | For type-safe API requests and user inputs |
| **clsx** or **classnames** | Latest | Conditional CSS | For component styling (if using vanilla CSS) |
| **date-fns** or **dayjs** | Latest | Date formatting | For comment timestamps, user activity |
| **nanoid** | Latest | Unique IDs | For comment IDs, document IDs (shorter than UUID) |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Authentication | Better Auth | Clerk | Cloud-only, no self-hosting, potential vendor lock-in, higher cost at scale |
| Authentication | Better Auth | Passport.js | More boilerplate, no built-in TypeScript, no modern features (passkey, 2FA require plugins) |
| Authentication | Better Auth | Auth0 | Cloud-only, expensive for small teams, complex setup |
| Rich Text | Tiptap | CKEditor 5 | Heavier bundle, less flexible UI, more opinionated, harder to customize |
| Rich Text | Tiptap | Lexical | Facebook's project, smaller ecosystem, less mature than Tiptap |
| Rich Text | Tiptap | ProseMirror | Low-level library, too much boilerplate, need to build everything yourself |
| Comments | Custom with Tiptap | Tiptap Cloud | Cloud-only, pricing TBD, adds external dependency |
| Vector Search | MongoDB Atlas | Pinecone/Qdrant | New infrastructure, separate service to manage, sync complexity |

## Installation

### Authentication
```bash
# Primary recommendation: Better Auth
npm install better-auth
npm install -D @types/better-auth

# Alternative: Auth.js Express
npm install @auth/express
```

### LLM & Synthesis
```bash
# Core (already installed)
npm install langchain @langchain/openai @langchain/anthropic @langchain/community

# Vector search for MongoDB
npm install @langchain/mongodb

# Observability (recommended)
# LangSmith is a service, no npm package needed
# Set environment variables:
# LANGSMITH_TRACING=true
# LANGSMITH_API_KEY=your-key
```

### Rich Text & Collaboration
```bash
# Tiptap core
npm install @tiptap/react @tiptap/starter-kit @tiptap/pm

# Collaboration
npm install @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor @tiptap/extension-suggestion

# WebSocket backend for collaboration
npm install hocuspocus-provider
# OR use Tiptap Cloud (no installation needed)
```

### Supporting Libraries
```bash
npm install zod clsx date-fns nanoid
npm install -D @types/node
```

## Architecture Notes

### Authentication Flow
1. User signs up/signs in via Better Auth
2. Backend validates credentials via Better Auth
3. Session stored in MongoDB (Better Auth has MongoDB adapter)
4. JWT or session cookie returned to frontend
5. Frontend uses Better Auth React hooks (`useSession`, `signIn`, `signOut`)

### Intent-Aware Synthesis Flow
1. User submits query/intent
2. LangGraph agent analyzes intent
3. Based on intent, agent:
   - Performs retrieval via MongoDB Atlas Vector Search
   - Synthesizes response using OpenAI or Anthropic
   - May use tools for additional context
4. Response streamed to frontend
5. All traces logged to LangSmith for debugging

### Comment/Correction Flow
1. User views content in Tiptap editor
2. User can:
   - Leave comments on text selection
   - Suggest edits (using @tiptap/extension-suggestion)
   - Accept/decline other's suggestions
3. Real-time updates via Hocuspocus/WebSockets
4. Comments stored in MongoDB with:
   - userId, contentId, position data
   - Text selection range (start/end offsets)
   - Status (active, resolved)
   - Author info

## Sources

### Authentication
- **HIGH confidence:** Better Auth official docs (https://better-auth.com/docs)
- **HIGH confidence:** Auth.js migration guide to Better Auth (https://authjs.dev/getting-started/migrate-to-better-auth)
- **HIGH confidence:** Better Auth npm package (verified version 1.4.18)
- **HIGH confidence:** @auth/express npm package (verified version 0.12.1)

### LLM & Synthesis
- **HIGH confidence:** LangChain official docs (https://docs.langchain.com)
- **HIGH confidence:** LangChain RAG tutorial (verified Python/JS examples)
- **HIGH confidence:** LangChain npm packages (verified versions)
- **HIGH confidence:** Existing project uses LangGraph and LangChain

### Rich Text & Comments
- **HIGH confidence:** Tiptap official docs (https://tiptap.dev/docs)
- **HIGH confidence:** Tiptap collaboration/cursor packages (verified npm versions)
- **HIGH confidence:** CKEditor 5 docs (comparison purposes)
- **MEDIUM confidence:** Tiptap Cloud service details (docs available, pricing TBD)

### Database
- **HIGH confidence:** MongoDB Atlas Vector Search documentation
- **HIGH confidence:** LangChain MongoDB integration docs
- **HIGH confidence:** Mongoose npm package (verified version 9.1.5)
