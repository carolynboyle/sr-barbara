# clear all records from the database, preserving table structure
TRUNCATE sentence_tokens, sentence_parts, sentences RESTART IDENTITY CASCADE;