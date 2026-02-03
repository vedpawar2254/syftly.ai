# Project Research Summary

**Project:** Syftly.ai
**Domain:** AI-powered news intelligence platform
**Researched:** February 3, 2026
**Confidence:** HIGH

## Executive Summary

Syftly.ai is an AI-powered news intelligence platform that synthesizes multi-source articles into intent-aware summaries. The research confirms the existing stack (Node.js, Express, React, MongoDB, LangGraph) is well-aligned with 2025 best practices. The recommended approach builds three major subsystems: JWT-based authentication with Better Auth, intent-aware synthesis injected into existing LangGraph workflows, and a threaded comment system using Tiptap for rich text collaboration.

Key risks are well-documented in OWASP guidelines: user enumeration via authentication error messages, direct prompt injection in AI features, and stored XSS in comment systems. All have clear mitigations using generic error messages, structured prompts with delimiters, and HTML sanitization libraries. The research provides high-confidence architectural patterns for build order: authentication first (foundation), then intent-aware synthesis (extends existing LangGraph), then comments (requires auth), and finally integration features.

## Key Findings

### Recommended Stack

The research strongly validates the existing stack and adds targeted technologies for new features. Better Auth is recommended as the primary auth solution (successor to Auth.js, framework-agnostic, includes AI tooling), with Tiptap for rich text collaboration and MongoDB Atlas Vector Search for RAG capabilities. LangSmith is recommended for observability in complex agent workflows.

**Core technologies:**
- **Better Auth** (1.4.18) — JWT-based authentication with refresh tokens, TypeScript-first, migration path from Auth.js, built-in AI tooling
- **Tiptap** (3.x) — Headless rich text editor with collaboration extensions, full UI control, React-first API
- **LangGraph + LangChain JS** — Existing stack aligns with best practices, supports deterministic/agentic workflows with intent injection
- **MongoDB Atlas Vector Search** — Add vector search to existing MongoDB (no new DB needed), LangChain has @langchain/mongodb integration
- **LangSmith** — Debugging/observability for complex agent workflows, essential for trace visualization and performance metrics

### Expected Features

The research identifies clear feature tiers. Table stakes are baseline features users expect (email/password auth, basic comments, summary controls). Differentiators are features that set Syftly.ai apart (explicit intent dimensions, perspective-aware synthesis, correction-driven evolution). Anti-features are explicitly to avoid (social login v1, implicit personalization, anonymous comments).

**Must have (table stakes):**
- Email/password signup, login, logout — baseline expectation for account-based systems
- Basic profile (name, avatar, synthesis preferences) — personal identity and personalization foundation
- Summary length and format controls — different users have different time budgets and cognitive styles
- Authenticated comments with timestamps — accountability and transparency for discussion
- Basic moderation (delete button) — abuse management is inevitable

**Should have (competitive):**
- Explicit intent dimensions (length, style, perspective, complexity) — granular control matching mental models, core differentiator
- Perspective-aware synthesis (shows multiple viewpoints) — uniquely valuable for polarized topics
- Single-click intent override per topic — balances convenience with flexibility
- Correction flagging with source URL — evidence requirement for factual claims, quality signal
- Threaded replies (1-level) — enables deeper discussion while keeping structure manageable

**Defer (v2+):**
- Social login (Google/Facebook) — adds third-party dependency; privacy concerns; dev effort for small userbase
- Profile following/followers — social distraction; focus on content quality, not social graph
- Implicit personalization (AI infers preferences) — black-box UX; hard to understand why content is what it is
- Anonymous comments — spam/abuse magnet; no accountability for corrections

### Architecture Approach

The recommended architecture is JWT-based authentication with refresh tokens, intent-injected LangGraph workflows, and threaded comment system with Tiptap collaboration backend. This builds on existing patterns while adding three major subsystems. Authentication uses short-lived access tokens (15m) with refresh tokens (7d) for security. Intent-aware synthesis injects user preferences into LLM prompts via LangGraph state. Comments use a separate Mongoose model with threading (1-level max), Tiptap data tracking, and correction-specific fields for evidence verification.

**Major components:**
1. **AuthController + TokenService + RefreshTokenStore** — JWT generation/verification, refresh token management, session revocation capability
2. **IntentController + LangGraphService** — Load/save user synthesis preferences, inject intent into LLM agent calls
3. **CommentController + TiptapProvider** — CRUD operations, threading, rich text collaboration, moderation endpoints
4. **User Model (extended)** — Adds synthesisPreferences subdocument, password hash, email verification tokens
5. **Comment Model** — Threading via parentId, Tiptap JSON tracking, correctionData for evidence verification
6. **TopicSummary Model (enhanced)** — Adds synthesisIntent metadata, evolutionVersion for future re-synthesis

### Critical Pitfalls

The research identifies 7 critical pitfalls across auth, AI features, and comment systems, all with clear mitigations from OWASP guidelines. These are mistakes that cause rewrites, security breaches, or major operational issues.

1. **User Enumeration via Error Messages** — Use generic error messages ("Invalid username or password") regardless of which is wrong, normalize response timing across failure paths, use constant-time password comparison
2. **Direct Prompt Injection via User Input** — Use structured prompts with clear delimiters (SYSTEM_INSTRUCTIONS vs USER_DATA_TO_PROCESS), implement input validation for injection patterns, validate LLM outputs for prompt leakage
3. **RAG Poisoning from External Content** — Sanitize external content before including in agent context, remove common injection patterns from retrieved documents, implement content filtering for known malicious payloads
4. **Tool Abuse Without Least Privilege** — Apply least privilege principle to all tools (read-only where possible), implement per-tool permission scoping with allowlists, validate tool call parameters against user permissions
5. **Stored XSS via Unsensitized Input** — HTML entity encode all user-controlled data when displaying, use HTML sanitization libraries (DOMPurify) for rich text, implement Content Security Policy as defense-in-depth
6. **Spam via Lack of Rate Limiting** — Implement rate limiting per user/IP for comment submissions, require CAPTCHA after small number of failed submissions, use bot detection and reputation scoring
7. **Weak Session Management on Risk Events** — Invalidate all existing sessions after password resets, account recovery, or detected suspicious activity, require re-authentication for sensitive features

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Authentication Foundation
**Rationale:** All other features depend on user identification; JWT tokens provide foundation for intent preferences and comment ownership
**Delivers:** User model, token service, auth controller, auth middleware, frontend auth provider with Better Auth
**Addresses:** Table stakes auth features (email/password signup, login, logout, profile settings)
**Avoids:** User enumeration, weak password policies, poor password manager support

### Phase 2: Intent-Aware Synthesis
**Rationale:** Independent of comments, builds directly on existing LangGraph stack; extends current synthesis without new infrastructure
**Delivers:** Extended user model with synthesisPreferences, intent service/controller, LangGraph enhancement with prompt builder, frontend intent controls
**Uses:** LangGraph, LangChain JS, MongoDB (existing user model)
**Implements:** Intent injection pattern, intent fallback pattern, per-topic override
**Addresses:** Table stakes summary controls, differentiator intent dimensions

### Phase 3: Comment System
**Rationale:** Independent of synthesis, requires auth foundation from Phase 1; uses Tiptap for rich text collaboration
**Delivers:** Comment model/service, comment controller, frontend Tiptap integration, moderation endpoints, correction workflow
**Uses:** Tiptap with collaboration extensions, Mongoose (new Comment model), auth from Phase 1
**Implements:** Comment threading query pattern, correction verification workflow, auto-hide threshold
**Addresses:** Table stakes comments, differentiator correction flagging
**Avoids:** Stored XSS, spam via no rate limiting, email enumeration

### Phase 4: Integration & Polish
**Rationale:** Ties together all subsystems; correction-driven evolution requires auth, synthesis, and comments
**Delivers:** Correction-triggered re-synthesis workflow, intent-aware summary caching, real-time collaboration (optional WebSocket server), performance optimizations
**Uses:** All previous phases, MongoDB Atlas Vector Search (for RAG enhancement)
**Implements:** Token rotation pattern, intent propagation across devices

### Phase Ordering Rationale

- **Auth first** because intent preferences, comment ownership, and correction verification all require authenticated users
- **Synthesis second** because it extends existing LangGraph stack without new infrastructure dependencies; intent-aware summaries can be delivered before comments
- **Comments third** because they require auth foundation but are independent of synthesis changes
- **Integration last** because correction-driven evolution requires all three subsystems to be functional

This grouping minimizes dependencies between phases (Phases 2 and 3 can run in parallel if team capacity allows), avoids critical pitfalls by addressing security in each phase's design, and delivers increasing value from baseline auth to personalized intelligence to collaborative evolution.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3:** Correction-triggered re-synthesis workflow — complex integration, needs LangGraph state persistence research for re-execution with new evidence
- **Phase 4:** Real-time collaboration via Tiptap — WebSocket infrastructure research needed (Hocuspocus self-hosted vs Tiptap Cloud, scaling patterns)
- **Phase 4:** Intent-aware caching strategy — different cache keys per intent combination requires cache invalidation research for evolved summaries

Phases with standard patterns (skip research-phase):
- **Phase 1:** JWT authentication with Better Auth — well-documented, official docs provide migration patterns, standard auth flow
- **Phase 2:** LangGraph state injection — existing codebase already uses LangGraph, intent extension follows established patterns
- **Phase 3:** Mongoose models with threading — standard relational patterns in NoSQL, Tiptap provides rich text patterns

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified with official docs and npm package versions; existing stack validated against 2025 best practices |
| Features | MEDIUM | Table stakes and anti-features from authoritative UX/security sources (NN/G, OWASP); differentiators inferred from AI personalization literature without direct competitive analysis |
| Architecture | HIGH | Patterns from official docs (Better Auth, LangGraph, Tiptap, Mongoose); anti-patterns based on well-established security principles |
| Pitfalls | HIGH | All findings from OWASP authoritative sources (Authentication Cheat Sheet, LLM Prompt Injection Prevention, AI Agent Security, XSS Prevention) |

**Overall confidence: HIGH**

### Gaps to Address

- **LLM prompt engineering for intent dimensions:** Research needed on optimal prompt patterns for length/style/perspective/complexity synthesis (test with GPT-4o-mini during implementation)
- **Correction verification workflow:** No direct precedents found; design community voting pattern and define what constitutes "verified" (moderator vs. community consensus)
- **Real-time collaboration scaling:** Tiptap Cloud pricing TBD; self-hosted Hocuspocus infrastructure needs load balancing research at scale (defer to Phase 4 or post-MVP)
- **Competitive analysis gaps:** No direct analysis of Google News, Microsoft Start, Perplexity AI performed; validate differentiator claims with user testing before v2+

## Sources

### Primary (HIGH confidence)
- Better Auth official docs (https://better-auth.com/docs) — auth implementation, migration from Auth.js, MongoDB adapter
- LangChain docs (https://docs.langchain.com) — LangGraph state management, agent patterns, MongoDB integration
- Tiptap docs (https://tiptap.dev/docs) — headless editor, collaboration extensions, rich text patterns
- MongoDB Atlas Vector Search docs — vector indexing, @langchain/mongodb integration
- OWASP Authentication Cheat Sheet (https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) — user enumeration, session management, password policies
- OWASP LLM Prompt Injection Prevention Cheat Sheet (https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) — structured prompts, input validation
- OWASP AI Agent Security Cheat Sheet (https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html) — tool security, least privilege, memory poisoning
- OWASP Cross Site Scripting Prevention Cheat Sheet (https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) — output encoding, HTML sanitization

### Secondary (MEDIUM confidence)
- Nielsen Norman Group: Participation Inequality (90-9-1 Rule) — comment system expectations, voting to improve signal/noise
- Internal docs (PROJECT.md, FEATURE_ROADMAP.md, README.md) — existing features, planned scope, core value proposition
- Community consensus on JWT vs Sessions — industry best practices, no direct source comparison performed

### Tertiary (LOW confidence)
- Tiptap Cloud service details — docs available but pricing TBD, cloud-only dependency risk
- Correction-driven evolution patterns — novel feature, no direct precedents found in research
- Intent dimension optimal values — inferred from AI personalization literature, needs user validation

---
*Research completed: February 3, 2026*
*Ready for roadmap: yes*
