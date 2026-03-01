-- Sr. Barbara's Class — sentences_view.sql
-- Creates a view for easy inspection of sentence content.
-- Run with: psql -U postgres -d sr_barbara -f db/sentences_view.sql
--
-- After creating, query it with:
--   SELECT * FROM v_sentences ORDER BY sentence_id, part_position, token_position;
-- Or to see just the sentences:
--   SELECT DISTINCT sentence_id, difficulty, sentence_text FROM v_sentences ORDER BY sentence_id;

DROP VIEW IF EXISTS v_sentences;

CREATE VIEW v_sentences AS
SELECT
    s.id                  AS sentence_id,
    d.level               AS difficulty,
    sp.position           AS part_position,
    part_pos.name         AS part_role,
    st.position           AS token_position,
    tok_pos.name          AS token_pos,
    st.token,
    -- Reconstruct full sentence text for convenience
    string_agg(st.token, ' ')
        OVER (PARTITION BY s.id
              ORDER BY sp.position, st.position
              ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
                            AS sentence_text
FROM sentences s
JOIN difficulty_levels d      ON s.difficulty_id       = d.id
JOIN sentence_parts sp        ON sp.sentence_id        = s.id
JOIN parts_of_speech part_pos ON sp.part_of_speech_id  = part_pos.id
JOIN sentence_tokens st       ON st.sentence_part_id   = sp.id
JOIN parts_of_speech tok_pos  ON st.part_of_speech_id  = tok_pos.id
ORDER BY s.id, sp.position, st.position;