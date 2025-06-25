from flask import Flask, jsonify, request
from flask_cors import CORS
from quantum_rps import play_quantum_rps
from quantum_rps import play_quantum_rps, play_quantum_local

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route('/play', methods=['POST'])
def play():
    data = request.get_json()
    player_choice = data.get("player_choice")
    result = play_quantum_rps(player_choice)
    return jsonify(result)

@app.route('/play-local', methods=['POST'])
def play_local():
    data = request.get_json()
    p1 = data.get("player1_choice")
    p2 = data.get("player2_choice")
    result = play_quantum_local(p1, p2)
    return jsonify(result)