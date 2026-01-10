
# DAY 2
`last updated: 3 pm 9 Jan`

- [~] complete Architecture
- [~] create the design guide
- [ ] Setup CI/CD, axios setup, folder structures, etc. - setup everything required before coding ( coudnt do it)



# Day 2 — Architecture

The goal was to make sure the system is *correct* before it’s *implemented*.

---

## The Core Job

The system has one continuous responsibility:

> Maintain a structured understanding of a scoped world, and update that understanding only when new evidence meaningfully changes the state.

Everything else flows from this.

---

## The Big Realization

The hard part of this product is **state**, not UI or LLM prompts.

If I try to store “everything the system ever believed,” the architecture collapses.
So I made a key decision:

> The system only needs to store the *current belief* and the *reasons it changed*.

This immediately:

* Reduced database pressure
* Clarified boundaries
* Made the system explainable without being bloated

---

## Breaking the System Down

I decomposed the job into **responsibilities**:

Responsibility A — World Observation

What it does

Collects new information from external sources

What it does NOT do

Interpretation

Classification

Reasoning

This keeps ingestion dumb and replaceable.

Responsibility B — World Scoping & Resolution

What it does

Decides whether new information belongs in our “world”

Resolves it to:

Existing situation

New evolving situation

One-shot situation

Or discard

This is the gatekeeper.

Responsibility C — Change Evaluation (Critical)

What it does

Compares new evidence against current state

Decides whether a meaningful change occurred

This is where most intelligence lives.

If this is wrong, the whole product fails.

Responsibility D — World State Management

What it does

Stores:

Situations

States

Changes

Evidence links

This is about truth persistence, not UI needs.

Responsibility E — User-Oriented Projection

What it does

Turns world state into:

Feeds

Chat responses

Timelines

Applies personalization and relevance

This is interpretation for humans, not world reasoning.

The most important insight:

> Change evaluation is the core intelligence. Everything else exists to support or protect it.

---

## Architecture Philosophy

A few rules I committed to today:

* Reasoning and truth storage must be separate
* User-facing components must never write world state
* Most incoming news should result in *no change* (keep the ingestion component conservative)
* LLMs propose changes

This keeps the system controllable and debuggable.

---

## Why Day 2 Mattered

* A clean mental model of the system
* Clear responsibility boundaries
* A belief-centric architecture that scales by **meaningful change**, not article volume
