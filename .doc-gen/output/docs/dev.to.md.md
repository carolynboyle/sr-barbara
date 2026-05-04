# dev.to.md

**Path:** docs/dev.to.md
**Syntax:** markdown
**Generated:** 2026-05-03 16:07:45

```markdown
Sr. Barbara Was Teaching Programming in 1975. She Just Didn't Know It.
In the 1970s, at St. Patrick's elementary school, a nun named Sr. Barbara drilled us relentlessly on sentence diagramming. Reed-Kellogg diagrams—the kind where you place the subject and verb on a baseline, hang modifiers on slanted lines, and branch prepositional phrases below.
It was tedious. It was exacting. None of us understood why it mattered.
Decades later, I figured it out.
The Parse Tree in Disguise
Breaking a sentence into its grammatical components—subject, predicate, objects, modifiers—is the same mental operation as parsing code. Recognizing how pieces relate to a whole, understanding hierarchy, seeing structure beneath surface: this is computational thinking.
Sr. Barbara was teaching us to think like programmers before the term existed. The baseline of a Reed-Kellogg diagram is a parse tree. She just drew it horizontally.
A Lost Art
Reed-Kellogg diagramming has mostly vanished from classrooms. That's a loss. Not because everyone needs to diagram sentences, but because the skill it teaches—breaking complexity into structured components—transfers everywhere.
This weekend, I built a game to bring it back.
Sr. Barbara's Class
Sr. Barbara's Class is a web-based sentence diagramming game. Players see a sentence on a chalkboard, click words to identify their grammatical role, and watch the diagram build piece by piece.
The aesthetic is intentional: chalk on slate, the way we learned it. A color-coded legend appears as you progress. Sr. Barbara offers commentary. A "Show Solution" button keeps things low-stress—this is about learning patterns, not punishment.
Tech stack: Flask backend, PostgreSQL database with normalized schema for sentences and grammatical relationships, vanilla JavaScript, and SVG-rendered diagrams.
Sentences range from easy ("The cat sat.") to hard—including garden-path sentences that fool your parsing instincts before resolving.
The Community
Who is this for?

People who remember diagramming and want to revisit it
Teachers looking for a tool to make grammar visual
Developers who'll recognize the parsing connection
Anyone who believes mastering rules earns you the right to break them

Picasso learned portraiture before cubism. e.e. cummings mastered form before abandoning it. You have to be good before you can break the rules well. Reed-Kellogg diagrams are the skeleton test: if a sentence diagrams cleanly, it holds together. If not, it's word salad—not style.
Try It

```
