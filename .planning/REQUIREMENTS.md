# Requirements: Syftly.ai

**Defined:** February 3, 2026
**Core Value:** Users can quickly grasp complex situations through AI-synthesized summaries that are personalized to how they want to consume information.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User receives email verification after signup
- [ ] **AUTH-03**: User can log in with email/password and stay logged in across browser refreshes
- [ ] **AUTH-04**: User can log out from any page
- [ ] **AUTH-05**: Password is hashed securely with bcrypt/scrypt
- [ ] **AUTH-06**: User can reset password via email link
- [ ] **AUTH-07**: Access token expires in 15 minutes
- [ ] **AUTH-08**: Refresh token valid for 7 days with database revocation
- [ ] **AUTH-09**: Refresh token rotation on renewal (old token revoked)

### Profile

- [ ] **PROF-01**: User can create profile with display name
- [ ] **PROF-02**: User can write bio (max 500 chars)
- [ ] **PROF-03**: User can upload avatar image
- [ ] **PROF-04**: User can view and edit their own profile
- [ ] **PROF-05**: User can set default synthesis preferences

### Intent-Aware Synthesis

- [ ] **INTENT-01**: User can select summary length (short 50-100w, medium 150-300w, long 300-500w)
- [ ] **INTENT-02**: User can select summary format (narrative, bullet points, perspectives, factual)
- [ ] **INTENT-03**: User can select perspective bias (balanced, optimistic, skeptical)
- [ ] **INTENT-04**: User can select complexity level (beginner, expert, technical)
- [ ] **INTENT-05**: Default intent saved in user profile
- [ ] **INTENT-06**: User can override intent per topic without visiting settings
- [ ] **INTENT-07**: LLM receives intent parameters in system prompt
- [ ] **INTENT-08**: Summary displays which intent was used

### Topic Aggregation (Foundation from Milestone 1)

- [ ] **TOPIC-01**: User can enter topic and fetch articles from 3+ Indian news sources
- [ ] **TOPIC-02**: System synthesizes multiple articles into one summary
- [ ] **TOPIC-03**: User can follow topics (persisted to database via user account)
- [ ] **TOPIC-04**: Followed topics sync across devices (not localStorage-only)
- [ ] **TOPIC-05**: RSS feeds verified working (The Hindu, Times of India, Indian Express)
- [ ] **TOPIC-06**: LangGraph 2-agent workflow executes without errors

### Comments & Corrections

- [ ] **COMM-01**: Authenticated users can comment on topic summaries
- [ ] **COMM-02**: User can flag comment type as discussion, correction, or context
- [ ] **COMM-03**: Corrections require source URL for evidence
- [ ] **COMM-04**: Comments display with timestamps
- [ ] **COMM-05**: User can edit own comments
- [ ] **COMM-06**: User can delete own comments (soft delete)
- [ ] **COMM-07**: Comments support 1-level threading (parent-child)
- [ ] **COMM-08**: Users can report inappropriate comments
- [ ] **COMM-09**: System auto-hides comments with 3+ reports
- [ ] **COMM-10**: Rate limiting: max 5 comments/minute per user

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Social Features

- [ ] **SOCIAL-01**: Users can follow other users
- [ ] **SOCIAL-02**: Users can view public profiles with followed topics count
- [ ] **SOCIAL-03**: Follower/following counts on profiles
- [ ] **SOCIAL-04**: Activity feed showing followed users' activity

### Advanced Personalization

- [ ] **PERS-01**: User can select geographic scope (regional, national, international)
- [ ] **PERS-02**: User can select language preference (English, Hindi, etc.)
- [ ] **PERS-03**: Implicit personalization based on behavior (opt-in)

### Situation Evolution

- [ ] **EVO-01**: System tracks how topic summaries change over time
- [ ] **EVO-02**: Timeline shows each evolution with what changed
- [ ] **EVO-03**: Verified corrections trigger summary re-synthesis
- [ ] **EVO-04**: Corrections highlighted in updated summaries

### Notifications

- [ ] **NOTIF-01**: In-app notification center
- [ ] **NOTIF-02**: Email notifications for replies to user's comments
- [ ] **NOTIF-03**: Email notifications for new articles on followed topics
- [ ] **NOTIF-04**: User can configure notification preferences
- [ ] **NOTIF-05**: Push notifications (mobile)

### Advanced Moderation

- [ ] **MOD-01**: "Helpful" voting on comments
- [ ] **MOD-02**: Verified corrections show badge
- [ ] **MOD-03**: Admin panel for managing reported content
- [ ] **MOD-04**: Automated toxicity/spam detection
- [ ] **MOD-05**: New user probation (first 3 comments require approval)

### Platform Features

- [ ] **PF-01**: Bookmarking and reading lists
- [ ] **PF-02**: Search and discovery
- [ ] **PF-03**: Shareable links to topics
- [ ] **PF-04**: Dark mode support

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Anonymous comments | Spam/abuse magnet; no accountability for corrections |
| Social login (Google/Facebook/GitHub) | Adds third-party dependency; email/password sufficient for v1 |
| Public user profiles (v1) | Social distraction; focus on content quality, not social graph |
| Multi-level nested comments (3+ levels) | Signal-to-noise collapse; unreadable threads |
| Like/reaction buttons on comments | Gamification of opinions over factual corrections; "helpful" voting only |
| Real-time collaboration (Hocuspocus) | Too complex for v1; comments are sufficient |
| Implicit personalization (AI infers preferences) | Black-box UX; transparency > magic for v1 |
| Situation evolution timeline (v1) | Defer complexity; comments/corrections first |
| Multi-language support (v1) | English-only to validate core value proposition |
| Mobile app (v1) | Web-first, responsive design sufficient |
| Google Doc-style inline comments | Too complex for v1; attached comments sufficient |
| Comment threading per-article | Splits conversation; topic summaries are core unit |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01-09 | Phase 1 | Pending |
| PROF-01-05 | Phase 1 | Pending |
| INTENT-01-08 | Phase 2 | Pending |
| TOPIC-01-06 | Phase 3 | Pending |
| COMM-01-10 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

**Phase Summary:**
- Phase 1: Authentication & Profile (14 requirements) — AUTH-01-09, PROF-01-05
- Phase 2: Intent-Aware Synthesis (8 requirements) — INTENT-01-08
- Phase 3: Topic Aggregation (6 requirements) — TOPIC-01-06
- Phase 4: Comments & Corrections (10 requirements) — COMM-01-10

---
*Requirements defined: February 3, 2026*
*Last updated: February 3, 2026 after initial definition*
