Constraint 1 — Frontend must treat backend as unstable

Assume:

Fields may disappear

Structures may flatten or nest

Some data may arrive late or partially

Practically:

Defensive rendering

No deep assumptions like situation.key_facts[0].claim

Constraint 2 — Frontend must never encode business logic

Bad:

“If confidence > 0.7, show badge”

“If change_type === confirmation, do X”

Good:

Backend sends display hints

Frontend renders what it’s told

This preserves learning on the backend later.

Constraint 3 — Frontend consumes views, not primitives

Frontend should consume:

FeedItem

TimelineItem

ChatResponse

Not:

Raw Evidence

Raw Change

Raw Situation

Even if these views are mocked.

3. Frontend scope that actually teaches you something

Don’t build “pages”. Build interaction surfaces.

Surface 1 — Insight Feed

Purpose:

Validate “cut the noise”

Mock shape:

{
  "id": "string",
  "title": "What changed",
  "summary": "2–3 line insight",
  "confidence": 0.82,
  "why": "Because of new confirmation from X",
  "updated_at": "timestamp"
}


What you’ll learn:

Information density

What actually matters to show

Surface 2 — Situation Deep Dive

Purpose:

Validate timelines + evolution

Mock:

{
  "headline": "Venezuela political crisis",
  "current_state": "…",
  "timeline": [
    {
      "time": "timestamp",
      "change": "New confirmation",
      "impact": "Raises confidence"
    }
  ],
  "sources": ["Reuters", "AP"]
}


This will later map cleanly to Situation + Change.

Surface 3 — Ask-the-News (Chat)

Purpose:

Force clarity on context assembly

Mock responses only, for now.

What matters:

Streaming

Follow-ups

Citations UI

Optional Surface — Compare Coverage

Purpose:

Multi-source reasoning

This one will heavily shape backend design later — good.

4. Backend contracts (freeze these, mock everything)

Even before backend exists, define interfaces.

Example: Feed API (mocked)
GET /feed
→ FeedItem[]


Frontend does not care how it’s generated.

Same for:

/situation/:id

/chat

These contracts become your backend learning checkpoints.

5. How this helps backend learning later (important)

When you return to backend:

You’ll know which fields are useless

You’ll feel schema pain immediately

You’ll understand latency sensitivity

You’ll see where async vs sync matters

That’s real system design learning, not diagrams.