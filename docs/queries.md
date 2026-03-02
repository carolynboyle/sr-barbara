# Sr. Barbara's Class - Database Queries

## Utility Scripts

| File | Purpose |
|------|---------|
| schema.sql | Creates all tables and inserts lookup values for difficulty_levels and parts_of_speech |
| seed.sql | Populates sentences, sentence_parts, and sentence_tokens with game content |
| reset.sql | Drops all tables and rebuilds from scratch (runs schema.sql then seed.sql) |
| dropall.sql | Drops all tables in dependency order (children before parents) |
| truncate.sql | Clears all sentence data while preserving table structure and lookup values |
| sentences_view.sql | Creates v_sentences view for easy inspection of sentence content |

## Usage

All scripts assume you're connected to the sr_barbara database:

```bash
psql -U postgres -d sr_barbara -f db/schema.sql
psql -U postgres -d sr_barbara -f db/seed.sql
psql -U postgres -d sr_barbara -f db/reset.sql
```

## The v_sentences View

After running sentences_view.sql, you can inspect sentence data:

```sql
-- See all tokens with their grammatical roles
SELECT * FROM v_sentences ORDER BY sentence_id, part_position, token_position;

-- See just the reconstructed sentences
SELECT DISTINCT sentence_id, difficulty, sentence_text FROM v_sentences ORDER BY sentence_id;
```
