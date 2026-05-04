# game_config.schema.json

**Path:** data/game_config.schema.json
**Syntax:** json
**Generated:** 2026-05-03 21:07:46

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
