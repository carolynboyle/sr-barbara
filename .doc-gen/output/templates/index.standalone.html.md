# index.standalone.html

**Path:** templates/index.standalone.html
**Syntax:** html
**Generated:** 2026-05-03 21:07:47

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sr. Barbara's Class</title>
    <!-- INLINE_CSS -->
</head>
<body>
    <header>
        <h1>Sr. Barbara's Class</h1>
        <p>Reed-Kellogg Sentence Diagramming</p>
    </header>

    <main>
        <div id="controls">
            <select id="difficulty">
                <option value="any">★ Any</option>
                <option value="easy">Easy</option>
                <option value="medium" selected>Medium</option>
                <option value="hard">Hard</option>
            </select>
            <button id="new-sentence">New Sentence</button>
        </div>

        <div id="sentence-display">
            <p id="sentence-text">Click "New Sentence" to begin...</p>
        </div>

        <!-- Part-of-speech popup: hidden until a word is clicked -->
        <div id="pos-popup" class="hidden">
            <p id="popup-prompt">What phrase type does <strong id="popup-word"></strong> belong to?</p>
            <div id="popup-choices"></div>
            <button id="popup-cancel">Never mind</button>
        </div>

        <!-- Sr. Barbara feedback line -->
        <div id="sr-barbara-feedback" class="hidden">
            <span id="feedback-text"></span>
        </div>

        <!-- Chalkboard + Sr. Barbara side by side -->
        <div id="diagram-wrapper">
            <div id="diagram-area">
                <!-- diagram will be drawn here -->
            </div>
            <div id="sidebar">
    <div id="legend"></div>
    <img id="sr-barbara"
         src="{{ IMAGE_SRC }}"
         alt="Sr. Barbara">
    <div id="icon-bar">
        <div id="update-indicator" class="hidden">
            <button id="update-btn" title="Update available">💡</button>
            <div id="update-notice" class="hidden">
                <span>A new version is available!</span>
                <a href="#" target="_blank" rel="noopener">Click here to download</a>
            </div>
        </div>
        <button id="help-btn" title="Help">❔</button>
    </div>
</div>


        </div>

        <button id="solve" class="hidden">Show Solution</button>
           </main>

        <!-- Help overlay -->
        <div id="help-overlay" class="hidden">
            <div id="help-panel">
                <button id="help-close" title="Close">x</button>
                <h2>How to Play</h2>
                <p>Help goes here.</p>
            </div>
        </div>

        <!-- INLINE_SCRIPTS -->
    </body>
</html>

```
