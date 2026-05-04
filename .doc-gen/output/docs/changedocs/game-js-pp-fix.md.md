# game-js-pp-fix.md

**Path:** docs/changedocs/game-js-pp-fix.md
**Syntax:** markdown
**Generated:** 2026-05-03 16:07:45

```markdown
# Sr. Barbara's Class — Bug Fix: Prepositional Phrase Rendering

**Date:** 2026-04-27
**Affects:** `static/js/game.js`
**Reason:** Multiple prepositional phrases rendered at the same horizontal
anchor point, causing them to stack vertically and overlap rather than
spread across the chalkboard.

---

## File: `static/js/game.js`

### BEFORE

```js
case 'prepositional_phrase': {
    const anchorX  = divX + 60;
    const anchorY  = BASE_Y + (ppSlot * 45);
```

### AFTER

```js
case 'prepositional_phrase': {
    const anchorX  = divX + 60 + (ppSlot * 140);
    const anchorY  = BASE_Y;
```

### Why

`anchorX` was hardcoded to `divX + 60` for every prepositional phrase
regardless of which slot it occupied. `anchorY` was incrementing
vertically with each slot, so multiple prep phrases stacked on top of
each other at the same X position.

The fix offsets each prep phrase 140px to the right of the previous one,
spreading them horizontally along the baseline rather than piling them
vertically. `anchorY` is reset to `BASE_Y` since the vertical drop is
already handled by the slant line below.

---

## Note: What a correct Reed-Kellogg diagram actually does

This fix is a pragmatic approximation. In a proper Reed-Kellogg diagram,
prepositional phrases are not simply spread horizontally — their placement
depends on what they modify:

- A prepositional phrase modifying the **verb** hangs below the verb
  section of the baseline, connected by a vertical line dropping from
  the baseline, then a diagonal line, then a horizontal line carrying
  the preposition and its object.

- A prepositional phrase modifying the **object** hangs below the object
  section of the baseline, connected the same way but anchored under
  the direct object.

- A prepositional phrase modifying **another prepositional phrase**
  (chained phrases like "in the corner of the attic") hangs below the
  object of the first phrase — the second phrase's vertical connector
  drops from the end of the first phrase's horizontal line, not from
  the main baseline at all.

The current implementation treats all prepositional phrases as hanging
from the same point on the baseline, which is structurally incorrect for
chained phrases. "In the corner **of the attic**" should show "of the
attic" branching off "corner", not off the baseline.

Implementing true Reed-Kellogg prepositional phrase chaining requires:
1. Tracking which phrase each prep phrase modifies (currently not stored
   in the data model — would need a `modifies` field in sentence_parts)
2. Calculating anchor points relative to the parent phrase's object word
   position rather than relative to the baseline
3. Recursive or iterative rendering of phrase chains

This is tracked in the roadmap as a future enhancement.

```
