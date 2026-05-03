# Sr. Barbara's Class — Changeset: game_config.yaml
**Date:** 2026-05-02
**Affects:** `data/game_config.yaml` (new), `data/game_config.schema.json` (new),
`.vscode/settings.json` (modified), `docs/roadmap.md` (modified)
**Reason:** Externalize all hardcoded constants from `static/js/config.js`
and the hardcoded dialogue strings scattered across `main.js` and `ui.js`
into a YAML config file with a validating JSON Schema.

---

## Background

`static/js/config.js` currently holds all game constants as JS literals.
The build pipeline (`build_slingcode.py`, not yet written) will read
`game_config.yaml` and render `config.js` from it, so constants are
authored in one place and generated into the output.

Dialogue strings in `main.js` ("There. Now you know what it looks like.",
"Load a sentence first!") and `ui.js` ("Excellent work. The sentence is
fully diagrammed.") are also hardcoded. They move here as well.

**Note on dialogue:** These strings are a temporary home. Dialogue belongs
in Postgres alongside the sentence data — same authoring environment, same
export pipeline. This is tracked in the roadmap. When that work is done,
the `dialogue` block will be generated into `game_config.yaml` by
`srb-export`, and the file will be fully generated rather than hand-edited.

**Note on `end_x`:** Not present in `game_config.yaml`. It is derived by
the build script as `width - 20`. Keeping derived values out of config
reduces the chance of the two numbers getting out of sync.

---

## File 1: `data/game_config.yaml` (new file)

```yaml
# =============================================================================
# Sr. Barbara's Class — static game configuration
# =============================================================================
#
# Visual and rendering settings. This file is hand-edited.
#
# NOTE: The dialogue block is a temporary home. These strings belong in
# Postgres as a `dialogue` table, exported by srb-export alongside
# sentences. See roadmap: "Move dialogue to Postgres."
#
# NOTE: character.name is present here but the HTML template currently has
# "Sr. Barbara" hardcoded in several places. The template needs a pass to
# use this value before it is effective. See roadmap: "HTML template
# character.name pass."
#
# Validated by: data/game_config.schema.json
# (Red Hat YAML extension in VS Code provides real-time validation.)
#
# =============================================================================

character:
  name: Sr. Barbara

canvas:
  width: 820
  height: 240
  base_y: 110
  start_x: 30
  margin: 24
  font_sizes: [16, 14, 12]
  min_font: 12

dialogue:
  praise:
    - "Very good. I knew you had it in you."
    - "Correct. See how the sentence reveals itself?"
    - "That's right. Grammar is just logic with better manners."
    - "Excellent. Sr. Barbara approves."
    - "Good. Now keep going — the sentence won't diagram itself."
  scold:
    - "No. Think about what that word is *doing* in the sentence."
    - "That is incorrect. We will try again."
    - "Heavens, no. Look at the sentence again."
    - "Not quite. What is that word's job here?"
    - "No, dear. Pay attention."
  solve: "There. Now you know what it looks like."
  complete: "Excellent work. The sentence is fully diagrammed."
  no_sentence: "Load a sentence first!"

pos:
  colors:
    determiner:  "#d4a574"
    noun:        "#c9a96e"
    pronoun:     "#e8d5a3"
    verb:        "#e8a5a5"
    adjective:   "#a5c4a5"
    adverb:      "#a5b8c4"
    preposition: "#c4a5c4"
  labels:
    determiner:  "Determiner"
    noun:        "Noun"
    pronoun:     "Pronoun"
    verb:        "Verb"
    adjective:   "Adjective"
    adverb:      "Adverb"
    preposition: "Preposition"
```

---

## File 2: `data/game_config.schema.json` (new file)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "game_config.schema.json",
  "title": "Sr. Barbara's Class — Game Configuration",
  "description": "Schema for data/game_config.yaml. Validated by the VS Code Red Hat YAML extension.",
  "type": "object",
  "required": ["character", "canvas", "dialogue", "pos"],
  "additionalProperties": false,
  "properties": {
    "character": {
      "type": "object",
      "required": ["name"],
      "additionalProperties": false,
      "properties": {
        "name": {
          "type": "string",
          "minLength": 1,
          "description": "The character's display name. Note: the HTML template must be updated separately to use this value."
        }
      }
    },
    "canvas": {
      "type": "object",
      "required": ["width", "height", "base_y", "start_x", "margin", "font_sizes", "min_font"],
      "additionalProperties": false,
      "properties": {
        "width":      { "type": "integer", "minimum": 1, "description": "SVG canvas width in pixels. end_x is derived as width - 20 by the build script." },
        "height":     { "type": "integer", "minimum": 1, "description": "SVG canvas height in pixels." },
        "base_y":     { "type": "integer", "minimum": 1, "description": "Y coordinate of the main baseline." },
        "start_x":    { "type": "integer", "minimum": 0, "description": "X coordinate of the left edge of the baseline." },
        "margin":     { "type": "integer", "minimum": 0, "description": "Horizontal margin added to section width estimates." },
        "font_sizes": {
          "type": "array",
          "minItems": 1,
          "items": { "type": "integer", "minimum": 1 },
          "description": "Font size cascade. Tried in order until text fits. Must be descending."
        },
        "min_font":   { "type": "integer", "minimum": 1, "description": "Minimum font size used as last resort." }
      }
    },
    "dialogue": {
      "type": "object",
      "required": ["praise", "scold", "solve", "complete", "no_sentence"],
      "additionalProperties": false,
      "properties": {
        "praise": {
          "type": "array",
          "minItems": 1,
          "items": { "type": "string", "minLength": 1 },
          "description": "Lines spoken on a correct answer. One is chosen at random."
        },
        "scold": {
          "type": "array",
          "minItems": 1,
          "items": { "type": "string", "minLength": 1 },
          "description": "Lines spoken on an incorrect answer. One is chosen at random."
        },
        "solve":      { "type": "string", "minLength": 1, "description": "Spoken when the player clicks Show Solution." },
        "complete":   { "type": "string", "minLength": 1, "description": "Spoken when the player completes the diagram." },
        "no_sentence":{ "type": "string", "minLength": 1, "description": "Spoken when solve is clicked before a sentence is loaded." }
      }
    },
    "pos": {
      "type": "object",
      "required": ["colors", "labels"],
      "additionalProperties": false,
      "properties": {
        "colors": {
          "type": "object",
          "required": ["determiner", "noun", "pronoun", "verb", "adjective", "adverb", "preposition"],
          "additionalProperties": false,
          "properties": {
            "determiner":  { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" },
            "noun":        { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" },
            "pronoun":     { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" },
            "verb":        { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" },
            "adjective":   { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" },
            "adverb":      { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" },
            "preposition": { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" }
          },
          "description": "Hex color codes for each token-level part of speech shown in the diagram legend."
        },
        "labels": {
          "type": "object",
          "required": ["determiner", "noun", "pronoun", "verb", "adjective", "adverb", "preposition"],
          "additionalProperties": false,
          "properties": {
            "determiner":  { "type": "string", "minLength": 1 },
            "noun":        { "type": "string", "minLength": 1 },
            "pronoun":     { "type": "string", "minLength": 1 },
            "verb":        { "type": "string", "minLength": 1 },
            "adjective":   { "type": "string", "minLength": 1 },
            "adverb":      { "type": "string", "minLength": 1 },
            "preposition": { "type": "string", "minLength": 1 }
          },
          "description": "Display labels for each token-level part of speech shown in the diagram legend."
        }
      }
    }
  }
}
```

---

## File 3: `.vscode/settings.json` (modified)

### BEFORE

```json
{
  "yaml.schemas": {
    "./data/sentences.schema.json": "data/sentences.yaml"
  }
}
```

### AFTER

```json
{
  "yaml.schemas": {
    "./data/sentences.schema.json": "data/sentences.yaml",
    "./data/game_config.schema.json": "data/game_config.yaml"
  }
}
```

### Why

Wires the new schema to `game_config.yaml` so the Red Hat YAML extension
validates it in real time, the same way `sentences.yaml` is validated.

---

## File 4: `docs/roadmap.md` (modified)

Add two items to the **Future Possibilities** section:

### BEFORE

```markdown
## Future Possibilities

**Subordinate clause schema design** — When the time comes...

**OS-neutral install script** — Interactive setup...
```

### AFTER

```markdown
## Future Possibilities

**Move dialogue to Postgres** — The dialogue strings in `data/game_config.yaml`
(`praise`, `scold`, `solve`, `complete`, `no_sentence`) are a temporary home.
They belong in Postgres as a `dialogue` table with a `context` column, exported
by `srb-export` alongside sentences. When done, `game_config.yaml` becomes fully
generated rather than hand-edited, and the Postgres authoring environment covers
all game content. Prerequisite for the broader Postgres game authoring tool.

**HTML template character.name pass** — `character.name` is now in
`game_config.yaml` and will be baked into `config.js` by the build script, but
the HTML template currently has "Sr. Barbara" hardcoded in the page title, any
visible character labels, and potentially CSS class names. The template needs a
pass to use the config value before `character.name` is effective. This is a
prerequisite for the game template pattern — a new game should only need to
change content files, not the template HTML.

**CSS split: base.css / sr-barbara.css** — The current `style.css` mixes
game-engine styles (layout, controls, chalkboard structure) with
character-specific styles (colors, aesthetic). For the game template pattern,
these should be separated: `base.css` travels with the engine, and
`sr-barbara.css` (or `boyles-lab.css`, etc.) is game-specific. Do this pass
when the second game is started — that's when the boundary between the two
layers will be obvious.

**Subordinate clause schema design** — When the time comes...

**OS-neutral install script** — Interactive setup...
```

---

## Summary of changes

| File | Change |
|------|--------|
| `data/game_config.yaml` | New — all constants from `config.js`, dialogue from `main.js` and `ui.js` |
| `data/game_config.schema.json` | New — validates `game_config.yaml` in VS Code |
| `.vscode/settings.json` | Add second schema entry for `game_config.yaml` |
| `docs/roadmap.md` | Add three Future Possibilities items |

---

## What is NOT changed by this changeset

`static/js/config.js` is not modified. It still holds the hardcoded
constants. The build script (`build_slingcode.py`) will read
`game_config.yaml` and generate `config.js` from it — that work happens
when the build script is written. Until then, `config.js` remains the
live source of truth for the running Flask app, and `game_config.yaml`
is the authored source of truth that the build pipeline will consume.

Both files should stay in sync by hand until the build script exists.
