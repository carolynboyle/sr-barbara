# sr-barbara-css-js-pos-update.md

**Path:** docs/changedocs/sr-barbara-css-js-pos-update.md
**Syntax:** markdown
**Generated:** 2026-05-03 16:07:45

```markdown
# Sr. Barbara's Class — Changeset: CSS + JS POS Update
**Date:** 2026-04-30
**Affects:** `static/css/style.css`, `static/js/game.js`
**Reason:** Sync frontend with the schema changes already applied to the
database: `article` → `determiner`, add `pronoun`.

---

## File 1: `static/css/style.css`

### BEFORE

```css
/* Part of speech colors on diagram */
#diagram-area svg text.pos-article     { fill: #d4a574; }
#diagram-area svg text.pos-noun        { fill: #e8d5a3; }
#diagram-area svg text.pos-verb        { fill: #e8a5a5; }
#diagram-area svg text.pos-adjective   { fill: #a5c4a5; }
#diagram-area svg text.pos-adverb      { fill: #a5b8c4; }
#diagram-area svg text.pos-preposition { fill: #c4a5c4; }
```

### AFTER

```css
/* Part of speech colors on diagram */
#diagram-area svg text.pos-determiner  { fill: #d4a574; }
#diagram-area svg text.pos-noun        { fill: #c9a96e; }
#diagram-area svg text.pos-pronoun     { fill: #e8d5a3; }
#diagram-area svg text.pos-verb        { fill: #e8a5a5; }
#diagram-area svg text.pos-adjective   { fill: #a5c4a5; }
#diagram-area svg text.pos-adverb      { fill: #a5b8c4; }
#diagram-area svg text.pos-preposition { fill: #c4a5c4; }
```

### Why

- `.pos-article` renamed to `.pos-determiner` to match the updated POS
  name in the database.
- `.pos-noun` darkened from `#e8d5a3` to `#c9a96e` — a medium warm tan
  with more brown, giving nouns heavier visual weight.
- `.pos-pronoun` added at `#e8d5a3` (the former noun cream) — pronouns
  sit at the lighter end of the noun/pronoun family, visually related
  but distinct.

---

## File 2: `static/js/game.js`

### BEFORE

```js
    // Part of speech colors - muted, chalkboard-friendly
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
    // Part of speech colors - muted, chalkboard-friendly
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
pronoun token is placed on the diagram. These two objects will move
to `config.js` during the module split — apply the correction here
first so the monolith is consistent before splitting.

---

## No rebuild required

These are static file changes only. Docker does not need to be
restarted — just save the files and reload the browser.

If you want to be safe, a hard refresh (Ctrl+Shift+R) will ensure
the browser isn't serving cached CSS or JS.

```
