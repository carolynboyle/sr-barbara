# ui.js

**Path:** static/js/ui.js
**Syntax:** javascript
**Generated:** 2026-05-03 16:07:45

```javascript
// =============================================================================
// Sr. Barbara's Class — UI
// DOM manipulation: legend, feedback bar, popup, sentence display.
// Depends on: config.js
// Uses globals: currentSentence, drawnRoles, legendSeen, feedbackTimer,
//               solveBtn, feedbackBar, feedbackText, legend,
//               posPopup, popupWord, popupChoices, sentenceDisplay
// =============================================================================

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// -----------------------------------------------------------------------------
// Feedback bar
// -----------------------------------------------------------------------------
function showFeedback(message, type) {
    clearTimeout(feedbackTimer);
    feedbackText.textContent = message;
    feedbackBar.className = type;
}

// -----------------------------------------------------------------------------
// Legend — builds incrementally as phrases are placed
// -----------------------------------------------------------------------------
function addToLegend(tokens) {
    tokens.forEach(t => {
        const pos = t.pos;
        if (pos && POS_COLORS[pos] && !legendSeen.has(pos)) {
            legendSeen.add(pos);
            const item = document.createElement('div');
            item.className = 'legend-item';

            const swatch = document.createElement('span');
            swatch.className = 'legend-swatch';
            swatch.style.backgroundColor = POS_COLORS[pos];

            const label = document.createElement('span');
            label.className = 'legend-label';
            label.textContent = POS_LABELS[pos] || pos;

            item.appendChild(swatch);
            item.appendChild(label);
            legend.appendChild(item);
        }
    });
}

// -----------------------------------------------------------------------------
// Popup
// -----------------------------------------------------------------------------
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

    // --- everything below is unchanged ---
    const remainingTokens = currentSentence.tokens
        .filter(t => !drawnRoles.has(phraseKey(t)));

    const seenLabels = new Set();
    const choices = [];
    remainingTokens.forEach(t => {
        const label = t.part_role.replace(/_/g, ' ');
        if (!seenLabels.has(label)) {
            seenLabels.add(label);
            choices.push({ label, part_role: t.part_role });
        }
    });

    choices.forEach(({ label, part_role }) => {
        const btn = document.createElement('button');
        btn.className = 'pos-choice';
        btn.textContent = label;
        btn.addEventListener('click', () => handleChoice(part_role, token));
        popupChoices.appendChild(btn);
    });

    posPopup.classList.remove('hidden');
}

function hidePopup() {
    posPopup.classList.add('hidden');
    popupChoices.innerHTML = '';
    document.querySelectorAll('.word-token.phrase-highlight')
        .forEach(el => el.classList.remove('phrase-highlight'));
}

// -----------------------------------------------------------------------------
// Sentence display — render tokens as clickable spans
// -----------------------------------------------------------------------------
function renderSentence(data) {
    sentenceDisplay.innerHTML = '';

    data.tokens.forEach((token, i) => {
        const span = document.createElement('span');
        span.className            = 'word-token';
        span.dataset.tokenId      = token.id;
        span.dataset.pos          = token.pos;
        span.dataset.partRole     = token.part_role;
        span.dataset.partPosition = token.part_position;
        span.textContent          = token.word;

        span.addEventListener('click', () => {
            if (span.classList.contains('correct')) return;
            showPopup(span, token);
        });

        sentenceDisplay.appendChild(span);
        if (i < data.tokens.length - 1) {
            sentenceDisplay.appendChild(document.createTextNode(' '));
        }
    });
}

// -----------------------------------------------------------------------------
// Mark phrase words as placed (replace with blank spacers)
// -----------------------------------------------------------------------------
function markPhraseCorrect(key) {
    currentSentence.tokens
        .filter(t => phraseKey(t) === key)
        .forEach(t => {
            const el = document.querySelector(`[data-token-id="${t.id}"]`);
            if (el) {
                const width = el.getBoundingClientRect().width;
                const spacer = document.createElement('span');
                spacer.className = 'word-blank';
                spacer.style.display = 'inline-block';
                spacer.style.width = `${width}px`;
                el.replaceWith(spacer);
            }
        });
}

// -----------------------------------------------------------------------------
// Completion check — hide solve button and show message when done
// -----------------------------------------------------------------------------
function checkCompletion() {
    const allKeys = [...new Map(
        currentSentence.tokens.map(t => [phraseKey(t), t])
    ).keys()];
    if (allKeys.every(key => drawnRoles.has(key))) {
        solveBtn.classList.add('hidden');
        showFeedback('Excellent work. The sentence is fully diagrammed.', 'correct-feedback');
    }
}
```
