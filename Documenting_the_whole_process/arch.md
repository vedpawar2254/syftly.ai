# syftly.ai — System Blueprint

---

## 1. What We Are Building

**syftly.ai** is not a news reader.

It is a system that:

> Maintains a structured understanding of a scoped world and updates that understanding **only when new evidence meaningfully changes the state**.

Everything else (chat, feed, timelines, UI) is a projection of that understanding.

---

## 2. Core Mental Model

### News ≠ Articles

Articles are **evidence**, not truth.

### Truth ≠ History

We only store:

* Current belief
* Why it changed

Not every step, not every rewrite.

### Most News Does Nothing

Most incoming evidence **does not change state**.
This is a feature, not a bug.

---

## 3. Canonical Data Flow

```
Observation
  ↓
Evidence (immutable)
  ↓
Interpretation (LLM + rules)
  ↓
Change (append-only, rare)
  ↓
Situation (current belief)
  ↓
Projection (feed / chat / UI)
```

Only **Change → Situation** mutates long-term meaning.

---

## 4. Core Data Primitives

These are conceptual schemas. You can implement them in SQL, NoSQL, or files.

---

### 4.1 Evidence (Append-only, rebuildable foundation)

```json
{
  "evidence_id": "uuid",

  "source": {
    "type": "news | blog | gov | social",
    "publisher": "Reuters",
    "url": "string"
  },

  "observed_at": "timestamp",
  "ingested_at": "timestamp",

  "raw_content": {
    "title": "string",
    "body": "string"
  },

  "metadata": {
    "language": "en",
    "region": "global"
  }
}
```

Rules:

* Immutable
* Never edited
* No summaries, no embeddings here

---

### 4.2 Entity

```json
{
  "entity_id": "uuid",
  "type": "person | org | country | company",
  "name": "Venezuela",
  "aliases": ["Bolivarian Republic of Venezuela"]
}
```

Rules:

* No opinions
* Used only for linking

---

### 4.3 Situation

```json
{
  "situation_id": "uuid",
  "type": "evolving | one_shot",

  "scope": {
    "canonical_query": "Venezuela political situation",
    "entities": ["entity_id_1", "entity_id_2"]
  },

  "state": {
    "summary": "Current belief in ≤3 sentences",
    "status": "ongoing | resolved | uncertain",
    "confidence": 0.78
  },

  "key_facts": [
    {
      "fact_id": "uuid",
      "claim": "Government declared a state of emergency",
      "confidence": 0.9,
      "entity_refs": ["entity_id_1"]
    }
  ],

  "created_at": "timestamp",
  "last_updated_at": "timestamp"
}
```

Rules:

* Mutable, but only via Change
* No history
* No raw evidence

---

### 4.4 Change

```json
{
  "change_id": "uuid",
  "situation_id": "uuid",

  "triggering_evidence": ["evidence_id_3", "evidence_id_9"],

  "change_type": "new_fact | confirmation | contradiction | resolution",

  "before": {
    "summary": "Previous belief"
  },

  "after": {
    "summary": "Updated belief"
  },

  "reasoning": "Why this evidence caused a belief update",

  "proposed_at": "timestamp",
  "accepted_at": "timestamp"
}
```

Rules:

* Append-only
* Never deleted
* LLMs may propose, system decides

---

### 4.5 Projection

Feed items, chat responses, timelines, graphs.

Rules:

* Derived at read time
* Can be cached
* Safe to delete

---

## 5. LLM Usage Rules

* LLMs **propose**, never commit
* LLM output must reference evidence IDs
* World state must be writable without LLMs
* Bad LLM output must be survivable

LLMs belong in:

* Interpretation
* Change proposal
* Projection

LLMs must not write:

* Evidence
* Situation directly

---

## 6. Async Jobs

Minimum viable set:

1. **Ingest Evidence**

   * Poll sources
   * Store Evidence

2. **Situation Matching**

   * Does evidence map to existing situation?
   * If not, create one_shot or evolving situation

3. **Change Evaluation**

   * Compare new evidence vs current belief
   * Usually no-op
   * Sometimes propose Change

4. **Situation Update**

   * Apply accepted Change


## 7. What to Code First

1. Evidence ingestion + storage
2. Situation creation (manual or rule-based)
3. Change object creation (even fake/manual)
4. Read-only feed from Situation + Change


## 8. Non-Goals

* Perfect summarization
* Scaling
* Mobile apps
* Monetization

---

