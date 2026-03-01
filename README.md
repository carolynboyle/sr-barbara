# Sr. Barbara's Class

A web-based sentence diagramming game using the Reed-Kellogg method.

## The Story

In the 1970s, at St. Patrick's elementary school, Sr. Barbara drilled us for years on sentence diagramming. We parsed sentences into their grammatical bones—subject, predicate, modifiers hanging on their slanted lines, prepositional phrases branching below.

What none of us realized at the time: Sr. Barbara was teaching computational thinking decades before that term existed. Breaking a sentence into its logical components, understanding how each piece relates to the whole, recognizing patterns and hierarchies—this *is* programming. The baseline of a Reed-Kellogg diagram is the skeleton of a parse tree.

This game is a tribute to that teaching, and an attempt to revive a lost educational technique that quietly teaches the same analytical skills that programmers use every day.

## Learn the Rules Like a Pro

> "There is a massive difference between a writer who omits punctuation because they don't know where it goes, and one who omits it to create a specific psychological effect."

Picasso learned to be an excellent portrait painter before he developed his own style. e.e. cummings mastered poetic forms before he did his thing. You have to be very good before you've earned the right to break the rules.

Reed-Kellogg diagrams are the "skeleton test" for sentences. If you can put a sentence on a baseline—if the subject and verb connect—the sentence holds water. If not, it's word salad, not art.

## How It Works

Players are presented with sentences of varying difficulty. Click on words to identify their parts of speech, and watch as grammatical phrases animate into their correct positions on the Reed-Kellogg diagram. Sr. Barbara provides commentary along the way.

## Tech Stack

- **Backend:** Flask (Python)
- **Database:** PostgreSQL
- **Frontend:** Vanilla JavaScript with SVG diagram rendering
- **Aesthetic:** Old-school chalkboard with chalk-style text

## Prerequisites

On a clean system, you'll need:

- **Python 3.10+**
- **PostgreSQL** (server running, with credentials to create a database)
- **pip** (usually included with Python)

## Running Locally

```bash
# Clone the repository
git clone https://github.com/carolynboyle/sr-barbara.git
cd sr-barbara

# Set up Python environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e .

# Create the database and configure connection
createdb sr_barbara
# Create a .env file with your PostgreSQL credentials:
#   DB_HOST=localhost
#   DB_NAME=sr_barbara
#   DB_USER=postgres
#   DB_PASSWORD=yourpassword

# Initialize the database
psql -d sr_barbara -f schema.sql
psql -d sr_barbara -f seed.sql

# Run the application
python app.py
```

Visit `http://localhost:5000` in your browser.

## Screenshots

*Coming soon*

## License

MIT

## Acknowledgments

- Sr. Barbara, wherever you are
- The Reed-Kellogg diagramming system, developed by Alonzo Reed and Brainerd Kellogg in 1877
- Everyone who learned to parse before they learned to program
