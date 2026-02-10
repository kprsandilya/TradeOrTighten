const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

let gameState = {
  players: {},
  trades: [],
  timer: {
    duration: null,
    startedAt: null,
    pausedAt: null,
    isRunning: false
  },
  spread: 0,
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
    } else if (data.type === 'leave') {
        delete gameState.players[data.playerId];
    } else if (data.type === 'gamemaster') {
      const fn = gamemasterFunctions[data.fn];
      if (fn) fn(...data.args);
    } 
    
    else if (data.type === 'timer') {
      const now = Date.now();

      if (data.action === 'start') {
        gameState.timer = {
          duration: data.duration,     // seconds
          startedAt: now,
          pausedAt: null,
          isRunning: true
        };
      }

      if (data.action === 'pause' && gameState.timer.isRunning) {
        const elapsed = (now - gameState.timer.startedAt) / 1000;
        const remaining = gameState.timer.duration - elapsed;

        gameState.timer = {
          duration: Math.max(remaining, 0),
          startedAt: null,
          pausedAt: now,
          isRunning: false
        };
      }

      if (data.action === 'resume' && !gameState.timer.isRunning) {
        gameState.timer.startedAt = now;
        gameState.timer.pausedAt = null;
        gameState.timer.isRunning = true;
      }

      if (data.action === 'reset') {
        gameState.timer = {
          duration: null,
          startedAt: null,
          pausedAt: null,
          isRunning: false
        };
      }
    }

    // else if (data.type === 'action') {
    //   const now = Date.now();

    //   if (data.action === 'spread') {
    //     gameState.spread = Math.min(gameState.spread, data.spread)
    //   }

    //   if (data.action === 'pause' && gameState.timer.isRunning) {
    //     const elapsed = (now - gameState.timer.startedAt) / 1000;
    //     const remaining = gameState.timer.duration - elapsed;

    //     gameState.timer = {
    //       duration: Math.max(remaining, 0),
    //       startedAt: null,
    //       pausedAt: now,
    //       isRunning: false
    //     };
    //   }

    //   if (data.action === 'resume' && !gameState.timer.isRunning) {
    //     gameState.timer.startedAt = now;
    //     gameState.timer.pausedAt = null;
    //     gameState.timer.isRunning = true;
    //   }

    //   if (data.action === 'reset') {
    //     gameState.timer = {
    //       duration: null,
    //       startedAt: null,
    //       pausedAt: null,
    //       isRunning: false
    //     };
    //   }
    // }

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(gameState));
      }
    });
  });

    ws.on('close', () => {
      console.log("Client Disconnected")
      if (ws.playerId) {
        delete gameState.players[ws.playerId];
      }
    });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
