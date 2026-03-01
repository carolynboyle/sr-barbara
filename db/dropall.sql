-- Sr. Barbara's Class — dropall.sql
-- Drops all tables in dependency order (children before parents).
-- Run with: psql -U postgres -d sr_barbara -f db/dropall.sql

DROP TABLE IF EXISTS sentence_tokens   CASCADE;
DROP TABLE IF EXISTS sentence_parts    CASCADE;
DROP TABLE IF EXISTS sentences         CASCADE;
DROP TABLE IF EXISTS parts_of_speech   CASCADE;
DROP TABLE IF EXISTS difficulty_levels CASCADE;