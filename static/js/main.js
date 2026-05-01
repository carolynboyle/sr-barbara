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