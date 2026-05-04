# sr-barbara-article-to-determiner.md

**Path:** docs/changedocs/sr-barbara-article-to-determiner.md
**Syntax:** markdown
**Generated:** 2026-05-03 21:07:46

```markdown
# Sr. Barbara's Class — Changeset: `article` → `determiner` + `pronoun`

**Date:** 2026-04-28
**Affects:** `db/schema.sql`, `db/seed.sql`, `static/css/style.css`, `static/js/game.js`
**Rebuild required:** Yes — wipe and rebuild the Docker volume after applying `schema.sql` and `seed.sql`.

---

## Summary

- Rename `article` → `determiner` throughout the schema, seed data, CSS, and JS.
- Add `pronoun` as a new part of speech in the schema and seed data.
- Correct two token-level POS errors in seed data:
  - Sentence 13: `'She'` was `noun`, now `pronoun`
  - Sentence 14: `'their'` was `adjective`, now `determiner`
- Update noun/pronoun colors so they read as a related pair:
  noun gets darker/browner, pronoun takes the former noun cream.

---

## File 1: `db/schema.sql`

### BEFORE

```sql
INSERT INTO parts_of_speech (name, description) VALUES
    ('subject', 'Who or what the sentence is about'),
    ('verb', 'The action or state of being'),
    ('noun', 'Person, place, thing, or idea'),
    ('direct_object', 'Receives the action of the verb'),
    ('adjective', 'Modifies a noun or pronoun'),
    ('adverb', 'Modifies a verb, adjective, or other adverb'),
    ('article', 'Definite or indefinite determiner'),
    ('preposition', 'Shows relationship between noun and rest of sentence'),
    ('prepositional_phrase', 'Preposition plus its object'),
    ('object_of_preposition', 'Noun or pronoun following a preposition');
```

### AFTER

```sql
INSERT INTO parts_of_speech (name, description) VALUES
    ('subject', 'Who or what the sentence is about'),
    ('verb', 'The action or state of being'),
    ('noun', 'Person, place, thing, or idea'),
    ('pronoun', 'Replaces a noun: she, he, they, it, him, her'),
    ('direct_object', 'Receives the action of the verb'),
    ('adjective', 'Modifies a noun or pronoun'),
    ('adverb', 'Modifies a verb, adjective, or other adverb'),
    ('determiner', 'Specifies a noun: articles, possessives, demonstratives'),
    ('preposition', 'Shows relationship between noun and rest of sentence'),
    ('prepositional_phrase', 'Preposition plus its object'),
    ('object_of_preposition', 'Noun or pronoun following a preposition');
```

### Why

`article` only covers "a", "an", "the". `determiner` is the correct
grammatical category and covers all words that specify nouns: articles,
possessives ("their", "my"), and demonstratives ("this", "that").
`pronoun` is added as a distinct part of speech — "she", "he", "they"
are not nouns and should not be labelled as such.

---

## File 2: `db/seed.sql`

### Change 1 — Global rename: `'article'` → `'determiner'`

Every occurrence of:
```sql
(SELECT id FROM parts_of_speech WHERE name = 'article')
```
becomes:
```sql
(SELECT id FROM parts_of_speech WHERE name = 'determiner')
```

This affects approximately 30 token INSERT statements across sentences:
2, 3, 4, 5, 6, 8, 10, 11, 13, 14, 16, 17, 18, 19, 20, 21, 22, 24.

Also update the comment on line 6:

**BEFORE**
```sql
-- Tokens now use WORD-LEVEL parts of speech (article, noun, adjective, verb, adverb, preposition)
```

**AFTER**
```sql
-- Tokens now use WORD-LEVEL parts of speech (determiner, pronoun, noun, adjective, verb, adverb, preposition)
```

---

### Change 2 — Sentence 13: `'She'` from `noun` to `pronoun`

**BEFORE**
```sql
-- SENTENCE 13 (hard): "She walked slowly through the quiet park."
...
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (31, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'She',     1),
```

**AFTER**
```sql
-- SENTENCE 13 (hard): "She walked slowly through the quiet park."
...
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (31, (SELECT id FROM parts_of_speech WHERE name = 'pronoun'),              'She',     1),
```

### Why

"She" is a subject pronoun. Storing it as `noun` causes the game to
label it incorrectly when giving feedback.

---

### Change 3 — Sentence 14: `'their'` from `adjective` to `determiner`

**BEFORE**
```sql
-- SENTENCE 14 (hard): "The students finished their work before noon."
...
    (36, (SELECT id FROM parts_of_speech WHERE name = 'adjective'),            'their',    1),
```

**AFTER**
```sql
-- SENTENCE 14 (hard): "The students finished their work before noon."
...
    (36, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),           'their',    1),
```

### Why

"Their" is a possessive determiner, not an adjective. It specifies the
noun "work" rather than describing a quality of it.

---

## File 3: `static/css/style.css`

### BEFORE

```css
#diagram-area svg text.pos-article     { fill: #d4a574; }
#diagram-area svg text.pos-noun        { fill: #e8d5a3; }
#diagram-area svg text.pos-verb        { fill: #e8a5a5; }
#diagram-area svg text.pos-adjective   { fill: #a5c4a5; }
#diagram-area svg text.pos-adverb      { fill: #a5b8c4; }
#diagram-area svg text.pos-preposition { fill: #c4a5c4; }
```

### AFTER

```css
#diagram-area svg text.pos-determiner  { fill: #d4a574; }
#diagram-area svg text.pos-noun        { fill: #c9a96e; }
#diagram-area svg text.pos-pronoun     { fill: #e8d5a3; }
#diagram-area svg text.pos-verb        { fill: #e8a5a5; }
#diagram-area svg text.pos-adjective   { fill: #a5c4a5; }
#diagram-area svg text.pos-adverb      { fill: #a5b8c4; }
#diagram-area svg text.pos-preposition { fill: #c4a5c4; }
```

### Why

- `.pos-article` renamed to `.pos-determiner` to match the updated POS name.
  Color `#d4a574` (warm tan) is unchanged — determiners keep their existing
  visual identity.
- `.pos-noun` darkened from `#e8d5a3` to `#c9a96e` — a medium warm tan with
  more brown, heavier visual weight appropriate for nouns.
- `.pos-pronoun` added at `#e8d5a3` (the former noun cream) — pronouns sit at
  the lighter end of the noun/pronoun family, visually related but distinct.

---

## File 4: `static/js/game.js`

### BEFORE

```js
const POS_COLORS = {
    'article':     '#d4a574',
    'noun':        '#e8d5a3',
    'verb':        '#e8a5a5',
    'adjective':   '#a5c4a5',
    'adverb':      '#a5b8c4',
    'preposition': '#c4a5c4'
};

const POS_LABELS = {
    'article':     'Article',
    'noun':        'Noun',
    'verb':        'Verb',
    'adjective':   'Adjective',
    'adverb':      'Adverb',
    'preposition': 'Preposition'
};
```

### AFTER

```js
const POS_COLORS = {
    'determiner':  '#d4a574',
    'noun':        '#c9a96e',
    'pronoun':     '#e8d5a3',
    'verb':        '#e8a5a5',
    'adjective':   '#a5c4a5',
    'adverb':      '#a5b8c4',
    'preposition': '#c4a5c4'
};

const POS_LABELS = {
    'determiner':  'Determiner',
    'noun':        'Noun',
    'pronoun':     'Pronoun',
    'verb':        'Verb',
    'adjective':   'Adjective',
    'adverb':      'Adverb',
    'preposition': 'Preposition'
};
```

### Why

Keeps JS in sync with the updated POS names in the database and CSS.
`pronoun` added so the legend and feedback display correctly when a
pronoun token is placed on the diagram. These move to `config.js`
during the module split — apply the correction here first so the
monolith is consistent before splitting.

---

## Rebuild instructions

After applying all four files:

```bash
docker compose down -v
docker compose up --build
```

The `-v` flag destroys the Postgres volume. The fresh container will
initialize from the updated `schema.sql` and `seed.sql`.

Verify in Adminer (or psql) after rebuild:
```sql
SELECT name FROM parts_of_speech ORDER BY name;
```
Expected: `adjective`, `adverb`, `determiner`, `direct_object`,
`noun`, `object_of_preposition`, `preposition`, `prepositional_phrase`,
`pronoun`, `subject`, `verb`.

```sql
SELECT token, p.name AS pos
FROM sentence_tokens st
JOIN parts_of_speech p ON st.part_of_speech_id = p.id
WHERE token IN ('She', 'their', 'The', 'the', 'A', 'a');
```
All `The`/`the`/`A` tokens should show `determiner`.
`She` should show `pronoun`. `their` should show `determiner`.

```
