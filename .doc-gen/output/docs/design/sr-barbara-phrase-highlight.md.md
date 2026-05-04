# sr-barbara-phrase-highlight.md

**Path:** docs/design/sr-barbara-phrase-highlight.md
**Syntax:** markdown
**Generated:** 2026-05-03 16:07:45

```markdown
# Sr. Barbara's Class — Changeset: Phrase Highlight on Click
**Date:** 2026-04-30
**Affects:** `static/js/ui.js`, `static/css/style.css`
**Reason:** Clicking a single word (e.g. "the") and being asked "subject
or verb?" is confusing — the player has no visual cue that they're placing
an entire phrase, not just the word they clicked. This change highlights
all words in a phrase when any one of them is clicked, making the grouping
visible before the popup appears.

---

## File 1: `static/css/style.css`

### BEFORE

```css
/* Already correctly identified — soft green, no longer clickable */
.word-token.correct {
    background: #d4edda;
    border-bottom-color: #5a9e6f;
    cursor: default;
    color: #2c5f3a;
}
```

### AFTER

```css
/* Already correctly identified — soft green, no longer clickable */
.word-token.correct {
    background: #d4edda;
    border-bottom-color: #5a9e6f;
    cursor: default;
    color: #2c5f3a;
}

/* All words in the phrase being considered — warm highlight */
.word-token.phrase-highlight {
    background: #f0e0c0;
    border-bottom-color: #a07840;
}
```

### Why

A distinct warm amber highlight makes the phrase group visible the moment
the popup opens. It reads as "these words travel together." Clears
automatically when the popup closes.

---

## File 2: `static/js/ui.js`

### Change 1 — `showPopup`: highlight the whole phrase on open

#### BEFORE

```js
function showPopup(tokenEl, token) {
    popupWord.textContent = token.word;
    popupChoices.innerHTML = '';
```

#### AFTER

```js
function showPopup(tokenEl, token) {
    popupWord.textContent = token.word;
    popupChoices.innerHTML = '';

    // Highlight all words in this phrase so the player sees what moves together
    const role     = token.part_role;
    const position = token.part_position;
    document.querySelectorAll('.word-token').forEach(el => {
        if (el.dataset.partRole === role &&
            el.dataset.partPosition === String(position)) {
            el.classList.add('phrase-highlight');
        }
    });
```

### Why

`part_role` and `part_position` together form the phrase key — the same
two fields `phraseKey()` uses. Querying on both reliably selects exactly
the right set of spans without touching any state. `String(position)`
is needed because dataset values are always strings.

---

### Change 2 — `hidePopup`: clear the highlight on close

#### BEFORE

```js
function hidePopup() {
    posPopup.classList.add('hidden');
    popupChoices.innerHTML = '';
}
```

#### AFTER

```js
function hidePopup() {
    posPopup.classList.add('hidden');
    popupChoices.innerHTML = '';
    document.querySelectorAll('.word-token.phrase-highlight')
        .forEach(el => el.classList.remove('phrase-highlight'));
}
```

### Why

Cleanup runs on every close path: cancel button, correct answer, wrong
answer. All three call `hidePopup()`, so one removal here covers all cases.

---

## No rebuild required

Static file changes only. Save both files and hard refresh (Ctrl+Shift+R).

---

## What this does not change

- The popup content — still shows phrase-level role choices, unchanged.
- `popupWord` — still shows the word the player clicked. That's fine;
  it anchors the popup to something specific even though the whole
  phrase is highlighted.
- `markPhraseCorrect` — unchanged. The highlight clears via `hidePopup`
  before `markPhraseCorrect` runs, so there's no interaction between them.

```
