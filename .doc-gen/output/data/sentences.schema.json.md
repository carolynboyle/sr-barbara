# sentences.schema.json

**Path:** data/sentences.schema.json
**Syntax:** json
**Generated:** 2026-05-03 16:07:45

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "sentences.schema.json",
  "title": "Sr. Barbara's Class — Sentence Data",
  "description": "Schema for data/sentences.yaml. Validated by the VS Code Red Hat YAML extension.",
  "type": "object",
  "required": ["sentences"],
  "additionalProperties": false,
  "properties": {
    "sentences": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "difficulty", "phrases"],
        "additionalProperties": false,
        "properties": {
          "id": {
            "type": "integer",
            "minimum": 1,
            "description": "Unique sentence ID. Must match the id in Postgres."
          },
          "difficulty": {
            "type": "string",
            "enum": ["easy", "medium", "hard"],
            "description": "Difficulty level."
          },
          "phrases": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "object",
              "required": ["role", "tokens"],
              "additionalProperties": false,
              "properties": {
                "role": {
                  "type": "string",
                  "enum": [
                    "subject",
                    "verb",
                    "direct_object",
                    "prepositional_phrase"
                  ],
                  "description": "Phrase-level grammatical role."
                },
                "tokens": {
                  "type": "array",
                  "minItems": 1,
                  "items": {
                    "type": "object",
                    "required": ["word", "pos"],
                    "additionalProperties": false,
                    "properties": {
                      "word": {
                        "type": "string",
                        "minLength": 1,
                        "description": "The word as it appears in the sentence."
                      },
                      "pos": {
                        "type": "string",
                        "enum": [
                          "noun",
                          "pronoun",
                          "verb",
                          "adjective",
                          "adverb",
                          "determiner",
                          "preposition",
                          "object_of_preposition",
                          "conjunction",
                          "interjection"
                        ],
                        "description": "Token-level part of speech."
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

```
