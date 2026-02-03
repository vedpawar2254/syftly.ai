# Roadmap: Syftly.ai

## Overview

Syftly.ai evolves from session-based topic aggregation to full collaborative intelligence. The journey begins with secure user accounts and personalization, progresses through intent-aware synthesis of multi-source content, adds persistent topic following across devices, and culminates in community-driven corrections and threaded discussions. Each phase delivers verifiable value: authentication enables persistent preferences, intent-aware synthesis tailors information to cognitive needs, topic aggregation provides the core value proposition, and comments turn static summaries into evolving knowledge through collaborative refinement.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Authentication & Profile** - Secure user accounts with personalized synthesis preferences
- [ ] **Phase 2: Intent-Aware Synthesis** - Tailored summaries matching user intent and cognitive needs
- [ ] **Phase 3: Topic Aggregation** - Multi-source news discovery with persistent topic following
- [ ] **Phase 4: Comments & Corrections** - Threaded discussions with evidence-based corrections

## Phase Details

### Phase 1: Authentication & Profile

**Goal**: Users can securely access their accounts and customize synthesis preferences

**Depends on**: Nothing (first phase)

**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, AUTH-07, AUTH-08, AUTH-09, PROF-01, PROF-02, PROF-03, PROF-04, PROF-05

**Success Criteria** (what must be TRUE):
  1. User can sign up with email and password, receive verification email, and verify their account
  2. User can log in with email/password and stay logged in across browser refreshes using JWT tokens
  3. User can log out from any page and reset password via email link with secure password hashing
  4. User can create profile with display name, bio, and avatar image
  5. User can set default synthesis preferences (length, format, perspective, complexity) and view/edit their profile

**Plans**: TBD (to be determined during planning)

Plans:
- [ ] 01-01: User authentication system with JWT tokens and Better Auth integration
- [ ] 01-02: Profile management with avatar upload and synthesis preferences
- [ ] 01-03: Email verification and password reset flows

### Phase 2: Intent-Aware Synthesis

**Goal**: Users can specify how they want summaries synthesized and see intent applied

**Depends on**: Phase 1 (requires user profile for intent storage)

**Requirements**: INTENT-01, INTENT-02, INTENT-03, INTENT-04, INTENT-05, INTENT-06, INTENT-07, INTENT-08

**Success Criteria** (what must be TRUE):
  1. User can select summary length (short/medium/long), format (narrative/bullet/perspectives/factual), perspective (balanced/optimistic/skeptical), and complexity (beginner/expert/technical)
  2. User can save default intent preferences in their profile and override intent per topic without visiting settings
  3. LLM receives intent parameters in system prompt and generates summaries matching specified intent
  4. Summary displays which intent parameters were used for synthesis

**Plans**: TBD (to be determined during planning)

Plans:
- [ ] 02-01: Intent controller with save/load preferences and LangGraph prompt injection
- [ ] 02-02: Frontend intent controls with per-topic override capability

### Phase 3: Topic Aggregation

**Goal**: Users can discover news topics and follow them across all their devices

**Depends on**: Phase 1 (requires user account for persistent following)

**Requirements**: TOPIC-01, TOPIC-02, TOPIC-03, TOPIC-04, TOPIC-05, TOPIC-06

**Success Criteria** (what must be TRUE):
  1. User can enter a topic and fetch articles from 3+ Indian news sources (The Hindu, Times of India, Indian Express)
  2. System synthesizes multiple articles into one intent-aware summary using LangGraph 2-agent workflow
  3. User can follow topics and have them persisted to database (not localStorage-only)
  4. Followed topics sync across devices when user logs in

**Plans**: TBD (to be determined during planning)

Plans:
- [ ] 03-01: Database-backed topic following with user association
- [ ] 03-02: Frontend topic following UI with authenticated sync

### Phase 4: Comments & Corrections

**Goal**: Users can discuss topic summaries and provide evidence-based corrections

**Depends on**: Phase 1 (requires authentication) and Phase 3 (requires topic summaries)

**Requirements**: COMM-01, COMM-02, COMM-03, COMM-04, COMM-05, COMM-06, COMM-07, COMM-08, COMM-09, COMM-10

**Success Criteria** (what must be TRUE):
  1. Authenticated users can comment on topic summaries with flag type (discussion/correction/context)
  2. Corrections require source URL for evidence, all comments display timestamps
  3. Comments support 1-level threading (parent-child replies)
  4. User can edit own comments and delete own comments (soft delete)
  5. Users can report inappropriate comments, system auto-hides comments with 3+ reports
  6. Rate limiting applies (max 5 comments/minute per user)

**Plans**: TBD (to be determined during planning)

Plans:
- [ ] 04-01: Comment CRUD operations with threading, timestamps, and soft delete
- [ ] 04-02: Moderation features (reporting, auto-hide, rate limiting) and correction workflow with evidence

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Authentication & Profile | 0/3 | Not started | - |
| 2. Intent-Aware Synthesis | 0/2 | Not started | - |
| 3. Topic Aggregation | 0/2 | Not started | - |
| 4. Comments & Corrections | 0/2 | Not started | - |

---

*Roadmap created: February 3, 2026*
*Last updated: February 3, 2026 after initial creation*
