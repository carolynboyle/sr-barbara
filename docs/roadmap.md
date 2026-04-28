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

**Subordinate clause schema design** — When the time comes, the addition
of subordinate clauses will likely require separating token-level parts of
speech from structural diagram roles, and introducing a proper tree model
for sentence parts. This is a meaningful refactor and should be designed
carefully before any code is written. The analysis document tracks the
reasoning behind the current incremental approach and what the trigger
conditions are for the larger change.

**OS-neutral install script** — Interactive setup that detects the
environment and configures accordingly, reducing Docker/docker-compose
confusion.
