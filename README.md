# syftly.ai

<details>
  <summary><b>Process note</b></summary>

I’m documenting this project day-by-day in a blog-style folder called `Documenting_the_whole_process`.

For each day:

* I start by writing down what I’m trying to figure out
* I end by writing what I actually learned
* I add a short progress summary

This PRD is a *living snapshot*, not a final spec.

</details>

---

# Product Requirements Document (PRD)

## 1. Product Overview

### Product Name

**syftly.ai**

### One-line Description

A chat-first, signal-driven news system that helps users understand what’s actually going on, what changed, and why it matters — without drowning them in articles.

### The Problem (as I see it)

Most news apps optimize for publishing volume, not user understanding.

What users get:

* Repeated headlines saying the same thing
* Shallow summaries with no context
* No clear sense of whether anything *actually changed*

What users end up doing:

* Manually tracking stories in their head
* Skimming dozens of articles
* Still feeling unsure about the real state of things

### The Core Idea

syftly is not an article reader.

It treats news as **evolving situations**, not isolated posts.
The system continuously tracks how a story changes over time and surfaces only meaningful updates — grounded in real sources.

Think less “feed of headlines”, more “current understanding of the world”.

---

## 2. Who This Is For

### Primary Users

* Technically literate users
* People who care about *understanding*, not just staying updated

Examples:

* Founders tracking industries or regulation
* Students and researchers following complex topics
* Power users tired of noisy feeds

This is intentionally not built for casual scrolling.

---

## 3. Product Principles (Non-negotiables)

These guide every decision:

1. **Change > Events**
   If nothing meaningful changed, the app should stay quiet.

2. **Situations > Articles**
   Articles are evidence, not the core unit.

3. **Context by default**
   Every update should explain where things stood before.

4. **Show the sources**
   Trust comes from transparency, not confident tone.

5. **Cut noise aggressively**
   Reading less is a feature.

---

## 4. Core Primitives (Mental Model)

The system is built around these primitives, not UI features:

### 1. Situation

A real-world thing that unfolds over time.

Examples:

* “Venezuela election crisis”
* “AI regulation in India”
* “Company X facing investigation”

This replaces vague categories like “World” or “Politics”.

---

### 2. State

A snapshot of what we currently believe to be true about a situation.

This answers:

* “Where does this stand right now?”

---

### 3. Change

An update that meaningfully modifies the state.

Examples:

* Rumor → confirmation
* Proposal → approval
* Key actor entering or exiting

Most articles do *not* produce a change.

---

### 4. Evidence

Articles, statements, or documents that support or contradict a state or change.

Evidence is always accessible, but never the main UI surface.

---

### 5. Perspective

Different ways the same situation is framed across sources.

This enables comparison without pretending there’s a single “objective” narrative.

---

## 5. Core User Experiences

### 5.1 Chat-First News Exploration

Users can ask natural questions like:

* “What’s going on with Venezuela?”
* “What changed since last week?”
* “Is this actually serious?”

The system responds with:

* Current state
* Key changes over time
* Links to supporting articles

Chat is the entry point, not a side feature.

---

### 5.2 Situation Timelines

Each situation has a timeline made of **changes**, not articles.

Users can:

* See how the story evolved
* Jump to the evidence behind each change

This replaces endless scrolling with structured understanding.

---

### 5.3 Personalized Insight Feed

The feed is situation-based, not article-based.

It prioritizes:

* Situations the user cares about
* New meaningful changes

If nothing changed, nothing shows up.

---

### 5.4 Multi-Source Comparison

For any situation or change, users can:

* Compare how different sources describe it
* See framing differences and disagreements

This is about surfacing perspective, not labeling bias.

---

### 5.5 One-Shot News

Some news doesn’t evolve.

The system supports:

* Single-event situations
* Quick summaries with attached evidence

They don’t get forced into timelines.

---

## 6. System Architecture (Conceptual)

### Core Backend Components

* Ingestion Service (RSS / APIs / crawlers)
* Situation Detection & Clustering
* Change Detection Engine
* Evidence Store
* User Preference & Memory Store
* Feed & Chat Orchestrator

This is intentionally modular to keep reasoning isolated.

---

### AI Usage Philosophy

LLMs are used for:

* Reasoning over deltas
* Explaining changes and conflicts
* Natural language interaction

They are *not* used for:

* Blind summarization
* Tasks better handled by rules or heuristics

Cost and control matter.

---

## 7. State Management

### Persistent State

* Situation timelines
* Current state snapshots
* User interests and feedback

### Stateless / On-Demand

* Chat responses
* Feed rendering

---

## 8. Success Metrics (Early)

Not vanity metrics.

Signals I care about:

* Users reading fewer items but feeling more informed
* Explicit “useful / not useful” feedback
* Repeated use for the same situations

Technical sanity checks:

* LLM cost per meaningful update
* Latency for chat responses

---

## 9. MVP Scope

### Included

* Limited news sources
* Situation detection
* Change-based timelines
* Chat interface
* Basic personalization

### Explicitly Excluded (for now)

* Mobile apps
* Social features
* Monetization
* Push notifications

---

## 10. Why This Project Exists

This is not about building another AI demo.

It’s about:

* Rethinking broken defaults
* Designing better abstractions
* Building a system that values understanding over engagement

If it works, the app should feel quieter — and that’s the point.

---

## 11. Open Questions (Still Unresolved)

* How visible should uncertainty be?
* Should users see agent reasoning traces?
* How much control should users have over noise filtering?

These are design questions, not implementation details — and I’m intentionally leaving them open.
