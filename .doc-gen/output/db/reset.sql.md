# reset.sql

**Path:** db/reset.sql
**Syntax:** sql
**Generated:** 2026-05-03 16:07:45

```sql
-- Sr. Barbara's Class — reset.sql
-- Drops all tables and rebuilds from scratch.
-- Run with: psql -U postgres -d sr_barbara -f db/reset.sql

DROP TABLE IF EXISTS sentence_tokens CASCADE;
DROP TABLE IF EXISTS sentence_parts CASCADE;
DROP TABLE IF EXISTS sentences CASCADE;
DROP TABLE IF EXISTS parts_of_speech CASCADE;
DROP TABLE IF EXISTS difficulty_levels CASCADE;

\i db/schema.sql
\i db/seed.sql

```
