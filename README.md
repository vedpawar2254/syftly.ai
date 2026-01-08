# syftly.ai

<details>
  <summary><b>Note I have documented the whole process in a blog type format in the "Documenting_the_whole_process" process</b></summary>

* I start with defining the goals at start of the day
* Then at the end I write all that i did and what i learned from it
* And finally a short summary of progress till now
</details>

# Product Requirements Document (PRD)

## 1. Product Overview

### Product Name

**syftly.ai**

### One‑line Description

An AI agent–first news aggregation platform that continuously monitors global information sources, reasons over changes, and delivers decision‑oriented insights personalized to each user.

### Problem Statement

Traditional news apps overwhelm users with repetitive headlines, shallow summaries, and low signal‑to‑noise ratios. Users must manually track changes, verify credibility, and infer relevance to their own goals.

### Solution

SignalDesk acts as an autonomous news intelligence agent. It ingests news continuously, reasons over how stories evolve over time, resolves conflicts across sources, and surfaces only what meaningfully changed — explained in the context of the user’s goals.

This is not a reader. It is a thinking layer on top of the news.

---

## 2. Target Users

### Primary User

* Technically literate users (recruiters, founders, advanced students)
* Interested in understanding *why* news matters, not just *what* happened

### User Personas

1. **Founder / Builder** – wants early signals and implications
2. **Student / Researcher** – wants structured understanding and source comparison
3. **Curious Power User** – wants fewer, smarter updates

---

## 3. Core Value Proposition

> “Tell me what actually changed, why it matters, and whether I should care.”

The system prioritizes:

* Change detection over repetition
* Reasoned insight over summarization
* Personal relevance over generic categories

---

## 5. Key Features

### 5.1 Autonomous News Ingestion

**Description**

* Periodic ingestion of news from multiple sources
* Sources include: RSS feeds, APIs, selected blogs, official statements

**Capabilities**

* Deduplication
* Source metadata tracking (publisher, credibility class, recency)

**Why it matters**
Demonstrates scalable backend ingestion and preprocessing without LLM overuse.

---

### 5.2 Change Detection Engine (Core Differentiator)

**Description**

* The agent tracks stories over time as evolving entities
* Detects meaningful changes rather than surface‑level rewrites

**Examples**

* Rumor → confirmation
* Policy proposal → approval
* Tone shift across media outlets

**Implementation Signals**

* Embeddings for story clustering
* Temporal diffing of summaries
* LLM reasoning over deltas, not raw articles

---

### 5.3 Multi‑Source Conflict Resolution

**Description**

* Compare how different sources report the same event
* Highlight disagreements, missing facts, and framing differences

**Output**

* Conflict summary
* Confidence score
* Explanation of divergence

**Why it matters**
Shows multi‑document reasoning and critical analysis, not passive aggregation.

---

### 5.4 Personalized Relevance Engine

**Description**

* Personalization based on goals, reading behavior, and feedback
* Moves beyond static categories

**Signals Used**

* Explicit preferences (topics, roles)
* Implicit behavior (clicks, dwell time)
* Feedback signals (“useful / not useful”)

**Agent Question**

> “Is this worth interrupting this user for?”

---

### 5.5 Ask‑the‑News Interface

**Description**

* Conversational interface grounded in current and past news state

**Example Queries**

* “What’s the real risk here?”
* “What changed since yesterday?”
* “Who benefits if this is true?”

**Technical Focus**

* Context assembly
* Multi‑document retrieval
* Conversation memory

---

### 5.6 Insight‑First Feed UI

**Description**

* Feed prioritizes insights, not headlines

**UI Elements**

* ‘What changed’ markers
* Confidence indicators
* Source disagreement flags
* ‘Why am I seeing this?’ explanations

**Frontend Signals**

* Streaming AI responses
* Real‑time state updates
* Clean information hierarchy

---

## 6. System Architecture (High Level)

### Backend Components

* Ingestion Service (cron + async jobs)
* Story Clustering & Embedding Store
* Agent Reasoning Worker
* User Memory Store
* Notification & Feed Generator

### AI Stack

* Embeddings for clustering and retrieval
* LLM for:

  * Delta reasoning
  * Conflict explanation
  * Personalized insight generation
* Rule‑based logic where possible to control cost

---

## 7. Data & State Management

### Persistent State

* Story evolution timelines
* User preference vectors
* Feedback signals

### Stateless Operations

* Feed rendering
* On‑demand Q&A

---

## 8. Metrics of Success

### Product Metrics

* Signal‑to‑noise ratio (user feedback)
* Stories read vs stories skipped
* Repeat usage

### Technical Metrics

* LLM cost per user
* Cache hit rate
* Latency for insight generation

---

## 9. MVP Scope

**Included**

* Limited set of sources
* Single user profile
* Core agent loop
* Insight‑first feed

**Excluded (for now)**

* Mobile apps
* Social features
* Monetization

---

## 10. Why This Project Is Strong

* Demonstrates real agent behavior, not wrappers
* Shows reasoning over time, not static outputs
* Highlights engineering judgment (where not to use AI)
* Clear differentiation from typical news apps

---

## 11. Open Questions

* How aggressive should notifications be?
* Should users see agent reasoning traces?
* How transparent should confidence scoring be?

