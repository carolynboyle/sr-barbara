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
    cur.execute('''
        SELECT s.id, s.sentence, d.level 
        FROM sentences s
        JOIN difficulty_levels d ON s.difficulty_id = d.id
        WHERE d.level = %s
        ORDER BY RANDOM()
        LIMIT 1
    ''', (difficulty,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row:
        return jsonify({'id': row[0], 'sentence': row[1], 'difficulty': row[2]})
    return jsonify({'error': 'No sentence found'}), 404

if __name__ == '__main__':
    app.run(debug=True)