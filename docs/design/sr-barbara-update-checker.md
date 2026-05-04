# Sr. Barbara's Class — Changeset: Update Checker & Help Overlay
**Date:** 2026-05-03
**Affects:** `scripts/src/sr_barbara_scripts/build_game.py` (modified),
`static/js/ui.js` (modified), `static/css/style.css` (modified),
`templates/index.html` (modified), `templates/index.standalone.html` (modified)
**Reason:** Add an in-game update checker and help overlay. The update
checker compares the built version against the latest GitHub Release and
shows a lightbulb icon when a newer version is available. The help button
is always visible and opens a chalkboard-styled overlay.

---

## Overview

Two icons appear below Sr. Barbara's feet in the sidebar:

- `💡` — hidden by default; appears when a newer version is available on
  GitHub Releases. Clicking it shows an inline notice with a download link.
- `❔` — always visible; opens a chalkboard-styled help overlay with an X
  to close.

The update check hits the GitHub Releases API once on page load. It fails
silently if the player is offline or the API is unreachable — the lightbulb
simply never appears.

---

## File 1: `scripts/src/sr_barbara_scripts/build_game.py` (modified)

`ConfigRenderer` now reads the full `major.minor.patch` version from
`pyproject.toml` using `tomllib` (stdlib, Python 3.11+) and injects two
new JS constants into the generated config block:

```javascript
const VERSION     = "0.1.1";
const GITHUB_REPO = "carolynboyle/sr-barbara";
```

See attached `build_game.py` — replace the existing file entirely.

### BEFORE (ConfigRenderer.render, constants block)
```javascript
// Canvas dimensions
const W = ...
```

### AFTER (ConfigRenderer.render, constants block)
```javascript
// Build version — used by the update checker
const VERSION = "0.1.1";

// GitHub repo — used by the update checker
const GITHUB_REPO = "carolynboyle/sr-barbara";

// Canvas dimensions
const W = ...
```

---

## File 2: `static/js/ui.js` (modified)

Append the contents of `ui-additions.js` to the bottom of the existing
`ui.js` file.

Adds four functions:
- `checkForUpdate()` — fetches GitHub Releases API, calls `isNewerVersion()`
- `isNewerVersion(latest, current)` — semver comparison
- `showHelp()` — removes `hidden` from `#help-overlay`
- `hideHelp()` — adds `hidden` to `#help-overlay`

### BEFORE
```javascript
// (end of existing ui.js)
function checkCompletion() { ... }
```

### AFTER
```javascript
// (end of existing ui.js)
function checkCompletion() { ... }

// --- append ui-additions.js below this line ---
function checkForUpdate() { ... }
function isNewerVersion(latest, current) { ... }
function showHelp() { ... }
function hideHelp() { ... }
```

---

## File 3: `static/css/style.css` (modified)

Append the contents of `style-additions.css` to the bottom of the
existing `style.css` file.

Adds styles for:
- `#icon-bar` — flex column container below Sr. Barbara image
- `#update-indicator` — wrapper for lightbulb + notice
- `#update-btn` — the lightbulb button (transparent background)
- `#update-notice` — inline update notice panel with download link
- `#help-btn` — circular dark button with ❔
- `#help-overlay` — full-screen dimmed overlay
- `#help-panel` — chalkboard-styled panel (matches `#diagram-area`)
- `#help-close` — X button in top-right corner of panel

---

## File 4: `templates/index.html` (modified)

### BEFORE — sidebar div
```html
<div id="sidebar">
    <div id="legend"></div>
    <img id="sr-barbara"
         src="{{ url_for('static', filename='images/sr_barbara.png') }}"
         alt="Sr. Barbara">
</div>
```

### AFTER — sidebar div
```html
<div id="sidebar">
    <div id="legend"></div>
    <img id="sr-barbara"
         src="{{ url_for('static', filename='images/sr_barbara.png') }}"
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

<!-- Help overlay -->
<div id="help-overlay" class="hidden">
    <div id="help-panel">
        <button id="help-close" title="Close">✕</button>
        <h2>How to Play</h2>
        <p>Help goes here.</p>
    </div>
</div>
```

Note: the help overlay sits inside `<main>` but outside `#diagram-wrapper`,
just before `<button id="solve">`.

---

## File 5: `templates/index.standalone.html` (modified)

Identical changes to File 4, except the image src uses `{{ IMAGE_SRC }}`
(the build script placeholder) instead of `url_for`.

### BEFORE — sidebar div
```html
<div id="sidebar">
    <div id="legend"></div>
    <img id="sr-barbara"
         src="{{ IMAGE_SRC }}"
         alt="Sr. Barbara">
</div>
```

### AFTER — sidebar div
```html
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

<!-- Help overlay -->
<div id="help-overlay" class="hidden">
    <div id="help-panel">
        <button id="help-close" title="Close">✕</button>
        <h2>How to Play</h2>
        <p>Help goes here.</p>
    </div>
</div>
```

---

## File 6: `static/js/main.js` (modified)

`main.js` needs four things wired up in the DOM-ready block:

### New element references (add alongside existing ones)
```javascript
const updateBtn    = document.getElementById('update-btn');
const updateNotice = document.getElementById('update-notice');
const helpBtn      = document.getElementById('help-btn');
const helpOverlay  = document.getElementById('help-overlay');
```

### New event listeners (add alongside existing ones)
```javascript
updateBtn.addEventListener('click', () => {
    updateNotice.classList.toggle('hidden');
});

helpBtn.addEventListener('click', showHelp);

document.getElementById('help-close').addEventListener('click', hideHelp);

helpOverlay.addEventListener('click', (e) => {
    if (e.target === helpOverlay) hideHelp();
});
```

### New init call (add at the end of the init block)
```javascript
checkForUpdate();
```

---

## Verification checklist

- [ ] `srb-build` runs cleanly, output reports version number
- [ ] `dist/sr_barbara.html` opens in browser
- [ ] ❔ button visible below Sr. Barbara's feet
- [ ] ❔ click opens chalkboard help overlay
- [ ] ✕ closes the overlay
- [ ] Clicking outside the panel closes the overlay
- [ ] 💡 hidden on load (assuming current version is latest)
- [ ] To test lightbulb: temporarily set `VERSION = "0.0.1"` in
  `game_config.yaml` (or hardcode in a test build), reload, confirm
  lightbulb appears and notice shows with correct release URL
- [ ] Update notice toggles on/off with repeated lightbulb clicks

---

## Suggested commit message

```
feat: add update checker and help overlay
```
