# Sr. Barbara's Class — Help Panel Content
**Changeset doc**
**Feature:** Populate `#help-panel` from `data/help.yaml` via `build_game.py`

---

## Overview

Replaces the `<p>Help goes here.</p>` placeholder with content rendered at
build time from a new `data/help.yaml` file. A new `HelpRenderer` class in
`build_game.py` reads the YAML and produces an HTML fragment. Both HTML
templates get a `<!-- INLINE_HELP -->` placeholder. `sr_barbara.yaml` gets
a new path entry. A small CSS addition styles the panel's prose and link.

---

## File 1: `data/help.yaml` (new file)

```yaml
# =============================================================================
# Sr. Barbara's Class — help panel content
# =============================================================================
#
# Rendered into #help-panel at build time by build_game.py (HelpRenderer).
# Edit this file to update the help overlay — no HTML required.
#
# sections: list of body paragraphs shown on the chalkboard.
# footer_link: "Read more" link shown at the bottom of the panel.
#
# =============================================================================

help:
  sections:
    - body: >
        A sentence appears at the top of the chalkboard.
        Click any word to identify its grammatical role.
        Choose from the menu — Sr. Barbara will let you know
        how you're doing.

    - body: >
        As words land on the diagram, a color-coded legend
        builds on the left. Each color represents a part
        of speech.

    - body: >
        Use the difficulty selector to choose Easy, Medium,
        Hard, or ★ for any level. Click New Sentence to get
        a fresh one at any time.

    - body: >
        Stuck? The Show Solution button reveals the complete
        diagram. Sr. Barbara may have thoughts about that.

  footer_link:
    text: Read more on GitHub
    url: https://github.com/carolynboyle/sr-barbara
```

### Why
All game content lives in YAML — this keeps the help text consistent with
that pattern. The structure is flat enough to be edited directly in a future
game-editing UI without any markdown parsing.

---

## File 2: `sr_barbara.yaml`

### BEFORE
```yaml
paths:
  sentences_yaml:      data/sentences.yaml
  sentences_schema:    data/sentences.schema.json
  standalone_template: templates/index.standalone.html
  build_output:        dist/sr_barbara.html
```

### AFTER
```yaml
paths:
  sentences_yaml:      data/sentences.yaml
  sentences_schema:    data/sentences.schema.json
  standalone_template: templates/index.standalone.html
  build_output:        dist/sr_barbara.html
  help_yaml:           data/help.yaml
```

### Why
All file paths consumed by build scripts live in `sr_barbara.yaml`.
`HelpRenderer` reads this path via `ProjectConfig` — no hardcoded paths
in Python.

---

## File 3: `scripts/src/sr_barbara_scripts/build_game.py`

### BEFORE (imports block, top of file)
```python
import base64
import json
import tomllib
from pathlib import Path

import yaml

from sr_barbara_scripts.config import ProjectConfig
```

### AFTER
```python
import base64
import json
import tomllib
from pathlib import Path

import yaml

from sr_barbara_scripts.config import ProjectConfig


# -----------------------------------------------------------------------------
# HelpRenderer
# Reads help.yaml and renders the #help-panel HTML fragment as a string.
# -----------------------------------------------------------------------------

class HelpRenderer:
    """Renders the #help-panel HTML fragment from data/help.yaml."""

    def __init__(self, config: ProjectConfig):
        self._cfg  = config
        self._data = self._load_help()

    def _load_help(self) -> dict:
        path = self._cfg.repo_root / self._cfg.paths['help_yaml']
        with path.open(encoding='utf-8') as f:
            return yaml.safe_load(f)

    def render(self) -> str:
        """Return the HTML fragment for #help-panel body content."""
        help_cfg = self._data['help']
        parts = []

        for section in help_cfg.get('sections', []):
            body = section.get('body', '').strip()
            if body:
                parts.append(f'<p>{body}</p>')

        link = help_cfg.get('footer_link')
        if link:
            parts.append(
                f'<p class="help-footer">'
                f'<a href="{link["url"]}" target="_blank" rel="noopener">'
                f'{link["text"]}</a></p>'
            )

        return '\n'.join(parts)
```

### Why
`HelpRenderer` follows the same pattern as `ConfigRenderer` and
`DataRenderer` — one class, one responsibility. The rendered fragment is
plain HTML, no markdown dependency needed.

---

### BEFORE (GameBuilder.__init__)
```python
def __init__(self, config: ProjectConfig):
    self._cfg             = config
    self._config_renderer = ConfigRenderer(config)
    self._data_renderer   = DataRenderer(config)
```

### AFTER
```python
def __init__(self, config: ProjectConfig):
    self._cfg             = config
    self._config_renderer = ConfigRenderer(config)
    self._data_renderer   = DataRenderer(config)
    self._help_renderer   = HelpRenderer(config)
```

---

### BEFORE (GameBuilder.build — the replace block)
```python
output = template
output = output.replace('<!-- INLINE_CSS -->',     self._inline_css())
output = output.replace('<!-- INLINE_SCRIPTS -->', self._inline_scripts())
output = output.replace('{{ IMAGE_SRC }}',         self._inline_image())
```

### AFTER
```python
output = template
output = output.replace('<!-- INLINE_CSS -->',     self._inline_css())
output = output.replace('<!-- INLINE_SCRIPTS -->', self._inline_scripts())
output = output.replace('<!-- INLINE_HELP -->',    self._help_renderer.render())
output = output.replace('{{ IMAGE_SRC }}',         self._inline_image())
```

### Why
`<!-- INLINE_HELP -->` follows the same placeholder convention already used
for CSS and scripts. Keeps the build logic uniform.

---

## File 4: `templates/index.standalone.html`

### BEFORE
```html
<div id="help-panel">
    <button id="help-close" title="Close">x</button>
    <h2>How to Play</h2>
    <p>Help goes here.</p>
</div>
```

### AFTER
```html
<div id="help-panel">
    <button id="help-close" title="Close">x</button>
    <h2>How to Play</h2>
    <!-- INLINE_HELP -->
</div>
```

### Why
Replaces the static placeholder with the build-time injection point.
The `h2` title stays in the template since it's structural, not content.

---

## File 5: `templates/index.html`

Same change as `index.standalone.html` — identical before/after.

### BEFORE
```html
<div id="help-panel">
    <button id="help-close" title="Close">x</button>
    <h2>How to Play</h2>
    <p>Help goes here.</p>
</div>
```

### AFTER
```html
<div id="help-panel">
    <button id="help-close" title="Close">x</button>
    <h2>How to Play</h2>
    <!-- INLINE_HELP -->
</div>
```

### Why
The Flask-served version needs the same content. `index.html` doesn't go
through `build_game.py`, so the `<!-- INLINE_HELP -->` placeholder will
remain as an HTML comment — harmless and invisible. The rendered content
from `HelpRenderer` only lands in `index.standalone.html` via the build.

**Note:** If you want the Flask-served version to also show help content,
Flask would need to render `index.html` through a template pass that
injects the help fragment. That's a separate task — for now the standalone
build gets the content and the Flask version keeps the comment as a marker.

---

## File 6: `static/css/style.css`

Add after the existing `#help-panel p` rule (currently only has `font-size`,
`line-height`, `color`, `font-style`, `text-align`):

### BEFORE
```css
#help-panel p {
    font-size: 1em;
    line-height: 1.7;
    color: #e8e8e8;
    font-style: italic;
    text-align: center;
}
```

### AFTER
```css
#help-panel p {
    font-size: 1em;
    line-height: 1.7;
    color: #e8e8e8;
    font-style: italic;
    text-align: center;
    margin-bottom: 12px;
}

#help-panel p.help-footer {
    margin-top: 8px;
    font-style: normal;
}

#help-panel a {
    color: #f5f5f5;
    text-decoration: underline;
}

#help-panel a:hover {
    color: #ffffff;
}
```

### Why
`margin-bottom` adds breathing room between paragraphs. The footer link
gets `font-style: normal` so it doesn't look like body copy. Link colors
match the chalkboard palette.

---

## Linter fixes: `scripts/src/sr_barbara_scripts/build_game.py`

Three additional changes required for a clean Pylint run.

### 1. Module docstring (top of file, before imports)

#### BEFORE
```python
# =============================================================================
# Sr. Barbara's Class — build_game.py
...
import base64
```

#### AFTER
```python
# =============================================================================
# Sr. Barbara's Class — build_game.py
...
"""
Assembles dist/sr_barbara.html from source files.
Reads game config, sentences, and help content from YAML;
inlines CSS, JS, and images into a single standalone HTML file.
"""
import base64
```

#### Why
Pylint W0105 / C0114 — module-level docstring required.

---

### 2. Public `version` property on `ConfigRenderer`

#### BEFORE
```python
class ConfigRenderer:
    """Renders config.js content from game_config.yaml and pyproject.toml."""

    def __init__(self, config: ProjectConfig):
        self._cfg     = config
        self._game    = self._load_game_config()
        self._version = self._read_full_version()
```

#### AFTER
```python
class ConfigRenderer:
    """Renders config.js content from game_config.yaml and pyproject.toml."""

    def __init__(self, config: ProjectConfig):
        self._cfg     = config
        self._game    = self._load_game_config()
        self._version = self._read_full_version()

    @property
    def version(self) -> str:
        """Return the full version string read from pyproject.toml."""
        return self._version
```

#### Why
Pylint W0212 — `GameBuilder.build()` was accessing `self._config_renderer._version`
(a protected member of another class). Exposing a public property is the
correct fix. Also update the access site in `GameBuilder.build()`:

#### BEFORE (line 282 area)
```python
version = self._config_renderer._version
```

#### AFTER
```python
version = self._config_renderer.version
```

---

### 3. `main()` docstring

#### BEFORE
```python
def main():
    # Repo root is three levels up from this file:
```

#### AFTER
```python
def main():
    """Entry point for the srb-build command."""
    # Repo root is three levels up from this file:
```

#### Why
Pylint C0116 — missing function docstring.

---

## Build and verify

```bash
srb-build
```

Open `dist/sr_barbara.html`, click ❔, confirm:
- Four paragraphs of help text appear on the chalkboard
- "Read more on GitHub" link is visible at the bottom
- Link opens the repo in a new tab
- X and backdrop click still close the overlay
