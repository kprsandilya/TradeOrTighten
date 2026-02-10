import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import useWebSocket from './hooks/useWebSocket';

function GamemasterDashboard({ sendMessage }) {
  const triggerBonus = () => sendMessage({ type: 'gamemaster', fn: 'bonusPoints', args: ['player1', 50] });
  const triggerCrash = () => sendMessage({ type: 'gamemaster', fn: 'marketCrash', args: [] });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">Gamemaster Dashboard</Typography>
      <Button variant="contained" sx={{ mr: 2 }} onClick={triggerBonus}>Give 50 Points</Button>
      <Button variant="contained" color="error" onClick={triggerCrash}>Market Crash</Button>
    </Box>
  );
}

function App() {
  const { messages, sendMessage } = useWebSocket('ws://localhost:8080');
  const [playerId] = useState('player1');

  const joinGame = () => sendMessage({ type: 'join', playerId });
  const makeTrade = () => sendMessage({ type: 'trade', trade: { playerId, value: Math.floor(Math.random() * 100) } });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Trade Game</Typography>
      <Button variant="contained" onClick={joinGame} sx={{ mr: 2 }}>Join Game</Button>
      <Button variant="contained" color="secondary" onClick={makeTrade}>Make Trade</Button>

      <Paper sx={{ mt: 4, p: 2, maxHeight: 300, overflow: 'auto' }}>
        <Typography variant="h6">Game State Updates:</Typography>
        {messages.map((msg, i) => <pre key={i}>{JSON.stringify(msg, null, 2)}</pre>)}
      </Paper>

      <GamemasterDashboard sendMessage={sendMessage} />
    </Box>
  );
}

export default App;
