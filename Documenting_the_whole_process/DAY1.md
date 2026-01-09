`last updated: 11 pm 8 jan`
- Goals for today
    - [x] setup project (Frontend, backend, ai-layers)
    - [x] Work on the defining the FRs and the NFRs also the market positionxing
    - [x] also work on the architecture and finalize it

# BLOG:

This was day 1 of building syftly.ai

## The Question I Cared About

When I read news, I’m not asking:

> “What was published today?”

I’m asking:

* “What’s going on with *this thing*?”
* “Did anything actually change?”
* “Do I need to care right now?”


## Cutting Through the Noise (The Core Idea)

Here’s the idea that clicked for me:

> **News shouldn’t be consumed as articles. It should be consumed as evolving understanding.**

Most news apps fail because they surface *events*, not *changes in understanding*.

10 articles can add zero new information.
1 article can completely change the situation.

So the real enemy isn’t volume - it’s repetition without meaning.

## Throwing Away Bad Abstractions

I decided to question everything that’s taken for granted in news apps:

***I wanted to rethink how news is serverd, like notion did with notes***

* Categories like “World / Politics” → useless
* Chronological feeds → noisy
* Headlines as the entry point → misleading

These are publisher-first abstractions.
I want user-first ones.

So instead of starting with features, I started with **primitives**.


## The Primitives I’m Building Around

After a lot of back-and-forth, I landed on five core primitives.

### 1. Situation

A real-world thing people care about over time.

Examples:

* Venezuela election crisis
* A company facing regulation
* A war, strike, investigation

---

### 2. State

What we currently believe to be true about a situation.

a belief snapshot.

This lets the system answer:

* "Where does this stand right now?"

---

### 3. Change

The most important one.

A change is **anything that meaningfully updates the state**.

Not every article qualifies.

Examples:

* Rumor → confirmation
* Proposal → approval

***This is how I plan to kill noise.***

---

### 4. Evidence

Articles finally show up here, the purpose is as proof

Evidence supports or contradicts states and changes.
You should always be able to see it, but it shouldn’t dominate the UI.

---

### 5. Perspective

Different ways the same situation is framed.

This enables comparison between sources.

---

## What This Immediately Enables

Once these primitives exist, a lot of things fall out naturally:

* Chat like: "what's going on with X?" → resolves to a situation
* Timelines → ordered changes, not articles
* Personalized feeds → situations ranked by meaningful updates
* Comparisons → perspectives over the same evidence
* One-shot news → situations that resolve immediately

None of this requires forcing features. It's just composition.


## Why I'm Excited About This Direction

This doesn’t feel like another AI wrapper.
It feels like questioning a broken default and rebuilding from scratch.

If this works:

* The app should feel quieter
* Users should read less
* Understanding should increase

That's what I'm aiming for.

# I will also retink the ways that news is showed to the consumer, instead of just text. I think we can do something better

## Ending Note:
### News should help us understand the world better
