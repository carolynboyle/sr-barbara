# sr-barbara-main-scoping-fix.md

**Path:** docs/changedocs/sr-barbara-main-scoping-fix.md
**Syntax:** markdown
**Generated:** 2026-05-03 16:07:45

```markdown
# Sr. Barbara's Class — Changeset: main.js Scoping Fix
**Date:** 2026-05-01
**Affects:** `static/js/main.js` only
**Reason:** All DOM references and state variables were declared inside the
`DOMContentLoaded` closure, making them invisible to the other modules
(`data.js`, `ui.js`, `renderer.js`). The game appeared to work after the
module split because the browser was serving the old monolithic `game.js`
from cache. On a hard refresh, everything except the difficulty dropdown
(plain HTML, no JS required) stopped responding.

The fix promotes all shared variables to true module-level globals.
`DOMContentLoaded` stays, but only wraps the initialization that genuinely
needs the DOM to be ready: the `getElementById` assignments and event
listener wiring.

---

## File: `static/js/main.js`

### BEFORE

```js
// =============================================================================
// Sr. Barbara's Class — Main
// App state, diagram initialization, event wiring.
// Depends on: all other modules (loaded before this in index.html)
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------------
    // DOM references
    // -------------------------------------------------------------------------
    const sentenceDisplay  = document.getElementById('sentence-text');
    const newSentenceBtn   = document.getElementById('new-sentence');
    const difficultySelect = document.getElementById('difficulty');
    const solveBtn         = document.getElementById('solve');
    const diagramArea      = document.getElementById('diagram-area');

    const posPopup         = document.getElementById('pos-popup');
    const popupWord        = document.getElementById('popup-word');
    const popupChoices     = document.getElementById('popup-choices');
    const popupCancel      = document.getElementById('popup-cancel');

    const feedbackBar      = document.getElementById('sr-barbara-feedback');
    const feedbackText     = document.getElementById('feedback-text');
    const legend           = document.getElementById('legend');

    // -------------------------------------------------------------------------
    // App state — shared across all modules as globals
    // -------------------------------------------------------------------------
    let currentSentence = null;
    let feedbackTimer   = null;
    let diagramSVG      = null;
    let drawnRoles      = new Set();
    let ppSlot          = 0;
    let legendSeen      = new Set();
    let layout          = {};

    // -------------------------------------------------------------------------
    // Composite phrase key
    // -------------------------------------------------------------------------
    function phraseKey(token) {
        return `${token.part_role}__${token.part_position}`;
    }

    // -------------------------------------------------------------------------
    // Diagram initialization
    // -------------------------------------------------------------------------
    function initDiagram() {
        diagramArea.innerHTML = '';
        drawnRoles.clear();
        ppSlot = 0;
        legend.innerHTML = '';
        legendSeen.clear();
        solveBtn.classList.remove('hidden');

        layout = calculateLayout(currentSentence.tokens);

        diagramSVG = svgEl('svg', {
            width: W, height: H,
            viewBox: `0 0 ${W} ${H}`
        });
        diagramArea.appendChild(diagramSVG);
    }

    // -------------------------------------------------------------------------
    // Answer handling
    // -------------------------------------------------------------------------
    function handleChoice(chosen_role, token) {
        hidePopup();

        if (chosen_role === token.part_role) {
            const key = phraseKey(token);
            markPhraseCorrect(key);
            drawPhrase(key);
            showFeedback(randomFrom(PRAISE), 'correct-feedback');
            checkCompletion();
        } else {
            const el = document.querySelector(`[data-token-id="${token.id}"]`);
            if (el) {
                el.classList.add('wrong');
                setTimeout(() => el.classList.remove('wrong'), 800);
            }
            showFeedback(randomFrom(SCOLD), 'wrong-feedback');
        }
    }

    // -------------------------------------------------------------------------
    // Event listeners
    // -------------------------------------------------------------------------
    popupCancel.addEventListener('click', hidePopup);

    solveBtn.addEventListener('click', () => {
        if (!currentSentence) {
            showFeedback('Load a sentence first!', 'wrong-feedback');
            return;
        }

        const allKeys = [...new Map(
            currentSentence.tokens.map(t => [phraseKey(t), t])
        ).keys()];

        allKeys.forEach(key => {
            markPhraseCorrect(key);
            drawPhrase(key);
        });

        solveBtn.classList.add('hidden');
        showFeedback('There. Now you know what it looks like.', 'correct-feedback');
    });

    newSentenceBtn.addEventListener('click', fetchSentence);
    difficultySelect.addEventListener('change', fetchSentence);
});
```

### AFTER

```js
// =============================================================================
// Sr. Barbara's Class — Main
// App state, diagram initialization, event wiring.
// Depends on: all other modules (loaded before this in index.html)
// =============================================================================

// -----------------------------------------------------------------------------
// DOM references — declared as globals so all modules can reach them
// -----------------------------------------------------------------------------
let sentenceDisplay  = null;
let newSentenceBtn   = null;
let difficultySelect = null;
let solveBtn         = null;
let diagramArea      = null;

let posPopup         = null;
let popupWord        = null;
let popupChoices     = null;
let popupCancel      = null;

let feedbackBar      = null;
let feedbackText     = null;
let legend           = null;

// -----------------------------------------------------------------------------
// App state — globals shared across all modules
// -----------------------------------------------------------------------------
let currentSentence = null;
let feedbackTimer   = null;
let diagramSVG      = null;
let drawnRoles      = new Set();
let ppSlot          = 0;
let legendSeen      = new Set();
let layout          = {};

// -----------------------------------------------------------------------------
// Composite phrase key
// -----------------------------------------------------------------------------
function phraseKey(token) {
    return `${token.part_role}__${token.part_position}`;
}

// -----------------------------------------------------------------------------
// Diagram initialization
// -----------------------------------------------------------------------------
function initDiagram() {
    diagramArea.innerHTML = '';
    drawnRoles.clear();
    ppSlot = 0;
    legend.innerHTML = '';
    legendSeen.clear();
    solveBtn.classList.remove('hidden');

    layout = calculateLayout(currentSentence.tokens);

    diagramSVG = svgEl('svg', {
        width: W, height: H,
        viewBox: `0 0 ${W} ${H}`
    });
    diagramArea.appendChild(diagramSVG);
}

// -----------------------------------------------------------------------------
// Answer handling
// -----------------------------------------------------------------------------
function handleChoice(chosen_role, token) {
    hidePopup();

    if (chosen_role === token.part_role) {
        const key = phraseKey(token);
        markPhraseCorrect(key);
        drawPhrase(key);
        showFeedback(randomFrom(PRAISE), 'correct-feedback');
        checkCompletion();
    } else {
        const el = document.querySelector(`[data-token-id="${token.id}"]`);
        if (el) {
            el.classList.add('wrong');
            setTimeout(() => el.classList.remove('wrong'), 800);
        }
        showFeedback(randomFrom(SCOLD), 'wrong-feedback');
    }
}

// -----------------------------------------------------------------------------
// DOMContentLoaded — assign DOM refs and wire events once DOM is ready
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

    sentenceDisplay  = document.getElementById('sentence-text');
    newSentenceBtn   = document.getElementById('new-sentence');
    difficultySelect = document.getElementById('difficulty');
    solveBtn         = document.getElementById('solve');
    diagramArea      = document.getElementById('diagram-area');

    posPopup         = document.getElementById('pos-popup');
    popupWord        = document.getElementById('popup-word');
    popupChoices     = document.getElementById('popup-choices');
    popupCancel      = document.getElementById('popup-cancel');

    feedbackBar      = document.getElementById('sr-barbara-feedback');
    feedbackText     = document.getElementById('feedback-text');
    legend           = document.getElementById('legend');

    popupCancel.addEventListener('click', hidePopup);

    solveBtn.addEventListener('click', () => {
        if (!currentSentence) {
            showFeedback('Load a sentence first!', 'wrong-feedback');
            return;
        }

        const allKeys = [...new Map(
            currentSentence.tokens.map(t => [phraseKey(t), t])
        ).keys()];

        allKeys.forEach(key => {
            markPhraseCorrect(key);
            drawPhrase(key);
        });

        solveBtn.classList.add('hidden');
        showFeedback('There. Now you know what it looks like.', 'correct-feedback');
    });

    newSentenceBtn.addEventListener('click', fetchSentence);
    difficultySelect.addEventListener('change', fetchSentence);
});
```

### Why

Variables declared with `const` or `let` inside a function are scoped to
that function. The other modules (`data.js`, `ui.js`, `renderer.js`) are
separate script files — they cannot see inside `main.js`'s
`DOMContentLoaded` callback no matter when they execute. `difficultySelect`,
`feedbackTimer`, and all the other shared names must be declared at the
top level of the script (i.e. as globals) to be visible across files.

The `DOMContentLoaded` wrapper is still needed — but only for the
`getElementById` calls (which must run after the DOM exists) and the
event listener wiring. Everything else moves out.

---

## No rebuild required

Static file change only. Save and hard refresh (Ctrl+Shift+R).

```
