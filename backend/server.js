const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

let gameState = {
  players: {},
  trades: []
};

const gamemasterFunctions = {
  bonusPoints: (playerId, amount) => {
    if (gameState.players[playerId]) {
      gameState.players[playerId].points += amount;
    }
  },
  marketCrash: () => {
    gameState.trades.forEach(trade => trade.value *= 0.5);
  }
};

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', msg => {
    const data = JSON.parse(msg);

    if (data.type === 'join') {
      gameState.players[data.playerId] = { points: 0 };
    } else if (data.type === 'trade') {
      gameState.trades.push(data.trade);
    } else if (data.type === 'gamemaster') {
      const fn = gamemasterFunctions[data.fn];
      if (fn) fn(...data.args);
    }

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(gameState));
      }
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
