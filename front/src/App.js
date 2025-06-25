import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Divider,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

const choices = ['Pierre', 'Feuille', 'Ciseaux'];
const emojis = {
  Pierre: '🗿',
  Feuille: '📄',
  Ciseaux: '✂️',
};

function App() {
  const [mode, setMode] = useState('solo'); // solo | local
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);

  const handleModeChange = (_, newMode) => {
    if (newMode) {
      setMode(newMode);
      setResult(null);
      setPlayer1Choice(null);
      setPlayer2Choice(null);
    }
  };

  const handlePlaySolo = async (choice) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:5000/play', {
        player_choice: choice,
      });
      setResult(res.data);
    } catch (err) {
      console.error('Erreur côté serveur :', err);
    }
    setLoading(false);
  };

  const handlePlayLocal = async () => {
    if (!player1Choice || !player2Choice) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:5000/play-local', {
        player1_choice: player1Choice,
        player2_choice: player2Choice,
      });
      setResult(res.data);
    } catch (err) {
      console.error('Erreur côté serveur (local) :', err);
    }
    setLoading(false);
  };

  const renderResult = () => {
    if (!result) return null;

    const {
      player_choice,
      bot_choice,
      player1_choice,
      player2_choice,
      player_bit,
      bot_bit,
      player1_bit,
      player2_bit,
      result: outcome,
      circuit_image,
    } = result;

    let message = '';
    if (outcome === 'win') message = '✨ Tu as gagné !';
    else if (outcome === 'lose') message = '😓 Tu as perdu.';
    else if (outcome === 'player1') message = '👤 Joueur 1 gagne !';
    else if (outcome === 'player2') message = '👤 Joueur 2 gagne !';
    else message = '🤝 Égalité parfaite !';

    return (
      <Card variant="outlined" sx={{ mt: 4, bgcolor: '#f9f9f9' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>🎯 Résultat :</Typography>
          <Divider sx={{ mb: 2 }} />
          {mode === 'solo' ? (
            <>
              <Typography>
                🧍‍♂️ Toi : {emojis[player_choice]} {player_choice.toUpperCase()} (bit = {player_bit})
              </Typography>
              <Typography>
                🤖 Bot : {emojis[bot_choice]} {bot_choice.toUpperCase()} (bit = {bot_bit})
              </Typography>
            </>
          ) : (
            <>
              <Typography>
                👤 Joueur 1 : {emojis[player1_choice]} {player1_choice.toUpperCase()} (bit = {player1_bit})
              </Typography>
              <Typography>
                👤 Joueur 2 : {emojis[player2_choice]} {player2_choice.toUpperCase()} (bit = {player2_bit})
              </Typography>
            </>
          )}
          <Box mt={2}>
            <Typography variant="subtitle1">{message}</Typography>
          </Box>

          {circuit_image && (
            <Box mt={3}>
              <Typography variant="subtitle2">🔬 Circuit quantique :</Typography>
              <img src={circuit_image} alt="Quantum Circuit" style={{ width: '100%', maxHeight: 300 }} />
            </Box>
          )}

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
  🧠 <strong>Comment ça marche ?</strong><br /><br />
  Dans ce jeu, chaque joueur choisit entre :<br />
  <ul>
    <li><strong>🗿 Pierre</strong> → représentée par l'état quantique |0⟩</li>
    <li><strong>📄 Feuille</strong> → encodée par une porte X, qui transforme |0⟩ en |1⟩</li>
    <li><strong>✂️ Ciseaux</strong> → encodés en superposition grâce à une porte H (Hadamard), ce qui crée un mélange entre |0⟩ et |1⟩</li>
  </ul>

  💡 Cela signifie que si tu choisis <strong>Ciseaux</strong>, ton qubit est à moitié |0⟩ et à moitié |1⟩ jusqu’à ce qu’on le mesure.<br /><br />

  🧪 <strong>Que fait le programme ?</strong><br />
  - Il transforme ton choix en un état quantique<br />
  - Il mesure les deux qubits (celui du joueur et celui de l'adversaire)<br />
  - Le résultat est un bit classique (0 ou 1), choisi de manière probabiliste si l'état est en superposition<br />
  - On compare ensuite ces bits mesurés pour déterminer le gagnant<br /><br />

  ⚠️ <strong>Important :</strong><br />
  À cause de la nature quantique, même si tu choisis "Ciseaux", tu peux mesurer 0 (comme si tu avais joué "Pierre") ou 1 (comme "Feuille"). C'est cette incertitude qui rend le jeu quantique différent d’un PFC classique.<br /><br />

  🧬 <em>C'est comme si on lançait une pièce : on ne sait pas à l'avance le résultat exact, même si on connaît les règles du jeu !</em>
</Typography>

          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>Pierre-Feuille-Ciseaux Quantique ⚛️</Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleModeChange}
        sx={{ mb: 3 }}
        fullWidth
      >
        <ToggleButton value="solo">Mode Solo</ToggleButton>
        <ToggleButton value="local">Mode 2 Joueurs</ToggleButton>
      </ToggleButtonGroup>

      {mode === 'solo' ? (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>Choisis ton coup :</Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            {choices.map((choice) => (
              <Button
                key={choice}
                variant="contained"
                onClick={() => handlePlaySolo(choice)}
                disabled={loading}
              >
                {emojis[choice]} {choice.toUpperCase()}
              </Button>
            ))}
          </Stack>
        </>
      ) : (
        <>
          <Typography variant="body1">👤 Joueur 1</Typography>
          <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
            {choices.map((choice) => (
              <Button
                key={choice}
                variant={player1Choice === choice ? 'contained' : 'outlined'}
                onClick={() => setPlayer1Choice(choice)}
                disabled={loading}
              >
                {emojis[choice]}
              </Button>
            ))}
          </Stack>

          <Typography variant="body1">👤 Joueur 2</Typography>
          <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
            {choices.map((choice) => (
              <Button
                key={choice}
                variant={player2Choice === choice ? 'contained' : 'outlined'}
                onClick={() => setPlayer2Choice(choice)}
                disabled={loading}
              >
                {emojis[choice]}
              </Button>
            ))}
          </Stack>

          <Button
            variant="contained"
            onClick={handlePlayLocal}
            disabled={!player1Choice || !player2Choice || loading}
          >
            ⚛️ Lancer le duel quantique
          </Button>
        </>
      )}

      {loading && (
        <Box mt={4}>
          <Typography>Mesure quantique en cours...</Typography>
          <CircularProgress />
        </Box>
      )}

      {renderResult()}
    </Container>
  );
}

export default App;
