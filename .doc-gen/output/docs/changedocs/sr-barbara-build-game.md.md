# sr-barbara-build-game.md

**Path:** docs/changedocs/sr-barbara-build-game.md
**Syntax:** markdown
**Generated:** 2026-05-03 21:07:46

```markdown
# Sr. Barbara's Class — Changeset: build_game.py
**Date:** 2026-05-03
**Affects:** `scripts/src/sr_barbara_scripts/build_game.py` (new),
`templates/index.standalone.html` (new), `sr_barbara.yaml` (modified),
`pyproject.toml` (modified)
**Reason:** Implement the single-file HTML build pipeline. Produces
`dist/sr_barbara.html` — a fully self-contained file that runs in any
browser with no server, no Docker, no dependencies.

---

## Overview

The build script reads all source files and assembles them into a single
HTML file. CSS is inlined in a `<style>` tag. JavaScript is inlined in
`<script>` tags. The Sr. Barbara image is base64-encoded and embedded
directly in the `src` attribute. The Flask API call is replaced with a
local sentence lookup generated from `sentences.yaml`.

Three classes do the work:

| Class | Responsibility |
|---|---|
| `ConfigRenderer` | Renders `config.js` content from `game_config.yaml` |
| `DataRenderer` | Renders `data.standalone.js` from `sentences.yaml` |
| `GameBuilder` | Orchestrates the build, writes `dist/sr_barbara.html` |

`ProjectConfig` (already exists in `config.py`) handles all path and
config loading. `GameBuilder` takes one as a constructor argument,
consistent with `SentenceExporter`.

---

## File 1: `scripts/src/sr_barbara_scripts/build_game.py` (new file)

Place at: `scripts/src/sr_barbara_scripts/build_game.py`

See attached `build_game.py`.

### Key design decisions

**`ConfigRenderer` generates `config.js` from YAML** — `game_config.yaml`
is the single source of truth. The built file always reflects the YAML;
the "keep in sync by hand" note in the handoff is resolved.

**`DataRenderer` synthesizes token IDs** — `sentences.yaml` has no
Postgres row IDs. The renderer assigns sequential integers starting at 1
per sentence. The JS uses these IDs only for DOM `data-token-id`
attributes and `querySelector` lookups within a single sentence, so
uniqueness within a sentence is all that's required.

**`data.standalone.js` has an identical `fetchSentence()` signature** —
`main.js` calls `fetchSentence()` without knowing which version it's
getting. The standalone version filters the local `SENTENCES` array
instead of hitting the API. No changes to `main.js`.

**Image is base64-encoded inline** — keeps the output truly self-contained.
Adds ~1.15MB to the file size (860KB PNG → base64). Acceptable given
the use case.

**`index.standalone.html` is the template** — the Flask template
(`index.html`) is untouched. The two deployment targets stay cleanly
separated.

---

## File 2: `templates/index.standalone.html` (new file)

Identical structure to `index.html` with three differences:

- No `url_for()` calls anywhere
- `<!-- INLINE_CSS -->` placeholder in `<head>` (replaced with `<style>` block)
- `<!-- INLINE_SCRIPTS -->` placeholder before `</body>` (replaced with all `<script>` blocks)
- `{{ IMAGE_SRC }}` placeholder in the `<img>` src (replaced with base64 data URI)

See attached `index.standalone.html`.

---

## File 3: `sr_barbara.yaml` (modified)

Add one path entry:

### BEFORE

```yaml
paths:
  sentences_yaml:   data/sentences.yaml
  sentences_schema: data/sentences.schema.json
  build_output:     dist/sr_barbara.html
```

### AFTER

```yaml
paths:
  sentences_yaml:      data/sentences.yaml
  sentences_schema:    data/sentences.schema.json
  standalone_template: templates/index.standalone.html
  build_output:        dist/sr_barbara.html
```

### Why

`GameBuilder` reads `standalone_template` from config rather than
hardcoding the path. Consistent with the rule that no script hardcodes
paths or assumptions — all paths come from `sr_barbara.yaml`.

---

## File 4: `pyproject.toml` (modified)

Rename the `srb-build` entry point:

### BEFORE

```toml
[project.scripts]
srb-export = "sr_barbara_scripts.pg_export:main"
srb-build  = "sr_barbara_scripts.build_slingcode:main"
```

### AFTER

```toml
[project.scripts]
srb-export = "sr_barbara_scripts.pg_export:main"
srb-build  = "sr_barbara_scripts.build_game:main"
```

### Why

`build_slingcode.py` was renamed to `build_game.py`. The entry point
must match the new module name. After editing `pyproject.toml`, reinstall
the package so the entry point is updated:

using the project venv:

```bash
/path/to/venv/bin/pip install -e .
```

---

## File 5: `scripts/src/sr_barbara_scripts/build_slingcode.py` (rename)

Rename to `build_game.py`. The file is currently an empty placeholder
so there is no code to migrate — just rename it and place the new
content there.

```bash
mv scripts/src/sr_barbara_scripts/build_slingcode.py \
   scripts/src/sr_barbara_scripts/build_game.py
```

Then replace its contents with the new `build_game.py`.

---

## Running the build

```bash
srb-build
```

Output: `dist/sr_barbara.html`

Open it directly in a browser — no server needed:

```bash
xdg-open dist/sr_barbara.html   # Linux
open dist/sr_barbara.html        # Mac
```

Expected output size: ~1.2MB (dominated by the base64-encoded image).

---

## Verification checklist

- [ ] `dist/sr_barbara.html` created
- [ ] File opens in browser with no server running
- [ ] "New Sentence" loads a sentence
- [ ] Difficulty selector works (easy/medium/hard/any)
- [ ] Clicking a word shows the phrase highlight and popup
- [ ] Correct answer draws on the chalkboard
- [ ] Wrong answer flashes red
- [ ] "Show Solution" fills the diagram and hides the button
- [ ] Completing the diagram shows the completion message
- [ ] Sr. Barbara image is visible in the sidebar
- [ ] Legend builds correctly as phrases are placed

---

## Suggested commit message

```
feat: add build_game.py — single-file HTML build pipeline
```

```
