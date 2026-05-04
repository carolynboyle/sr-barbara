# truncate.sql

**Path:** db/truncate.sql
**Syntax:** sql
**Generated:** 2026-05-03 16:07:45

```sql
-- clear all records from the database, preserving table structure
TRUNCATE sentence_tokens, sentence_parts, sentences RESTART IDENTITY CASCADE;

```
