# Syftly.ai

## What This Is

Syftly.ai transforms information into knowledge. Users enter news topics and receive AI-synthesized summaries from multiple sources, tuned to their intent (quick update, deep analysis, implications, etc.). Unlike news aggregators that show articles, Syftly.ai builds understanding through curated, multi-perspective narratives.

## Core Value

Users can quickly grasp complex situations through AI-synthesized summaries that are personalized to how they want to consume information.

## Requirements

### Validated

None yet — ship to validate.

### Active

- User authentication and profiles
  - Sign up/login with email/password
  - User profile with display name, bio, avatar
  - Profile settings for synthesis preferences
- Intent-aware synthesis
  - Explicit intent controls (length, format, style, perspective, complexity)
  - Intent selection flow when searching topics
  - Profile saves preferred intent (can override per topic)
- Topic-based news aggregation
  - Multi-source article fetching (3+ Indian news sources)
  - LangGraph-based synthesis (Scraper + LLM agents)
  - Follow topics for future updates
- Comments and corrections
  - Authenticated users can comment on any factual content
  - Comments appear below summary/articles
  - Flag as correction with evidence/source

### Out of Scope

- Situation evolution timeline (tracking how stories change over time)
- Social features (follow other users, view public profiles)
- Multi-language support (v2+)
- Mobile app (web-first, mobile later)
- Notifications (email, push, in-app)
- Bookmarks and reading lists
- Advanced personalization (semantic preferences, behavioral learning)

## Context

**Existing codebase:**
- Milestone 1 complete: topic-based aggregation, multi-source synthesis, session-based follow
- Backend: Node.js + Express + LangGraph + MongoDB
- Frontend: React + Vite
- Database models: Evidence, TopicSummary, FollowedTopic

**Current state:**
- Working end-to-end flow: user types topic → fetches articles → synthesizes summary
- 3 Indian news sources integrated (The Hindu, Times of India, Indian Express)
- Follow feature works via localStorage (session-based)
- Basic routing and navigation structure

**Known issues to address:**
- Code quality: TODOs, commented code, inconsistent patterns
- Error handling: Needs graceful degradation
- Performance: No caching, unoptimized queries
- No user authentication (everything is session-based)
- Follow feature tied to localStorage (persists only on one device)

## Constraints

- **Timeline**: Start simple, iterate quickly
- **Tech Stack**: Build on existing (Node.js, React, MongoDB, LangGraph)
- **Budget**: Consider LLM API costs (implement caching, rate limiting)
- **Data Retention**: Define article/summary retention policy (for storage and privacy)
- **User Growth**: Start with friends/family beta before public launch

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Intent controls explicit, not implicit | Easier to implement correctly; better UX for v1 | — Pending |
| Intent saved in profile + override per topic | Balances convenience with flexibility | — Pending |
| Authenticated comments only | Reduces spam/abuse; aligns with auth requirement | — Pending |
| Session-based follow for v1 (upgrade to profile-based) | Milestone 1 already has this working; auth comes later | — Pending |
- Google Doc-style comments too complex for v1
- Social features (follow users) defer to v2+

---
*Last updated: February 3, 2026 after initialization*
