-- Sr. Barbara's Class - Database Schema
-- Reed-Kellogg Sentence Diagramming Game

-- Lookup table for difficulty levels
CREATE TABLE difficulty_levels (
    id SERIAL PRIMARY KEY,
    level VARCHAR(10) NOT NULL UNIQUE
);

INSERT INTO difficulty_levels (level) VALUES ('easy'), ('medium'), ('hard');

-- Lookup table for parts of speech
CREATE TABLE parts_of_speech (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

INSERT INTO parts_of_speech (name, description) VALUES
    ('subject', 'Who or what the sentence is about'),
    ('verb', 'The action or state of being'),
    ('direct_object', 'Receives the action of the verb'),
    ('adjective', 'Modifies a noun or pronoun'),
    ('adverb', 'Modifies a verb, adjective, or other adverb'),
    ('article', 'Definite or indefinite determiner'),
    ('preposition', 'Shows relationship between noun and rest of sentence'),
    ('prepositional_phrase', 'Preposition plus its object'),
    ('object_of_preposition', 'Noun or pronoun following a preposition');

-- Parent sentence record
CREATE TABLE sentences (
    id SERIAL PRIMARY KEY,
    difficulty_id INTEGER REFERENCES difficulty_levels(id) DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Major grammatical divisions of a sentence
CREATE TABLE sentence_parts (
    id SERIAL PRIMARY KEY,
    sentence_id INTEGER REFERENCES sentences(id),
    part_of_speech_id INTEGER REFERENCES parts_of_speech(id),
    position INTEGER NOT NULL
);

-- Individual placeable tokens within each part
CREATE TABLE sentence_tokens (
    id SERIAL PRIMARY KEY,
    sentence_part_id INTEGER REFERENCES sentence_parts(id),
    part_of_speech_id INTEGER REFERENCES parts_of_speech(id),
    token VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL
);
