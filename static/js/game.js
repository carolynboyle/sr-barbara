document.addEventListener('DOMContentLoaded', () => {
    const sentenceText = document.getElementById('sentence-text');
    const newSentenceBtn = document.getElementById('new-sentence');
    const difficultySelect = document.getElementById('difficulty');
    const solveBtn = document.getElementById('solve');
    const diagramArea = document.getElementById('diagram-area');

    let currentSentence = null;

    function createSVG(width, height) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('style', 'font-family: Georgia, serif;');
        return svg;
    }

    function drawLine(svg, x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#2c2c2c');
        line.setAttribute('stroke-width', '1.5');
        svg.appendChild(line);
    }

    function drawText(svg, text, x, y) {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', x);
        t.setAttribute('y', y);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('font-size', '14');
        t.setAttribute('fill', '#2c2c2c');
        t.textContent = text;
        svg.appendChild(t);
    }

    function drawDiagram(sentence) {
        diagramArea.innerHTML = '';
        const words = sentence.replace(/[.,!?]/g, '').split(' ');
        const svg = createSVG(800, 200);

        // Simple baseline for subject | predicate
        const baseY = 100;
        const dividerX = 400;
        const lineWidth = 700;
        const startX = 50;

        // Main horizontal baseline
        drawLine(svg, startX, baseY, startX + lineWidth, baseY);

        // Vertical divider between subject and predicate
        drawLine(svg, dividerX, baseY - 30, dividerX, baseY + 30);

        // Place words evenly on left (subject) and right (predicate) sides
        const leftWords = words.slice(0, Math.ceil(words.length / 2));
        const rightWords = words.slice(Math.ceil(words.length / 2));

        leftWords.forEach((word, i) => {
            const x = startX + (i + 1) * ((dividerX - startX) / (leftWords.length + 1));
            drawText(svg, word, x, baseY - 10);
        });

        rightWords.forEach((word, i) => {
            const x = dividerX + (i + 1) * ((startX + lineWidth - dividerX) / (rightWords.length + 1));
            drawText(svg, word, x, baseY - 10);
        });

        diagramArea.appendChild(svg);
    }

    function fetchSentence() {
        const difficulty = difficultySelect.value;
        fetch(`/api/sentence?difficulty=${difficulty}`)
            .then(response => response.json())
            .then(data => {
                if (data.sentence) {
                    sentenceText.textContent = data.sentence;
                    currentSentence = data.sentence;
                    drawDiagram(data.sentence);
                } else {
                    sentenceText.textContent = 'No sentence found.';
                }
            })
            .catch(error => {
                sentenceText.textContent = 'Error fetching sentence.';
                console.error('Error:', error);
            });
    }

    newSentenceBtn.addEventListener('click', fetchSentence);

    solveBtn.addEventListener('click', () => {
        alert('Solution coming soon!');
    });
});
