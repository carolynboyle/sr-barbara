# dev_submission.md

**Path:** docs/dev_submission.md
**Syntax:** markdown
**Generated:** 2026-04-27 16:01:34

```markdown
*This is a submission for the [DEV Weekend Challenge: Community](https://dev.to/challenges/weekend-2026-02-28)*

## The Community

People who learned grammar the old way—and developers who recognize that parsing sentences and parsing code are the same skill.

This is for anyone who remembers diagramming sentences, parents who want their kids to learn analytical thinking, teachers looking for visual grammar tools, and programmers who'll see the parse tree hiding in a Reed-Kellogg diagram.

Picasso learned portraiture before cubism. e.e. cummings mastered form before abandoning it. You have to be good before you can break the rules well. This is for anyone who believes mastering rules earns you the right to break them.

## What I Built

**Sr. Barbara's Class** is a web-based sentence diagramming game to revive a nearly-lost art. Players see a sentence on a chalkboard, click words to identify their grammatical role, and watch the diagram build piece by piece. The aesthetic is intentional: chalk on slate, the way we learned it. A color-coded legend appears as you progress. Sr. Barbara offers commentary. A "Show Solution" button keeps things low-stress—this is about learning patterns, not punishment.

Sentences range from easy ("The cat sat.") to hard, including garden-path sentences that fool your parsing instincts before resolving.

## Why I Built It

In the 1970s, back at St. Patrick's elementary school, Sr. Barbara drilled us relentlessly on sentence diagramming. Reed-Kellogg diagrams—the kind where you place the subject and verb on a baseline, hang modifiers on slanted lines, and branch prepositional phrases below.

It was tedious. It was exacting. None of us understood why it mattered. But—and I would never have admitted this to any other 7th grader—I was into it. The sense of accomplishment I felt once I'd learned what went where on the diagrams was real. And ever since those drills, when I look at a sentence, in my mind's eye it falls into its component parts.

Which explains why, as soon as I got my hands on a computer keyboard, coding came naturally.

Breaking a sentence into its grammatical components—subject, predicate, objects, modifiers—is the same mental operation as parsing code. Sr. Barbara was teaching us to think like programmers before the term existed. The baseline of a Reed-Kellogg diagram is a parse tree. She just drew it horizontally.

## Demo

![Start of game](https://github.com/user-attachments/assets/b195dc14-5f1c-409a-a30c-2452488a7686)

![Completed Diagram](https://github.com/user-attachments/assets/f5c79055-5ac9-465b-8078-b8bf1827d75a)

```bash
git clone https://github.com/carolynboyle/sr-barbara.git
cd sr-barbara
docker compose up --build
```

Then visit http://localhost:5000

## Code

{% embed https://github.com/carolynboyle/sr-barbara %}

## How I Built It

Flask backend, PostgreSQL database with a normalized schema for sentences and grammatical relationships, vanilla JavaScript, and SVG-rendered diagrams—all in a Docker container.

---

Sr. Barbara, wherever you are: thank you. The lessons stuck longer than either of us expected.

```
