# README.md

**Path:** README.md
**Syntax:** markdown
**Generated:** 2026-04-27 16:01:34

```markdown
# Sr. Barbara's Class

A web-based sentence diagramming game using the Reed-Kellogg method.

---

## The Story

In the 1970s, at St. Patrick's elementary school, Sr. Barbara drilled us for years on sentence diagramming. We parsed sentences into their grammatical bones—subject, predicate, modifiers hanging on their slanted lines, prepositional phrases branching below.

What none of us realized at the time: Sr. Barbara was teaching computational thinking decades before that term existed. Breaking a sentence into its logical components, understanding how each piece relates to the whole, recognizing patterns and hierarchies—this *is* programming. The baseline of a Reed-Kellogg diagram is the skeleton of a parse tree.

This game is a tribute to that teaching, and a way to implement a nearly-lost educational technique in an entertaining way, while quietly teaching the same analytical skills that programmers use every day.

## Learning the Rules Makes Breaking Them Work

> There is a massive difference between a writer who omits punctuation because they don't know where it goes, and one who omits it to create a specific psychological effect.

Picasso learned to be an excellent portrait painter before he developed his own style. e.e. cummings mastered poetic forms before he did his thing. You have to be very good before you've earned the right to break the rules.

Reed-Kellogg diagrams are the "skeleton test" for sentences. If you can put a sentence on a baseline—if the subject and verb connect—the sentence holds water. If not, it's word salad, not art.

## Gameplay

Players are presented with sentences of varying difficulty. A button above the chalkboard allows selection of "Easy," "Medium," "Hard," and * (any) levels.

Players click on words to identify where they belong on the diagram. Sr. Barbara provides commentary along the way. Once a word lands on the diagram, a color-coded legend indicates which part of speech it is.

A no-stress "Show Solution" button is also shown below the chalkboard.

## Running with Docker

```bash
git clone https://github.com/carolynboyle/sr-barbara.git
cd sr-barbara
docker compose up --build
```

*On some systems (e.g., Mac with Homebrew/OrbStack), use `docker-compose` instead.*

**Access**

- **Game:** http://localhost:5000
- **Database admin (Adminer):** http://localhost:8080

## Database Admin

Adminer is bundled with the container for managing sentences and game data. No additional installation needed—just visit http://localhost:8080 after starting the container.

For details on the database structure, see [schema.md](schema.md). For database utility scripts, see [queries.md](queries.md).

## Screenshots

*Start of game*

![Start of game](https://github.com/user-attachments/assets/b195dc14-5f1c-409a-a30c-2452488a7686)

*After Clicking "Show Solution"*

![After Clicking Show Solution](https://github.com/user-attachments/assets/d276cc0e-9691-4675-9f0c-c8c5348fd2dd)

*After Clicking on a Word*

![After Clicking on a Word](https://github.com/user-attachments/assets/968b1309-eb2b-4c93-b342-cfb77707cd00)

*Completed Diagram*

![Completed Diagram](https://github.com/user-attachments/assets/f5c79055-5ac1-465b-8078-b8bf1827d75a)

## License

MIT

## Acknowledgments

- Sr. Barbara, wherever you are
- The Reed-Kellogg diagramming system, developed by Alonzo Reed and Brainerd Kellogg in 1877
- Everyone who learned to parse before they learned to program

```
