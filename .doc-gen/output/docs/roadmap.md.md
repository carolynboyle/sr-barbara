# roadmap.md

**Path:** docs/roadmap.md
**Syntax:** markdown
**Generated:** 2026-05-03 16:07:45

```markdown
# Roadmap

Future enhancements for Sr. Barbara's Class.

## High Priority

**Mobile-responsive layout** — The game would fit beautifully on a phone.
CSS adjustments to make the chalkboard and controls work on smaller screens.

**Web form for adding/editing sentences** — Currently sentences are managed
via Adminer. A dedicated interface would make it easier to expand the
sentence library.

**Pronoun support** — Pronouns ("she", "he", "they", "it", "him", "her")
are currently stored using the `noun` part of speech, which is technically
incorrect and will cause problems when the game gives feedback about word
types. Adding `pronoun` to `parts_of_speech` is a small schema change, but
existing sentences that use pronouns will need their token records updated.
Pronouns are among the most common words in natural sentences and the gap
is noticeable.

**Subordinate clause support** — Clauses ("when she arrived", "because the
door was open", "the man who lives next door") are how people actually talk,
and they're one of the most visually distinctive features of Reed-Kellogg
diagrams. A subordinate clause renders as a mini-sentence on a "stepped"
bridge connecting down from the main baseline — its own subject and verb on
a second horizontal line.

This is the feature most likely to require a structural schema change. A
subordinate clause has its own subject and verb, which the current flat
`sentence_parts` model cannot represent. This is the anticipated trigger
for introducing a proper tree structure into the schema (see analysis
document). It should be designed before implementation begins, not during.

## Medium Priority

**Replace Slingcode with a maintained build tool** — The Slingcode port
establishes the single-file HTML output as a working pattern. Slingcode
itself is unmaintained (last meaningful activity 2020; YunoHost packaging
explicitly flags it as abandoned). Once the port is working and validated,
replace Slingcode with an actively maintained alternative. Leading
candidates: Phaser (full game framework, CDN-deliverable) or a clean
vanilla JS build pipeline. Evaluation criteria: security maintenance cadence,
reproducibility across future games, separation of content from engine.

**Reusable game template pattern** — Sr. Barbara's Class is the first in a
planned series of issue-specific educational games. Each game will be tied
to a different newkakistocracy.us issue (language/rhetoric, economics, etc.)
but should share the same engine, build pipeline, and single-file output
format. The variable parts are content (sentences, vocabulary, concepts)
and subject matter — not architecture.

The Sr. Barbara pipeline (`sentences.yaml` → `build_slingcode.py` →
`sr_barbara.html`) is already pointing toward this pattern. The goal is to
formalize it so that building a new issue-specific game means:
1. Writing a content file (YAML or equivalent)
2. Running a build script against a game template
3. Getting a self-contained HTML file out

The template and build script should be documented clearly enough that
future games don't require re-solving the same architectural problems.

**True Reed-Kellogg prepositional phrase chaining** — The current diagram
renderer approximates multi-prep-phrase sentences by spreading phrases
horizontally along the baseline. A correct Reed-Kellogg diagram places each
prepositional phrase below whatever it modifies:

- A phrase modifying the verb hangs below the verb.
- A phrase modifying the direct object hangs below the object.
- A chained phrase (e.g. "of the attic" in "in the corner of the attic")
  hangs below the object of the phrase it modifies — not below the baseline.

Implementing this correctly requires:
1. A `modifies_part_id` field in the `sentence_parts` data model to record
   what each prepositional phrase attaches to.
2. Anchor point calculation relative to the parent phrase's object word
   rather than relative to the baseline.
3. Recursive rendering of phrase chains.

This is a schema change as well as a rendering change — both the database
and the game logic are affected. See the analysis document for the specific
migration.

**Predicate nominative and predicate adjective support** — Linking verb
sentences ("She is a teacher.", "The sky looks dark.") require two new
part-of-speech roles and a new rendering case (the slanted line pointing
back toward the subject).

**Indirect object support** — Sentences like "She gave him the book."
require an `indirect_object` role, rendered on a suspended horizontal line
below the verb.

**More sentence packs** — Additional sentences organized by difficulty
level, theme, or grammatical concept. Pronoun and subordinate clause support
should be in place before expanding the library significantly.

**Animation enhancements** — Animate Sr. Barbara's reactions and word
movements as they land on the diagram.

**Sr. Barbara commentary/hints** — Expand her personality with more
contextual feedback and gentle guidance.

## Future Possibilities

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
