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