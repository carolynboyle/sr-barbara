# config.js

**Path:** static/js/config.js
**Syntax:** javascript
**Generated:** 2026-05-03 16:07:45

```javascript
// =============================================================================
// Sr. Barbara's Class — Configuration
// All hardcoded constants live here. This file will be replaced by the
// build pipeline when config is externalized to game_config.yaml.
// =============================================================================

// Canvas dimensions
const W       = 820;
const H       = 240;
const BASE_Y  = 110;
const START_X = 30;
const END_X   = W - 20;
const MARGIN  = 24;

// Font size cascade — try each in order until text fits
const FONT_SIZES = [16, 14, 12];
const MIN_FONT   = 12;

// Sr. Barbara's dialogue
const PRAISE = [
    "Very good. I knew you had it in you.",
    "Correct. See how the sentence reveals itself?",
    "That's right. Grammar is just logic with better manners.",
    "Excellent. Sr. Barbara approves.",
    "Good. Now keep going — the sentence won't diagram itself.",
];

const SCOLD = [
    "No. Think about what that word is *doing* in the sentence.",
    "That is incorrect. We will try again.",
    "Heavens, no. Look at the sentence again.",
    "Not quite. What is that word's job here?",
    "No, dear. Pay attention.",
];

// Part of speech colors — muted, chalkboard-friendly
const POS_COLORS = {
    'determiner':  '#d4a574',
    'noun':        '#c9a96e',
    'pronoun':     '#e8d5a3',
    'verb':        '#e8a5a5',
    'adjective':   '#a5c4a5',
    'adverb':      '#a5b8c4',
    'preposition': '#c4a5c4'
};

const POS_LABELS = {
    'determiner':  'Determiner',
    'noun':        'Noun',
    'pronoun':     'Pronoun',
    'verb':        'Verb',
    'adjective':   'Adjective',
    'adverb':      'Adverb',
    'preposition': 'Preposition'
};
```
