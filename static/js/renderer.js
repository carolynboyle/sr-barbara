// =============================================================================
// Sr. Barbara's Class — Renderer
// SVG drawing functions for the chalkboard diagram.
// Depends on: config.js, layout.js
// Uses globals: diagramSVG, layout, ppSlot, drawnRoles
// =============================================================================

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

function drawTokensInSection(tokens, startX, endX, y) {
    const sectionWidth   = endX - startX;
    const totalTextWidth = tokens.reduce((sum, t) => sum + estimateWidth(t.word, layout.fontSize), 0);
    const totalGaps      = tokens.length - 1;
    const gapWidth       = tokens.length > 1
        ? Math.min(20, (sectionWidth - totalTextWidth) / (totalGaps + 2))
        : 0;

    const groupWidth = totalTextWidth + (totalGaps * gapWidth);
    let x = startX + (sectionWidth - groupWidth) / 2;

    tokens.forEach(t => {
        const wordWidth = estimateWidth(t.word, layout.fontSize);
        const textX     = x + wordWidth / 2;
        const cssClass  = 'pos-' + (t.pos || 'default');
        diagramSVG.appendChild(svgText(t.word, textX, y, 'middle', cssClass));
        x += wordWidth + gapWidth;
    });
}

function drawPhrase(key) {
    if (!diagramSVG || drawnRoles.has(key)) return;
    drawnRoles.add(key);

    const tokens = currentSentence.tokens.filter(t => phraseKey(t) === key);
    const role   = tokens[0].part_role;

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
            const anchorX  = divX + 60 + (ppSlot * 140);
            const anchorY  = BASE_Y;
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