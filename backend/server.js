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
    isRunning: false,
  },
  spread: 0,
};

// --- Gamemaster functions ---
const gamemasterFunctions = {
  bonusPoints: (playerId, amount) => {
    if (!playerId || typeof amount !== 'number') {
      console.log('Invalid bonusPoints args', playerId, amount);
      return;
    }
    if (!gameState.players[playerId]) {
      console.log('Player not found:', playerId);
      return;
    }
    gameState.players[playerId].points += amount;
    console.log(`Gave ${amount} points to ${playerId}`);
  },
};

// --- Broadcast helper ---
function broadcastState() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(gameState));
    }
  });
}

// --- Handle connections ---
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (err) {
      console.error('Invalid JSON:', msg);
      return;
    }

    switch (data.type) {
      case 'join':
        if (data.playerId && !gameState.players[data.playerId]) {
          gameState.players[data.playerId] = { points: 0 };
          ws.playerId = data.playerId;
          console.log('Player joined:', data.playerId);
        }
        break;

      case 'leave':
        if (data.playerId && gameState.players[data.playerId]) {
          delete gameState.players[data.playerId];
          console.log('Player left:', data.playerId);
        }
        break;

      case 'trade':
        if (data.trade) {
          gameState.trades.push(data.trade);
          console.log('Trade added:', data.trade);
        }
        break;

      case 'gamemaster':
        if (data.fn && gamemasterFunctions[data.fn]) {
          try {
            gamemasterFunctions[data.fn](...(data.args || []));
          } catch (err) {
            console.error('Error executing gamemaster function:', err);
          }
        } else {
          console.log('Unknown gamemaster function:', data.fn);
        }
        break;

      case 'timer':
        handleTimer(data);
        break;

      case 'action':
        if (data.spread !== undefined) {
          gameState.spread = data.spread;
        }
        break;

      default:
        console.log('Unknown message type:', data.type);
    }

    // Broadcast updated state to all clients
    broadcastState();
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (ws.playerId && gameState.players[ws.playerId]) {
      delete gameState.players[ws.playerId];
      console.log('Player removed:', ws.playerId);
      broadcastState(); // update other clients
    }
  });
});

// --- Timer logic ---
function handleTimer(data) {
  const now = Date.now();

  switch (data.action) {
    case 'start':
      gameState.timer = {
        duration: data.duration || 0,
        startedAt: now,
        pausedAt: null,
        isRunning: true,
      };
      console.log('Timer started:', gameState.timer.duration);
      break;

    case 'pause':
      if (gameState.timer.isRunning && gameState.timer.startedAt) {
        const elapsed = (now - gameState.timer.startedAt) / 1000;
        const remaining = Math.max(gameState.timer.duration - elapsed, 0);
        gameState.timer = {
          duration: remaining,
          startedAt: null,
          pausedAt: now,
          isRunning: false,
        };
        console.log('Timer paused, remaining:', remaining);
      }
      break;

    case 'resume':
      if (!gameState.timer.isRunning && gameState.timer.duration) {
        gameState.timer.startedAt = now;
        gameState.timer.pausedAt = null;
        gameState.timer.isRunning = true;
        console.log('Timer resumed');
      }
      break;

    case 'reset':
      gameState.timer = {
        duration: null,
        startedAt: null,
        pausedAt: null,
        isRunning: false,
      };
      console.log('Timer reset');
      break;

    default:
      console.log('Unknown timer action:', data.action);
  }
}

console.log(`WebSocket server running on ws://localhost:${PORT}`);
