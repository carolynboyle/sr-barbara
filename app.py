from flask import Flask, jsonify, render_template, request
import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        database=os.getenv('DB_NAME', 'sr_barbara'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', '')
    )
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/sentence')
def get_sentence():
    difficulty = request.args.get('difficulty', 'medium')
    conn = get_db_connection()
    cur = conn.cursor()

    # Get a random sentence at the requested difficulty
    if difficulty == 'any':
        cur.execute('''
            SELECT s.id, d.level
            FROM sentences s
            JOIN difficulty_levels d ON s.difficulty_id = d.id
            ORDER BY RANDOM()
            LIMIT 1
        ''')
    else:
        cur.execute('''
            SELECT s.id, d.level
            FROM sentences s
            JOIN difficulty_levels d ON s.difficulty_id = d.id
            WHERE d.level = %s
            ORDER BY RANDOM()
            LIMIT 1
        ''', (difficulty,))
    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return jsonify({'error': 'No sentence found'}), 404

    sentence_id, level = row

    # Get all tokens for this sentence ordered by part position then token position.
    # part_position is included so the frontend can distinguish multiple
    # prepositional phrases (or any repeated phrase role) from each other.
    cur.execute('''
        SELECT
            st.id,
            st.token,
            tok_pos.name   AS token_pos,
            part_pos.name  AS part_role,
            sp.position    AS part_position,
            st.position    AS token_position
        FROM sentence_tokens st
        JOIN sentence_parts sp      ON st.sentence_part_id = sp.id
        JOIN parts_of_speech tok_pos  ON st.part_of_speech_id = tok_pos.id
        JOIN parts_of_speech part_pos ON sp.part_of_speech_id = part_pos.id
        WHERE sp.sentence_id = %s
        ORDER BY sp.position, st.position
    ''', (sentence_id,))

    token_rows = cur.fetchall()
    cur.close()
    conn.close()

    tokens = []
    sentence_text = ''
    for t in token_rows:
        tok_id, word, token_pos, part_role, part_position, tok_position = t
        tokens.append({
            'id':            tok_id,
            'word':          word,
            'pos':           token_pos,    # word-level role (article, subject, verb…)
            'part_role':     part_role,    # phrase-level role (subject, verb, prepositional_phrase…)
            'part_position': part_position # position of this phrase in the sentence (1, 2, 3…)
        })
        sentence_text += word + ' '

    return jsonify({
        'id':         sentence_id,
        'sentence':   sentence_text.strip(),
        'difficulty': level,
        'tokens':     tokens
    })

if __name__ == '__main__':
    app.run(debug=True)
