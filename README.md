RPS Pierre-Feuille-Ciseaux

Ce projet est une version du jeu **Pierre-Feuille-Ciseaux** utilisant l'informatique quantique avec **Qiskit**.

Chaque joueur (toi et le bot ou un autre joueur) joue un coup qui est converti en une opération sur un **qubit**. Le circuit quantique est mesuré pour déterminer le gagnant.

---

## 🔧 Installation

### 1. Cloner le projet

git clone https://github.com/yann-ize/RPS.git
cd RPS

2. Installer et lancer le backend (Flask)
bash
Copy
Edit
cd back
python3 -m venv quantum
source quantum/bin/activate
pip install -r requirements.txt
flask --app app.py --debug run

Le serveur tourne sur http://localhost:5000

4. Installer et lancer le frontend (React)
Dans un autre terminal :

cd front
npm install
npm start

L'application s'ouvre sur http://localhost:3000

🧠 Fonctionnement quantique
Pierre → état initial |0⟩ (aucune porte appliquée)

Feuille → applique une porte X (passe à |1⟩)

Ciseaux → applique une porte H (superposition de |0⟩ et |1⟩)

Deux qubits sont utilisés : un pour chaque joueur.
Après les opérations, on effectue une mesure et on compare les résultats pour déterminer :

Égalité si les deux qubits donnent le même résultat

Sinon, application des règles classiques de Pierre-Feuille-Ciseaux

Une image du circuit quantique est générée à chaque partie.

📸 Exemple de circuit
L'application génère un fichier image du circuit quantique joué (stocké dans /static), et il est affiché sur l'interface.

