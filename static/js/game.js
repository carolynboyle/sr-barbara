document.addEventListener('DOMContentLoaded', () => {
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

    let currentSentence  = null;
    let feedbackTimer    = null;
    let diagramSVG       = null;
    let drawnRoles       = new Set();
    let ppSlot           = 0;
    let legendSeen       = new Set();  // tracks which POS are already in the legend

    // Per-sentence layout — calculated once in initDiagram, used by all drawPhrase calls
    let layout = {};

    // -------------------------------------------------------------------------
    // Composite phrase key
    // -------------------------------------------------------------------------
    function phraseKey(token) {
        return `${token.part_role}__${token.part_position}`;
    }

    // -------------------------------------------------------------------------
    // Fixed canvas dimensions
    // -------------------------------------------------------------------------
    const W       = 820;
    const H       = 240;
    const BASE_Y  = 110;
    const START_X = 30;
    const END_X   = W - 20;
    const MARGIN  = 24;   // minimum padding inside each section

    // Font size cascade — try each in order until text fits
    const FONT_SIZES = [16, 14, 12];
    const MIN_FONT   = 12;

    // -------------------------------------------------------------------------
    // Estimate pixel width of a string at a given font size.
    // Georgia is roughly 0.58× the font size per character on average.
    // -------------------------------------------------------------------------
    function estimateWidth(text, fontSize) {
        return text.length * fontSize * 0.58;
    }

    // -------------------------------------------------------------------------
    // Calculate dynamic layout for the current sentence.
    // Returns { divX, objX, fontSize } that fit within the fixed canvas.
    // -------------------------------------------------------------------------
    function calculateLayout(tokens) {
        const subjectTokens = tokens.filter(t => t.part_role === 'subject');
        const verbTokens    = tokens.filter(t => t.part_role === 'verb');
        const objectTokens  = tokens.filter(t => t.part_role === 'direct_object');

        const subjectText = subjectTokens.map(t => t.word).join(' ');
        const verbText    = verbTokens.map(t => t.word).join(' ');
        const objectText  = objectTokens.map(t => t.word).join(' ');

        const hasObject   = objectTokens.length > 0;
        const available   = END_X - START_X;

        for (const fontSize of FONT_SIZES) {
            const subW = Math.max(estimateWidth(subjectText, fontSize) + MARGIN * 2, 120);
            const verbW = Math.max(estimateWidth(verbText, fontSize) + MARGIN * 2, 100);
            const objW  = hasObject
                ? Math.max(estimateWidth(objectText, fontSize) + MARGIN * 2, 120)
                : 0;

            const totalNeeded = subW + verbW + objW;

            if (totalNeeded <= available) {
                // Scale up proportionally to fill the canvas
                const scale  = available / totalNeeded;
                const divX   = START_X + Math.round(subW * scale);
                const objX   = hasObject ? divX + Math.round(verbW * scale) : null;
                return { divX, objX, fontSize, hasObject };
            }
        }

        // Last resort — use minimum font and best-effort proportions
        console.warn('Sr. Barbara: sentence may be too long for the chalkboard.');
        const subW = Math.max(estimateWidth(subjectText, MIN_FONT) + MARGIN, 100);
        const verbW = Math.max(estimateWidth(verbText, MIN_FONT) + MARGIN, 80);
        const objW  = hasObject
            ? Math.max(estimateWidth(objectText, MIN_FONT) + MARGIN, 100)
            : 0;
        const total  = subW + verbW + objW;
        const scale  = available / total;
        const divX   = START_X + Math.round(subW * scale);
        const objX   = hasObject ? divX + Math.round(verbW * scale) : null;
        return { divX, objX, fontSize: MIN_FONT, hasObject };
    }

    // -------------------------------------------------------------------------
    // Sr. Barbara's dialogue
    // -------------------------------------------------------------------------
    const PRAISE = [
        "Very good. I knew you had it in you.",
        "Correct. See how the sentence reveals itself?",
        "That's right. Grammar is just logic with better manners.",
        "Excellent. Sr. Barbara approves.",
        "Good. Now keep going — the sentence won't diagram itself.",
    ];

    const SCOLD = [
        "No. Think about what that word is *doing* in the sentence.",
        "That is incorrect. We will try again.",
        "Heavens, no. Look at the sentence again.",
        "Not quite. What is that word's job here?",
        "No, dear. Pay attention.",
    ];

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

    // -------------------------------------------------------------------------
    // Legend - builds incrementally as phrases are placed
    // -------------------------------------------------------------------------
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

    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // -------------------------------------------------------------------------
    // Feedback bar
    // -------------------------------------------------------------------------
    function showFeedback(message, type) {
        clearTimeout(feedbackTimer);
        feedbackText.textContent = message;
        feedbackBar.className = type;
    }

    // -------------------------------------------------------------------------
    // SVG helpers
    // -------------------------------------------------------------------------
    function svgEl(tag, attrs) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
        return el;
    }

    function svgLine(x1, y1, x2, y2) {
        return svgEl('line', { x1, y1, x2, y2 });
    }

    function svgText(text, x, y, anchor = 'middle', cssClass = '') {
        const t = svgEl('text', {
            x, y,
            'text-anchor': anchor,
            'font-size': layout.fontSize
        });
        if (cssClass) t.setAttribute('class', cssClass);
        t.textContent = text;
        return t;
    }

    // -------------------------------------------------------------------------
    // Diagram
    // -------------------------------------------------------------------------
    function initDiagram() {
        diagramArea.innerHTML = '';
        drawnRoles.clear();
        ppSlot = 0;
        legend.innerHTML = '';
        legendSeen.clear();

        // Calculate layout for this specific sentence
        layout = calculateLayout(currentSentence.tokens);

        diagramSVG = svgEl('svg', {
            width: W, height: H,
            viewBox: `0 0 ${W} ${H}`
        });
        diagramArea.appendChild(diagramSVG);
    }

    // -------------------------------------------------------------------------
    // Draw tokens individually with their part-of-speech colors
    // -------------------------------------------------------------------------
    function drawTokensInSection(tokens, startX, endX, y) {
        const sectionWidth = endX - startX;
        const totalTextWidth = tokens.reduce((sum, t) => sum + estimateWidth(t.word, layout.fontSize), 0);
        const totalGaps = tokens.length - 1;
        const gapWidth = tokens.length > 1 ? Math.min(20, (sectionWidth - totalTextWidth) / (totalGaps + 2)) : 0;

        // Center the whole group
        const groupWidth = totalTextWidth + (totalGaps * gapWidth);
        let x = startX + (sectionWidth - groupWidth) / 2;

        tokens.forEach((t, i) => {
            const wordWidth = estimateWidth(t.word, layout.fontSize);
            const textX = x + wordWidth / 2;
            const cssClass = 'pos-' + (t.pos || 'default');
            diagramSVG.appendChild(svgText(t.word, textX, y, 'middle', cssClass));
            x += wordWidth + gapWidth;
        });
    }

 function drawPhrase(key) {
    if (!diagramSVG || drawnRoles.has(key)) return;
    drawnRoles.add(key);

    const tokens  = currentSentence.tokens.filter(t => phraseKey(t) === key);
    const role    = tokens[0].part_role;

    const { divX, objX, hasObject } = layout;
    const verbEndX = hasObject ? objX : END_X;

    switch (role) {

        case 'subject': {
            diagramSVG.appendChild(svgLine(START_X, BASE_Y, divX, BASE_Y));
            diagramSVG.appendChild(svgLine(divX, BASE_Y - 35, divX, BASE_Y + 10));
            drawTokensInSection(tokens, START_X, divX, BASE_Y - 14);
            break;
        }

        case 'verb': {
            diagramSVG.appendChild(svgLine(divX, BASE_Y, verbEndX, BASE_Y));
            drawTokensInSection(tokens, divX, verbEndX, BASE_Y - 14);
            break;
        }

        case 'direct_object': {
            diagramSVG.appendChild(svgLine(objX, BASE_Y - 35, objX, BASE_Y));
            diagramSVG.appendChild(svgLine(objX, BASE_Y, END_X, BASE_Y));
            drawTokensInSection(tokens, objX, END_X, BASE_Y - 14);
            break;
        }

        case 'prepositional_phrase': {
            const anchorX  = divX + 60;
            const anchorY  = BASE_Y + (ppSlot * 45);
            const slantX   = anchorX + 20;
            const slantY   = anchorY + 38;
            const ppWidth  = Math.max(120, tokens.map(t => t.word).join(' ').length * layout.fontSize * 0.6);
            const lineEndX = slantX + ppWidth;

            diagramSVG.appendChild(svgLine(anchorX, BASE_Y, anchorX, anchorY));
            diagramSVG.appendChild(svgLine(anchorX, anchorY, slantX, slantY));
            diagramSVG.appendChild(svgLine(slantX, slantY, lineEndX, slantY));
            drawTokensInSection(tokens, slantX, lineEndX, slantY - 6);
            ppSlot++;
            break;
        }

        default: {
            const fallbackY = BASE_Y + 60 + (drawnRoles.size * 30);
            diagramSVG.appendChild(svgLine(START_X, fallbackY, END_X, fallbackY));
            drawTokensInSection(tokens, START_X, END_X, fallbackY - 6);
            break;
        }
    }

    addToLegend(tokens);
}
    // -------------------------------------------------------------------------
    // Popup
    // -------------------------------------------------------------------------
    function showPopup(tokenEl, token) {
        popupWord.textContent = token.word;
        popupChoices.innerHTML = '';

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
    }

    popupCancel.addEventListener('click', hidePopup);

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
        } else {
            const el = document.querySelector(`[data-token-id="${token.id}"]`);
            if (el) {
                el.classList.add('wrong');
                setTimeout(() => el.classList.remove('wrong'), 800);
            }
            showFeedback(randomFrom(SCOLD), 'wrong-feedback');
        }
    }

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

    // -------------------------------------------------------------------------
    // Render sentence as clickable spans
    // -------------------------------------------------------------------------
    

    function renderSentence(data) {
    sentenceDisplay.innerHTML = '';

    data.tokens.forEach((token, i) => {
        const span = document.createElement('span');
        span.className         = 'word-token';
        span.dataset.tokenId      = token.id;
        span.dataset.pos          = token.pos;
        span.dataset.partRole     = token.part_role;
        span.dataset.partPosition = token.part_position;
        span.textContent       = token.word;

        span.addEventListener('click', () => {
            if (span.classList.contains('correct')) return;
            showPopup(span, token);
        });

        sentenceDisplay.appendChild(span);
        if (i < data.tokens.length - 1) {
            sentenceDisplay.appendChild(document.createTextNode(' '));
        } else {
            sentenceDisplay.appendChild(document.createTextNode('.'));
        }
    });
}

    // -------------------------------------------------------------------------
    // Fetch sentence
    // -------------------------------------------------------------------------
    function fetchSentence() {
        const difficulty = difficultySelect.value;
        sentenceDisplay.textContent = 'Fetching sentence…';
        hidePopup();
        feedbackBar.classList.add('hidden');

        fetch(`/api/sentence?difficulty=${difficulty}`)
            .then(r => r.json())
            .then(data => {
                if (data.error) {
                    sentenceDisplay.textContent = 'No sentence found for that difficulty.';
                    return;
                }
                currentSentence = data;
                renderSentence(data);
                initDiagram();
            })
            .catch(err => {
                sentenceDisplay.textContent = 'Error fetching sentence.';
                console.error('Fetch error:', err);
            });
    }

    // -------------------------------------------------------------------------
    // Solve button
    // -------------------------------------------------------------------------
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

        showFeedback('There. Now you know what it looks like.', 'correct-feedback');
    });

    newSentenceBtn.addEventListener('click', fetchSentence);
    difficultySelect.addEventListener('change', fetchSentence);
});
