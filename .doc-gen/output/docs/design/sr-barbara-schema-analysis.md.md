# sr-barbara-schema-analysis.md

**Path:** docs/design/sr-barbara-schema-analysis.md
**Syntax:** markdown
**Generated:** 2026-05-03 16:07:45

```markdown
# Sr. Barbara's Class — Schema & Diagramming Analysis

**Date:** 2026-04-27  
**Purpose:** Establish a clear picture of the current database structure,
what Reed-Kellogg diagramming rules are supported, what is missing, and
what schema changes are needed before any new sentences or rendering logic
can be added.

---

## 1. Current Database Structure

### Tables

#### `difficulty_levels`
Lookup table. Three rows: `easy`, `medium`, `hard`. No changes anticipated.

#### `parts_of_speech`
Lookup table used by both `sentence_parts` (phrase-level roles) and
`sentence_tokens` (word-level parts of speech). Currently seeded with:

| name | used at | notes |
|------|---------|-------|
| `subject` | part level | baseline role |
| `verb` | part level | baseline role |
| `direct_object` | part level | baseline role |
| `prepositional_phrase` | part level | structural node |
| `noun` | token level | |
| `adjective` | token level | |
| `adverb` | token level | |
| `article` | token level | |
| `preposition` | token level | |
| `object_of_preposition` | token level | |

**Design note:** This table mixes phrase-level *roles* (subject, verb,
direct_object) with word-level *parts of speech* (noun, adjective, etc.).
That dual use is intentional and working — the `part_of_speech_id` column
exists on both `sentence_parts` and `sentence_tokens`, and the two levels
use different subsets of the same lookup table.

#### `sentences`
Parent record. Holds `difficulty_id` and `created_at`. The full sentence
text is reconstructed by joining parts and tokens in position order.
No changes anticipated.

#### `sentence_parts`
Major grammatical divisions of a sentence. Each row represents a phrase-level
role (subject phrase, verb phrase, prepositional phrase, etc.).

| column | type | notes |
|--------|------|-------|
| `id` | SERIAL PK | |
| `sentence_id` | INT FK → sentences | |
| `part_of_speech_id` | INT FK → parts_of_speech | phrase role |
| `position` | INT | order within the sentence |

**Current limitation:** No column records *what a part modifies*. All parts
are implicitly treated as hanging from the main baseline, which is incorrect
for chained prepositional phrases and for any future modifier roles.

#### `sentence_tokens`
Individual placeable words within a sentence part. This is what the player
drags onto the diagram.

| column | type | notes |
|--------|------|-------|
| `id` | SERIAL PK | |
| `sentence_part_id` | INT FK → sentence_parts | |
| `part_of_speech_id` | INT FK → parts_of_speech | word-level POS |
| `token` | VARCHAR(100) | the word text |
| `position` | INT | order within its part |

### Current view: `v_sentences`
Joins all five tables to produce a flat row per token, with the full sentence
text reconstructed via `string_agg`. Useful for inspection. Will need to be
updated or supplemented when `modifies_part_id` is added.

---

## 2. Current Sentence Library

24 sentences across three difficulty levels. Grammatical structures present:

| structure | count | example |
|-----------|-------|---------|
| Subject + Verb | 6 | "Birds fly." |
| Subject + Verb + Direct Object | 7 | "The young baker made bread." |
| Subject + Verb + Prep Phrase (×1) | 8 | "Rain fell on the roof." |
| Subject + Verb + Direct Object + Prep Phrase | 3 | "The teacher carried the books to the classroom." |
| Subject + Verb + Prep Phrase (×2, chained) | 1 | "The mysterious box sat quietly in the corner of the attic." |

**The one chained prep phrase sentence (sentence 6)** is the known problem
case. "In the corner *of the attic*" — "of the attic" modifies "corner",
not the baseline verb. It is currently stored as two sibling
`prepositional_phrase` parts at position 3 and 4, both hanging off the
baseline. The data model cannot express the correct relationship.

---

## 3. Reed-Kellogg Diagramming Rules — What We Support vs. What We Don't

### Baseline (The Spine)

The main horizontal line carries the core sentence elements separated by
vertical lines:

```
Subject | Verb | Direct Object
```

A line slanting *back toward the subject* separates verb from predicate
nominative or predicate adjective (linking verb constructions).

**Status:** Subject, Verb, and Direct Object are fully supported in both
the schema and the renderer.

### Modifiers Hanging Below the Baseline

Adjectives, adverbs, and articles hang on diagonal lines below the word
they modify.

**Status:** Supported at the token level. Adjectives and adverbs are stored
as tokens within their parent part (e.g., adjectives are tokens within the
subject part, adverbs within the verb part). The renderer handles this.

### Prepositional Phrases

A prepositional phrase hangs below whatever it modifies:

- A phrase modifying the **verb** hangs below the verb section.
- A phrase modifying the **direct object** hangs below the object section.
- A phrase modifying **another prepositional phrase** (chained, e.g.
  "of the attic" in "in the corner of the attic") hangs below the object
  word of the parent phrase — *not* off the baseline.

The visual structure is: diagonal line (preposition) → horizontal line
(object of preposition), hanging from the word being modified.

**Status: Partially supported.** Single prepositional phrases hang from the
baseline correctly. Multiple phrases are spread horizontally along the
baseline (the fix documented in `game-js-pp-fix.md`), which is a pragmatic
approximation. Chained phrases that modify each other cannot be represented
correctly because `sentence_parts` has no `modifies_part_id` column.

### Not Yet Supported

The following Reed-Kellogg constructions exist in the rules but have no
schema or rendering support:

| construction | diagramming rule | schema gap | rendering gap |
|---|---|---|---|
| **Predicate nominative** | Noun after linking verb; slanted line points back toward subject | No `part_of_speech` row for it | No renderer |
| **Predicate adjective** | Adjective after linking verb; shares slanted line | No `part_of_speech` row | No renderer |
| **Indirect object** | Suspended on a horizontal line below the verb | No `part_of_speech` row | No renderer |
| **Chained prep phrases** | Child phrase hangs below parent phrase's object | No `modifies_part_id` column | Renderer doesn't walk a tree |
| **Conjunction** | Dotted vertical line connecting parallel structures | No `part_of_speech` row | No renderer |
| **Interjection** | Floats on a separate line above the baseline, unconnected | No `part_of_speech` row | No renderer |
| **Participle** | "Stepped" curved line dropping from the noun modified | No `part_of_speech` row | No renderer |

---

## 4. Schema Changes Needed

### Priority 1 — Unlock the Tree (Required for Chained Prep Phrases)

Add one column to `sentence_parts`:

```sql
ALTER TABLE sentence_parts
ADD COLUMN modifies_part_id INTEGER REFERENCES sentence_parts(id);
```

- `NULL` = hangs from the main baseline (all existing data defaults correctly).
- A value = hangs from the referenced part (used for chained prep phrases,
  and eventually for indirect objects, participles, etc.).

**Impact:** The existing view `v_sentences` does not expose this column.
A new query or updated view will be needed to walk the tree recursively
(via a Postgres recursive CTE) for the renderer to consume.

**Seed data change required:** Sentence 6 ("The mysterious box sat quietly
in the corner of the attic") must be updated so that `sentence_part` 17
("of the attic") has `modifies_part_id = 16` ("in the corner") rather than
being a sibling baseline part.

### Priority 2 — Canonical Token-Level POS List

The following is the canonical target vocabulary for token-level parts of
speech (i.e. the rows in `parts_of_speech` used by `sentence_tokens`).
This list is complete enough to carry the game a long way without
over-engineering:

| name | status | notes |
|------|--------|-------|
| `noun` | exists | keep |
| `pronoun` | **missing** | currently stored as `noun` — needs new row + data cleanup |
| `verb` | exists | keep |
| `adjective` | exists | keep |
| `adverb` | exists | keep |
| `determiner` | **rename** | rename from `article`; covers "a/an/the" plus "this/that/my/their/every" |
| `preposition` | exists | keep |
| `conjunction` | **missing** | needed for compound subjects/verbs; renderer not yet ready |
| `interjection` | **missing** | needed for exclamatory sentences; renderer not yet ready |

**Immediate changes required:**

- Add `pronoun` row to `parts_of_speech`
- Rename `article` → `determiner` in `parts_of_speech`
- Update token records currently using `noun` as a pronoun workaround
- Update token records using `article` to `determiner`
- Fix "their" in sentence 14 (currently stored as `adjective`; should be `determiner`)

`conjunction` and `interjection` rows can be added now to complete the
vocabulary, but they will have no effect until renderer support is added.

**Phrase-level POS additions** (used by `sentence_parts`, not `sentence_tokens`):

| name | needed for |
|------|------------|
| `predicate_nominative` | linking verb sentences ("She is a teacher.") |
| `predicate_adjective` | linking verb sentences ("The sky looks dark.") |
| `indirect_object` | give/send/show sentences ("She gave him the book.") |
| `participle` | participial phrase sentences |

These are additive. No existing part-level data changes required.

### Priority 3 — `connection_type` (Rendering Metadata, Optional)

Gemini suggested a `connection_type` column on `sentence_parts` to encode
the visual connector style (vertical line, slanted line, suspended line,
dotted line). This is a clean idea — it moves rendering decisions out of
the JavaScript and into the data.

```sql
ALTER TABLE sentence_parts
ADD COLUMN connection_type VARCHAR(20);
-- Suggested values: 'vertical', 'slanted_back', 'suspended', 'dashed', 'floating'
```

This is not required for the tree fix but would be useful when adding
predicate nominatives, indirect objects, and conjunctions, all of which use
different connector styles than the standard baseline separator.

---

## 5. Rendering Changes Needed (game.js)

The JavaScript renderer in `static/js/game.js` will need to:

1. **Consume `modifies_part_id`** from the API response and build a tree
   structure in memory before rendering, rather than treating all parts as
   a flat list.

2. **Calculate anchor points recursively.** A part's anchor point depends
   on its parent's rendered position (specifically, the position of the
   parent part's object word). This requires the tree to be walked in
   top-down order.

3. **New rendering cases** for each new construction added to the schema
   (predicate nominative slant-back line, suspended indirect object line,
   etc.).

The current horizontal-spread fix in `game.js` (`anchorX = divX + 60 + (ppSlot * 140)`)
is a placeholder. It can remain until the tree rendering is implemented,
but it should be removed when `modifies_part_id` is in place.

---

## 6. Recommended Implementation Order

1. Add `modifies_part_id` to `sentence_parts` (schema migration).
2. Update `seed.sql` to set `modifies_part_id` on sentence 6's chained phrase.
3. Update the API (`app.py`) to expose `modifies_part_id` in the JSON
   response.
4. Update `game.js` to build a tree from the part list and render
   prepositional phrases from their correct anchor points.
5. Add new `parts_of_speech` rows and new sentences as each new construction
   is tackled.
6. Add `connection_type` when it becomes useful for rendering new constructions.

---

## 7. Decisions on Schema Evolution

### On extending `parts_of_speech` via lookup tables rather than column additions

If `parts_of_speech` ever needs metadata that only applies to a subset of
its rows (e.g. rendering properties that apply to phrase roles but not
token-level POS), the correct approach is an extension lookup table keyed
to `parts_of_speech.id` — not adding nullable columns to the base table.

This keeps the base table stable, existing foreign keys untouched, and
the change purely additive. A full split of `parts_of_speech` into two
separate tables would be a structural migration affecting `sentence_parts`,
`sentence_tokens`, and every query that joins to them. That cost is only
justified if the two subsets genuinely diverge in ways a lookup table
can't handle.

**Decision:** Extend via lookup tables if needed. Split only if forced.

### On pronouns

Pronouns are currently stored with `part_of_speech = noun`, which is
incorrect. "She", "he", "they", "it", "him", "her" are pronouns, not
nouns, and the distinction matters when the game gives feedback about
what kind of word something is.

Adding `pronoun` to `parts_of_speech` is a one-row INSERT. The cost is
updating existing token records that currently use `noun` as a workaround.
This should be done before the sentence library is expanded significantly,
since pronouns appear in nearly every natural sentence.

### On subordinate clauses and the schema ceiling

Subordinate clauses ("when she arrived", "because the door was open",
"the man who lives next door") are common in natural speech and visually
distinctive in Reed-Kellogg diagrams — a clause renders as a second
baseline on a stepped bridge connecting to the main baseline.

A subordinate clause has its own subject and verb. The current
`sentence_parts` model is flat: every part belongs to one sentence and
hangs (implicitly) from one baseline. There is no way to express a
part that belongs to a nested clause with its own baseline.

**Subordinate clause support is the anticipated trigger for a structural
schema change.** When that feature is prioritized, the schema will likely
need to separate token-level parts of speech from structural diagram
roles, and introduce a proper tree model where sentence parts can nest.
This is a meaningful refactor — it should be designed before implementation
begins, with the current incremental additions (`modifies_part_id`,
`pronoun`, new POS rows) treated as the stable foundation to build from.

---

## 8. What Does Not Need to Change

- The `sentences` table — no structural changes needed.
- The `difficulty_levels` table — no changes needed.
- The `sentence_tokens` table — no structural changes needed for the tree fix.
  Token-level structure is correct.
- The dual-use design of `parts_of_speech` — intentional, working, keep it.
- All existing sentence data except sentence 6's `modifies_part_id` value.

```
