# seed.sql

**Path:** db/seed.sql
**Syntax:** sql
**Generated:** 2026-05-03 21:07:46

```sql
-- Sr. Barbara's Class — seed.sql
-- All sentence data. Run after schema.sql on a clean database.
-- Run with: psql -U postgres -d sr_barbara -f seed.sql
--
-- Tokens now use WORD-LEVEL parts of speech (determiner, noun, adjective, verb, adverb, preposition)
-- while sentence_parts use PHRASE ROLES (subject, verb, direct_object, prepositional_phrase)

-- -------------------------------------------------------
-- EASY sentences
-- -------------------------------------------------------

-- SENTENCE 1 (easy): "Birds fly."
INSERT INTO sentences (id, difficulty_id) VALUES (1, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (1, 1, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (2, 1, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (1, (SELECT id FROM parts_of_speech WHERE name = 'noun'), 'Birds', 1),
    (2, (SELECT id FROM parts_of_speech WHERE name = 'verb'), 'fly',   1);

-- SENTENCE 2 (easy): "The hungry cat meowed."
INSERT INTO sentences (id, difficulty_id) VALUES (2, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (3, 2, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (4, 2, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (3, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),   'The',    1),
    (3, (SELECT id FROM parts_of_speech WHERE name = 'adjective'), 'hungry', 2),
    (3, (SELECT id FROM parts_of_speech WHERE name = 'noun'),      'cat',    3),
    (4, (SELECT id FROM parts_of_speech WHERE name = 'verb'),      'meowed', 1);

-- SENTENCE 3 (easy): "The young baker made bread."
INSERT INTO sentences (id, difficulty_id) VALUES (3, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (5, 3, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       1),
    (6, 3, (SELECT id FROM parts_of_speech WHERE name = 'verb'),          2),
    (7, 3, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (5, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),   'The',   1),
    (5, (SELECT id FROM parts_of_speech WHERE name = 'adjective'), 'young', 2),
    (5, (SELECT id FROM parts_of_speech WHERE name = 'noun'),      'baker', 3),
    (6, (SELECT id FROM parts_of_speech WHERE name = 'verb'),      'made',  1),
    (7, (SELECT id FROM parts_of_speech WHERE name = 'noun'),      'bread', 1);

-- SENTENCE 9 (easy): "Dogs bark."
INSERT INTO sentences (id, difficulty_id) VALUES (9, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (21, 9, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (22, 9, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (21, (SELECT id FROM parts_of_speech WHERE name = 'noun'), 'Dogs', 1),
    (22, (SELECT id FROM parts_of_speech WHERE name = 'verb'), 'bark', 1);

-- SENTENCE 10 (easy): "The sun shines."
INSERT INTO sentences (id, difficulty_id) VALUES (10, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (23, 10, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (24, 10, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (23, (SELECT id FROM parts_of_speech WHERE name = 'determiner'), 'The',    1),
    (23, (SELECT id FROM parts_of_speech WHERE name = 'noun'),    'sun',    2),
    (24, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    'shines', 1);

-- -------------------------------------------------------
-- MEDIUM sentences
-- -------------------------------------------------------

-- SENTENCE 4 (medium): "Rain fell on the roof."
INSERT INTO sentences (id, difficulty_id) VALUES (4, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (8,  4, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (9,  4, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (10, 4, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (8,  (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'Rain', 1),
    (9,  (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'fell', 1),
    (10, (SELECT id FROM parts_of_speech WHERE name = 'preposition'),          'on',   1),
    (10, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'the',  2),
    (10, (SELECT id FROM parts_of_speech WHERE name = 'object_of_preposition'), 'roof', 3);

-- SENTENCE 5 (medium): "The old man slept soundly under the oak tree."
INSERT INTO sentences (id, difficulty_id) VALUES (5, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (11, 5, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (12, 5, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (13, 5, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (11, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'The',     1),
    (11, (SELECT id FROM parts_of_speech WHERE name = 'adjective'),            'old',     2),
    (11, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'man',     3),
    (12, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'slept',   1),
    (12, (SELECT id FROM parts_of_speech WHERE name = 'adverb'),               'soundly', 2),
    (13, (SELECT id FROM parts_of_speech WHERE name = 'preposition'),          'under',   1),
    (13, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'the',     2),
    (13, (SELECT id FROM parts_of_speech WHERE name = 'adjective'),            'oak',     3),
    (13, (SELECT id FROM parts_of_speech WHERE name = 'object_of_preposition'), 'tree',    4);

-- SENTENCE 6 (medium): "The mysterious box sat quietly in the corner of the attic."
INSERT INTO sentences (id, difficulty_id) VALUES (6, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (14, 6, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (15, 6, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (16, 6, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 3),
    (17, 6, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 4);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (14, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'The',        1),
    (14, (SELECT id FROM parts_of_speech WHERE name = 'adjective'),            'mysterious', 2),
    (14, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'box',        3),
    (15, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'sat',        1),
    (15, (SELECT id FROM parts_of_speech WHERE name = 'adverb'),               'quietly',    2),
    (16, (SELECT id FROM parts_of_speech WHERE name = 'preposition'),          'in',         1),
    (16, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'the',        2),
    (16, (SELECT id FROM parts_of_speech WHERE name = 'object_of_preposition'), 'corner',     3),
    (17, (SELECT id FROM parts_of_speech WHERE name = 'preposition'),          'of',         1),
    (17, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'the',        2),
    (17, (SELECT id FROM parts_of_speech WHERE name = 'object_of_preposition'), 'attic',      3);

-- SENTENCE 11 (medium): "The child reads books."
INSERT INTO sentences (id, difficulty_id) VALUES (11, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (25, 11, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       1),
    (26, 11, (SELECT id FROM parts_of_speech WHERE name = 'verb'),          2),
    (27, 11, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (25, (SELECT id FROM parts_of_speech WHERE name = 'determiner'), 'The',   1),
    (25, (SELECT id FROM parts_of_speech WHERE name = 'noun'),    'child', 2),
    (26, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    'reads', 1),
    (27, (SELECT id FROM parts_of_speech WHERE name = 'noun'),    'books', 1);

-- SENTENCE 12 (medium): "Birds sing in spring."
INSERT INTO sentences (id, difficulty_id) VALUES (12, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (28, 12, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (29, 12, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (30, 12, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (28, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'Birds',  1),
    (29, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'sing',   1),
    (30, (SELECT id FROM parts_of_speech WHERE name = 'preposition'),          'in',     1),
    (30, (SELECT id FROM parts_of_speech WHERE name = 'object_of_preposition'), 'spring', 2);

-- -------------------------------------------------------
-- HARD sentences
-- -------------------------------------------------------

-- SENTENCE 13 (hard): "She walked slowly through the quiet park."
INSERT INTO sentences (id, difficulty_id) VALUES (13, 3);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (31, 13, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (32, 13, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (33, 13, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (31, (SELECT id FROM parts_of_speech WHERE name = 'pronoun'),                 'She',     1),
    (32, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'walked',  1),
    (32, (SELECT id FROM parts_of_speech WHERE name = 'adverb'),               'slowly',  2),
    (33, (SELECT id FROM parts_of_speech WHERE name = 'preposition'),          'through', 1),
    (33, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'the',     2),
    (33, (SELECT id FROM parts_of_speech WHERE name = 'adjective'),            'quiet',   3),
    (33, (SELECT id FROM parts_of_speech WHERE name = 'object_of_preposition'), 'park',    4);

-- SENTENCE 14 (hard): "The students finished their work before noon."
INSERT INTO sentences (id, difficulty_id) VALUES (14, 3);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (34, 14, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (35, 14, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (36, 14, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'),        3),
    (37, 14, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 4);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (34, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'The',      1),
    (34, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'students', 2),
    (35, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'finished', 1),
    (36, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),            'their',    1),
    (36, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'work',     2),
    (37, (SELECT id FROM parts_of_speech WHERE name = 'preposition'),          'before',   1),
    (37, (SELECT id FROM parts_of_speech WHERE name = 'object_of_preposition'), 'noon',     2);

-- SENTENCE 8 (hard): "The teacher carried the books to the classroom."
INSERT INTO sentences (id, difficulty_id) VALUES (8, 3);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (18, 8, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (19, 8, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (20, 8, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'),        3),
    (38, 8, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 4);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (18, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'The',       1),
    (18, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'teacher',   2),
    (19, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'carried',   1),
    (20, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'the',       1),
    (20, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'books',     2),
    (38, (SELECT id FROM parts_of_speech WHERE name = 'preposition'),          'to',        1),
    (38, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'the',       2),
    (38, (SELECT id FROM parts_of_speech WHERE name = 'object_of_preposition'), 'classroom', 3);

-- -------------------------------------------------------
-- GEMINI SENTENCES (15-24)
-- -------------------------------------------------------

-- SENTENCE 15 (easy): "Ice melts."
INSERT INTO sentences (id, difficulty_id) VALUES (15, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (39, 15, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (40, 15, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (39, (SELECT id FROM parts_of_speech WHERE name = 'noun'), 'Ice',   1),
    (40, (SELECT id FROM parts_of_speech WHERE name = 'verb'), 'melts', 1);

-- SENTENCE 16 (easy): "The stars shine."
INSERT INTO sentences (id, difficulty_id) VALUES (16, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (41, 16, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (42, 16, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (41, (SELECT id FROM parts_of_speech WHERE name = 'determiner'), 'The',   1),
    (41, (SELECT id FROM parts_of_speech WHERE name = 'noun'),    'stars', 2),
    (42, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    'shine', 1);

-- SENTENCE 17 (medium): "The cook prepared the meal."
INSERT INTO sentences (id, difficulty_id) VALUES (17, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (43, 17, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       1),
    (44, 17, (SELECT id FROM parts_of_speech WHERE name = 'verb'),          2),
    (45, 17, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (43, (SELECT id FROM parts_of_speech WHERE name = 'determiner'), 'The',      1),
    (43, (SELECT id FROM parts_of_speech WHERE name = 'noun'),    'cook',     2),
    (44, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    'prepared', 1),
    (45, (SELECT id FROM parts_of_speech WHERE name = 'determiner'), 'the',      1),
    (45, (SELECT id FROM parts_of_speech WHERE name = 'noun'),    'meal',     2);

-- SENTENCE 18 (medium): "The heavy gate swung slowly."
INSERT INTO sentences (id, difficulty_id) VALUES (18, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (46, 18, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (47, 18, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (46, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),   'The',    1),
    (46, (SELECT id FROM parts_of_speech WHERE name = 'adjective'), 'heavy',  2),
    (46, (SELECT id FROM parts_of_speech WHERE name = 'noun'),      'gate',   3),
    (47, (SELECT id FROM parts_of_speech WHERE name = 'verb'),      'swung',  1),
    (47, (SELECT id FROM parts_of_speech WHERE name = 'adverb'),    'slowly', 2);

-- SENTENCE 19 (medium): "Large fish swim in the pond."
INSERT INTO sentences (id, difficulty_id) VALUES (19, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (48, 19, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (49, 19, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (50, 19, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (48, (SELECT id FROM parts_of_speech WHERE name = 'adjective'),            'Large', 1),
    (48, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'fish',  2),
    (49, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'swim',  1),
    (50, (SELECT id FROM parts_of_speech WHERE name = 'preposition'),          'in',    1),
    (50, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'the',   2),
    (50, (SELECT id FROM parts_of_speech WHERE name = 'object_of_preposition'), 'pond',  3);

-- SENTENCE 20 (hard): "A small puppy chased the red ball excitedly."
INSERT INTO sentences (id, difficulty_id) VALUES (20, 3);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (51, 20, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       1),
    (52, 20, (SELECT id FROM parts_of_speech WHERE name = 'verb'),          2),
    (53, 20, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (51, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),   'A',         1),
    (51, (SELECT id FROM parts_of_speech WHERE name = 'adjective'), 'small',     2),
    (51, (SELECT id FROM parts_of_speech WHERE name = 'noun'),      'puppy',     3),
    (52, (SELECT id FROM parts_of_speech WHERE name = 'verb'),      'chased',    1),
    (52, (SELECT id FROM parts_of_speech WHERE name = 'adverb'),    'excitedly', 2),
    (53, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),   'the',       1),
    (53, (SELECT id FROM parts_of_speech WHERE name = 'adjective'), 'red',       2),
    (53, (SELECT id FROM parts_of_speech WHERE name = 'noun'),      'ball',      3);

-- SENTENCE 21 (hard): "The old clock ticked loudly on the wall."
INSERT INTO sentences (id, difficulty_id) VALUES (21, 3);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (54, 21, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (55, 21, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (56, 21, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (54, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'The',    1),
    (54, (SELECT id FROM parts_of_speech WHERE name = 'adjective'),            'old',    2),
    (54, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'clock',  3),
    (55, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'ticked', 1),
    (55, (SELECT id FROM parts_of_speech WHERE name = 'adverb'),               'loudly', 2),
    (56, (SELECT id FROM parts_of_speech WHERE name = 'preposition'),          'on',     1),
    (56, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'the',    2),
    (56, (SELECT id FROM parts_of_speech WHERE name = 'object_of_preposition'), 'wall',   3);

-- SENTENCE 22 (hard): "The angry giant threw the boulder into the valley."
INSERT INTO sentences (id, difficulty_id) VALUES (22, 3);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (57, 22, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (58, 22, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (59, 22, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'),        3),
    (60, 22, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 4);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (57, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'The',     1),
    (57, (SELECT id FROM parts_of_speech WHERE name = 'adjective'),            'angry',   2),
    (57, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'giant',   3),
    (58, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'threw',   1),
    (59, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'the',     1),
    (59, (SELECT id FROM parts_of_speech WHERE name = 'noun'),                 'boulder', 2),
    (60, (SELECT id FROM parts_of_speech WHERE name = 'preposition'),          'into',    1),
    (60, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),              'the',     2),
    (60, (SELECT id FROM parts_of_speech WHERE name = 'object_of_preposition'), 'valley',  3);

-- SENTENCE 23 (easy): "Children play."
INSERT INTO sentences (id, difficulty_id) VALUES (23, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (61, 23, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (62, 23, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (61, (SELECT id FROM parts_of_speech WHERE name = 'noun'), 'Children', 1),
    (62, (SELECT id FROM parts_of_speech WHERE name = 'verb'), 'play',     1);

-- SENTENCE 24 (medium): "A wise owl spotted the mouse."
INSERT INTO sentences (id, difficulty_id) VALUES (24, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (63, 24, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       1),
    (64, 24, (SELECT id FROM parts_of_speech WHERE name = 'verb'),          2),
    (65, 24, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (63, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),   'A',       1),
    (63, (SELECT id FROM parts_of_speech WHERE name = 'adjective'), 'wise',    2),
    (63, (SELECT id FROM parts_of_speech WHERE name = 'noun'),      'owl',     3),
    (64, (SELECT id FROM parts_of_speech WHERE name = 'verb'),      'spotted', 1),
    (65, (SELECT id FROM parts_of_speech WHERE name = 'determiner'),   'the',     1),
    (65, (SELECT id FROM parts_of_speech WHERE name = 'noun'),      'mouse',   2);

-- -------------------------------------------------------
-- Reset sequences so future INSERTs don't collide with explicit IDs
-- -------------------------------------------------------
SELECT setval('sentences_id_seq',       (SELECT MAX(id) FROM sentences));
SELECT setval('sentence_parts_id_seq',  (SELECT MAX(id) FROM sentence_parts));
SELECT setval('sentence_tokens_id_seq', (SELECT MAX(id) FROM sentence_tokens));

```
