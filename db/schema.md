# Sr. Barbara's Class - Database Schema

## Overview
Five tables support the sentence diagramming game. Sentences are broken into
parts (subject phrase, predicate phrase, etc.) and tokens (individual placeable
units). This structure allows the game to present sentences word by word and
validate player choices against correct grammatical roles.

## Tables

### difficulty_levels
Lookup table for sentence difficulty.

| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL PK | Primary key |
| level | VARCHAR(10) | easy, medium, or hard |

### parts_of_speech
Lookup table for grammatical roles used in both sentence_parts and sentence_tokens.

| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL PK | Primary key |
| name | VARCHAR(50) | Grammatical role name (subject, verb, adjective, etc.) |
| description | TEXT | Plain English explanation of the role |

### sentences
Parent record for each sentence in the game. The full sentence text is
reconstructed by joining sentence_parts and sentence_tokens in position order.

| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL PK | Primary key |
| difficulty_id | INT FK | References difficulty_levels |
| created_at | TIMESTAMP | Record creation time |

### sentence_parts
Major grammatical divisions of a sentence (subject phrase, predicate phrase,
prepositional phrase, etc.). Each part contains one or more tokens.

| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL PK | Primary key |
| sentence_id | INT FK | References sentences |
| part_of_speech_id | INT FK | References parts_of_speech |
| position | INT | Order of this part within the sentence |

### sentence_tokens
Individual placeable units within a sentence part. A token may be a single
word or a short phrase. This is what the player places on the diagram.

| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL PK | Primary key |
| sentence_part_id | INT FK | References sentence_parts |
| part_of_speech_id | INT FK | References parts_of_speech |
| token | VARCHAR(100) | The word or phrase text |
| position | INT | Order of this token within its part |
