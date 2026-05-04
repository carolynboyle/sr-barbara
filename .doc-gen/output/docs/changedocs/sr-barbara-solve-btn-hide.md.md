# sr-barbara-solve-btn-hide.md

**Path:** docs/changedocs/sr-barbara-solve-btn-hide.md
**Syntax:** markdown
**Generated:** 2026-05-03 21:07:47

```markdown
# Sr. Barbara's Class — Changeset: Hide Solve Button on Completion
**Date:** 2026-04-30
**Affects:** `static/js/game.js`
**Reason:** The "Show Solution" button remains visible after the diagram
is complete, whether the player solved it themselves or clicked the button.
It should disappear when there is nothing left to solve, and reappear
when a new sentence loads.

---

## Change 1: Add helper function to check completion

Add this function after `initDiagram()`:

### BEFORE

```js
    // -------------------------------------------------------------------------
    // Draw tokens individually with their part-of-speech colors
    // -------------------------------------------------------------------------
    function drawTokensInSection(tokens, startX, endX, y) {
```

### AFTER

```js
    // -------------------------------------------------------------------------
    // Hide solve button when all phrases are drawn
    // -------------------------------------------------------------------------
    function checkCompletion() {
        const allKeys = [...new Map(
            currentSentence.tokens.map(t => [phraseKey(t), t])
        ).keys()];
        if (allKeys.every(key => drawnRoles.has(key))) {
            solveBtn.classList.add('hidden');
        }
    }

    // -------------------------------------------------------------------------
    // Draw tokens individually with their part-of-speech colors
    // -------------------------------------------------------------------------
    function drawTokensInSection(tokens, startX, endX, y) {
```

---

## Change 2: Show button again on new sentence

`initDiagram()` resets the diagram state — add one line to restore the
button there.

### BEFORE

```js
    function initDiagram() {
        diagramArea.innerHTML = '';
        drawnRoles.clear();
        ppSlot = 0;
        legend.innerHTML = '';
        legendSeen.clear();
```

### AFTER

```js
    function initDiagram() {
        diagramArea.innerHTML = '';
        drawnRoles.clear();
        ppSlot = 0;
        legend.innerHTML = '';
        legendSeen.clear();
        solveBtn.classList.remove('hidden');
```

---

## Change 3: Call checkCompletion after a correct answer

At the end of `handleChoice`, after a correct placement:

### BEFORE

```js
        if (chosen_role === token.part_role) {
            const key = phraseKey(token);
            markPhraseCorrect(key);
            drawPhrase(key);
            showFeedback(randomFrom(PRAISE), 'correct-feedback');
        } else {
```

### AFTER

```js
        if (chosen_role === token.part_role) {
            const key = phraseKey(token);
            markPhraseCorrect(key);
            drawPhrase(key);
            showFeedback(randomFrom(PRAISE), 'correct-feedback');
            checkCompletion();
        } else {
```

---

## Change 4: Hide button immediately when solve is clicked

In the solve button event listener, add one line after drawing all phrases:

### BEFORE

```js
        allKeys.forEach(key => {
            markPhraseCorrect(key);
            drawPhrase(key);
        });

        showFeedback('There. Now you know what it looks like.', 'correct-feedback');
```

### AFTER

```js
        allKeys.forEach(key => {
            markPhraseCorrect(key);
            drawPhrase(key);
        });

        solveBtn.classList.add('hidden');
        showFeedback('There. Now you know what it looks like.', 'correct-feedback');
```

---

## No rebuild required

Static file change only. Save and hard refresh (Ctrl+Shift+R).

```
