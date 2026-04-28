# truncate.sql

**Path:** db/truncate.sql
**Syntax:** sql
**Generated:** 2026-04-27 16:01:34

```sql
-- clear all records from the database, preserving table structure
TRUNCATE sentence_tokens, sentence_parts, sentences RESTART IDENTITY CASCADE;

```
