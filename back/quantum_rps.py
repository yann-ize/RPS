from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.visualization import circuit_drawer
import random
import uuid
import os

# Associe les choix texte à une logique quantique
def apply_choice(qc, qubit, choice):
    if choice == "Pierre":       # |0⟩
        pass
    elif choice == "Feuille":    # |1⟩ via porte X
        qc.x(qubit)
    elif choice == "Ciseaux": # superposition via H
        qc.h(qubit)

# Génère une image du circuit quantique
def save_circuit_image(qc):
    filename = f"static/circuit_{uuid.uuid4().hex}.png"
    path = os.path.join(os.path.dirname(__file__), filename)
    qc.draw(output="mpl", filename=path)
    return filename

# Mode solo : joueur vs bot
def play_quantum_rps(player_choice):
    bot_choice = random.choice(["Pierre", "Feuille", "Ciseaux"])

    qc = QuantumCircuit(2, 2)
    apply_choice(qc, 0, player_choice)
    apply_choice(qc, 1, bot_choice)
    qc.measure([0, 1], [0, 1])

    image_path = save_circuit_image(qc)

    sim = AerSimulator()
    compiled = transpile(qc, sim)
    result = sim.run(compiled, shots=1).result()
    counts = result.get_counts()

    outcome = list(counts.keys())[0]
    player_bit = int(outcome[1])
    bot_bit = int(outcome[0])

    # Logique de victoire quantique
    if player_bit == bot_bit:
        verdict = "draw"
    elif (player_bit, bot_bit) in [(0, 1), (1, 2), (2, 0)]:
        verdict = "lose"
    else:
        verdict = "win"

    return {
        "player_choice": player_choice,
        "bot_choice": bot_choice,
        "player_bit": player_bit,
        "bot_bit": bot_bit,
        "result": verdict,
        "circuit_image": f"http://localhost:5000/{image_path}"
    }

# Mode local : joueur 1 vs joueur 2
def play_quantum_local(player1_choice, player2_choice):
    qc = QuantumCircuit(2, 2)
    apply_choice(qc, 0, player1_choice)
    apply_choice(qc, 1, player2_choice)
    qc.measure([0, 1], [0, 1])

    image_path = save_circuit_image(qc)

    sim = AerSimulator()
    compiled = transpile(qc, sim)
    result = sim.run(compiled, shots=1).result()
    counts = result.get_counts()

    outcome = list(counts.keys())[0]
    player1_bit = int(outcome[1])  # qubit 0
    player2_bit = int(outcome[0])  # qubit 1

    # Logique de victoire
    if player1_bit == player2_bit:
        verdict = "draw"
    elif (player1_bit, player2_bit) in [(0, 1), (1, 2), (2, 0)]:
        verdict = "player2"
    else:
        verdict = "player1"

    return {
        "player1_choice": player1_choice,
        "player2_choice": player2_choice,
        "player1_bit": player1_bit,
        "player2_bit": player2_bit,
        "result": verdict,
        "circuit_image": f"http://localhost:5000/{image_path}"
    }
