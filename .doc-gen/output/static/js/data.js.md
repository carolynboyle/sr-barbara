# data.js

**Path:** static/js/data.js
**Syntax:** javascript
**Generated:** 2026-05-03 21:07:47

```javascript
// =============================================================================
// Sr. Barbara's Class — Data (Flask version)
// Fetches sentence data from the Flask API.
// Uses globals: currentSentence, difficultySelect, sentenceDisplay,
//               feedbackBar
// =============================================================================

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
```
