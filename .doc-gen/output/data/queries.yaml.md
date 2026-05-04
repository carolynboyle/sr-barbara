# queries.yaml

**Path:** data/queries.yaml
**Syntax:** yaml
**Generated:** 2026-05-03 21:07:46

```yaml
# =============================================================================
# Sr. Barbara's Class — SQL queries
# =============================================================================
#
# Loaded by pipeline scripts via ProjectConfig.
# Grouped by consumer script.
#
# =============================================================================

export:
  fetch_sentences: |
    SELECT
        s.id                    AS sentence_id,
        d.level                 AS difficulty,
        part_pos.name           AS part_role,
        sp.position             AS part_position,
        st.id                   AS token_id,
        st.token                AS word,
        tok_pos.name            AS token_pos,
        st.position             AS token_position
    FROM sentences s
    JOIN difficulty_levels d      ON s.difficulty_id = d.id
    JOIN sentence_parts sp        ON sp.sentence_id = s.id
    JOIN parts_of_speech part_pos ON sp.part_of_speech_id = part_pos.id
    JOIN sentence_tokens st       ON st.sentence_part_id = sp.id
    JOIN parts_of_speech tok_pos  ON st.part_of_speech_id = tok_pos.id
    ORDER BY
        d.level,
        s.id,
        sp.position,
        st.position

```
