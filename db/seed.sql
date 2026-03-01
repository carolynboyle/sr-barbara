-- Sr. Barbara's Class — seed.sql
-- All sentence data. Run after schema.sql on a clean database.
-- Run with: psql -U postgres -d sr_barbara -f db/seed.sql
--
-- Sentences:
--   Easy   (1): 1 Birds fly.
--   Easy   (2): 2 The hungry cat meowed.
--   Easy   (3): 3 The young baker made bread.
--   Easy   (4): 9 Dogs bark.
--   Easy   (5): 10 The sun shines.
--   Medium (6): 4 Rain fell on the roof.
--   Medium (7): 5 The old man slept soundly under the oak tree.
--   Medium (8): 6 The mysterious box sat quietly in the corner of the attic.
--   Medium (9): 11 The child reads books.
--   Medium (10): 12 Birds sing in spring.
--   Hard   (11): 13 She walked slowly through the quiet park.
--   Hard   (12): 14 The students finished their work before noon.  [fixed]
--   Hard   (13): 8  The teacher carried the books to the classroom. [replaced]

-- -------------------------------------------------------
-- EASY sentences
-- -------------------------------------------------------

-- SENTENCE 1 (easy): "Birds fly."
INSERT INTO sentences (id, difficulty_id) VALUES (1, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (1, 1, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (2, 1, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (1, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 'Birds', 1),
    (2, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    'fly',   1);

-- SENTENCE 2 (easy): "The hungry cat meowed."
INSERT INTO sentences (id, difficulty_id) VALUES (2, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (3, 2, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (4, 2, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (3, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 'The',    1),
    (3, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 'hungry', 2),
    (3, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 'cat',    3),
    (4, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    'meowed', 1);

-- SENTENCE 3 (easy): "The young baker made bread."
INSERT INTO sentences (id, difficulty_id) VALUES (3, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (5, 3, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       1),
    (6, 3, (SELECT id FROM parts_of_speech WHERE name = 'verb'),          2),
    (7, 3, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (5, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       'The',   1),
    (5, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       'young', 2),
    (5, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       'baker', 3),
    (6, (SELECT id FROM parts_of_speech WHERE name = 'verb'),          'made',  1),
    (7, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'), 'bread', 1);

-- SENTENCE 9 (easy): "Dogs bark."
INSERT INTO sentences (id, difficulty_id) VALUES (9, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (21, 9, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (22, 9, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (21, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 'Dogs', 1),
    (22, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    'bark', 1);

-- SENTENCE 10 (easy): "The sun shines."
INSERT INTO sentences (id, difficulty_id) VALUES (10, 1);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (23, 10, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 1),
    (24, 10, (SELECT id FROM parts_of_speech WHERE name = 'verb'),    2);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (23, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 'The',    1),
    (23, (SELECT id FROM parts_of_speech WHERE name = 'subject'), 'sun',    2),
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
    (8,  (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'Rain', 1),
    (9,  (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'fell', 1),
    (10, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'on',   1),
    (10, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'the',  2),
    (10, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'roof', 3);

-- SENTENCE 5 (medium): "The old man slept soundly under the oak tree."
INSERT INTO sentences (id, difficulty_id) VALUES (5, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (11, 5, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (12, 5, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (13, 5, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (11, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'The',     1),
    (11, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'old',     2),
    (11, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'man',     3),
    (12, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'slept',   1),
    (12, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'soundly', 2),
    (13, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'under',   1),
    (13, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'the',     2),
    (13, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'oak',     3),
    (13, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'tree',    4);

-- SENTENCE 6 (medium): "The mysterious box sat quietly in the corner of the attic."
INSERT INTO sentences (id, difficulty_id) VALUES (6, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (14, 6, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (15, 6, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (16, 6, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 3),
    (17, 6, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 4);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (14, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'The',        1),
    (14, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'mysterious', 2),
    (14, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'box',        3),
    (15, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'sat',        1),
    (15, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'quietly',    2),
    (16, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'in',         1),
    (16, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'the',        2),
    (16, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'corner',     3),
    (17, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'of',         1),
    (17, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'the',        2),
    (17, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'attic',      3);

-- SENTENCE 11 (medium): "The child reads books."
INSERT INTO sentences (id, difficulty_id) VALUES (11, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (25, 11, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       1),
    (26, 11, (SELECT id FROM parts_of_speech WHERE name = 'verb'),          2),
    (27, 11, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (25, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       'The',   1),
    (25, (SELECT id FROM parts_of_speech WHERE name = 'subject'),       'child', 2),
    (26, (SELECT id FROM parts_of_speech WHERE name = 'verb'),          'reads', 1),
    (27, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'), 'books', 1);

-- SENTENCE 12 (medium): "Birds sing in spring."
INSERT INTO sentences (id, difficulty_id) VALUES (12, 2);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (28, 12, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (29, 12, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (30, 12, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 3);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (28, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'Birds',  1),
    (29, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'sing',   1),
    (30, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'in',     1),
    (30, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'spring', 2);

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
    (31, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'She',     1),
    (32, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'walked',  1),
    (32, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'slowly',  2),
    (33, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'through', 1),
    (33, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'the',     2),
    (33, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'quiet',   3),
    (33, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'park',    4);

-- SENTENCE 14 (hard): "The students finished their work before noon."
-- Fixed: replaced subordinate clause "before the bell rang" with
-- the genuine prepositional phrase "before noon."
INSERT INTO sentences (id, difficulty_id) VALUES (14, 3);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (34, 14, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (35, 14, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (36, 14, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'),        3),
    (37, 14, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 4);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (34, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'The',      1),
    (34, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'students', 2),
    (35, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'finished', 1),
    (36, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'),        'their',    1),
    (36, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'),        'work',     2),
    (37, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'before',   1),
    (37, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'noon',     2);

-- SENTENCE 8 (hard): "The teacher carried the books to the classroom."
-- Replaced the original sentence 8 which had a relative clause
-- that the renderer cannot handle.
INSERT INTO sentences (id, difficulty_id) VALUES (8, 3);
INSERT INTO sentence_parts (id, sentence_id, part_of_speech_id, position) VALUES
    (18, 8, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              1),
    (19, 8, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 2),
    (20, 8, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'),        3),
    (38, 8, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 4);
INSERT INTO sentence_tokens (sentence_part_id, part_of_speech_id, token, position) VALUES
    (18, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'The',       1),
    (18, (SELECT id FROM parts_of_speech WHERE name = 'subject'),              'teacher',   2),
    (19, (SELECT id FROM parts_of_speech WHERE name = 'verb'),                 'carried',   1),
    (20, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'),        'the',       1),
    (20, (SELECT id FROM parts_of_speech WHERE name = 'direct_object'),        'books',     2),
    (38, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'to',        1),
    (38, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'the',       2),
    (38, (SELECT id FROM parts_of_speech WHERE name = 'prepositional_phrase'), 'classroom', 3);

-- -------------------------------------------------------
-- Reset sequences so future INSERTs don't collide with explicit IDs
-- -------------------------------------------------------
SELECT setval('sentences_id_seq',      (SELECT MAX(id) FROM sentences));
SELECT setval('sentence_parts_id_seq', (SELECT MAX(id) FROM sentence_parts));
SELECT setval('sentence_tokens_id_seq',(SELECT MAX(id) FROM sentence_tokens));