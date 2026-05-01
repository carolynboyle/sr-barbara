// =============================================================================
// Sr. Barbara's Class — Layout
// Calculates canvas geometry for a given sentence.
// Depends on: config.js
// =============================================================================

// Estimate pixel width of a string at a given font size.
// Georgia is roughly 0.58x the font size per character on average.
function estimateWidth(text, fontSize) {
    return text.length * fontSize * 0.58;
}

// Calculate dynamic layout for the current sentence.
// Returns { divX, objX, fontSize, hasObject } that fit within the fixed canvas.
function calculateLayout(tokens) {
    const subjectTokens = tokens.filter(t => t.part_role === 'subject');
    const verbTokens    = tokens.filter(t => t.part_role === 'verb');
    const objectTokens  = tokens.filter(t => t.part_role === 'direct_object');

    const subjectText = subjectTokens.map(t => t.word).join(' ');
    const verbText    = verbTokens.map(t => t.word).join(' ');
    const objectText  = objectTokens.map(t => t.word).join(' ');

    const hasObject = objectTokens.length > 0;
    const available = END_X - START_X;

    for (const fontSize of FONT_SIZES) {
        const subW = Math.max(estimateWidth(subjectText, fontSize) + MARGIN * 2, 120);
        const verbW = Math.max(estimateWidth(verbText, fontSize) + MARGIN * 2, 100);
        const objW  = hasObject
            ? Math.max(estimateWidth(objectText, fontSize) + MARGIN * 2, 120)
            : 0;

        const totalNeeded = subW + verbW + objW;

        if (totalNeeded <= available) {
            const scale = available / totalNeeded;
            const divX  = START_X + Math.round(subW * scale);
            const objX  = hasObject ? divX + Math.round(verbW * scale) : null;
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
    const total = subW + verbW + objW;
    const scale = available / total;
    const divX  = START_X + Math.round(subW * scale);
    const objX  = hasObject ? divX + Math.round(verbW * scale) : null;
    return { divX, objX, fontSize: MIN_FONT, hasObject };
}