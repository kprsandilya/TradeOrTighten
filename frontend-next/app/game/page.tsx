'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from 'react-timer-hook';
import { useGame } from '../hooks/useGame';
import GameHistory from './gameHistory';
import GamemasterPanel from './GamemasterDashboard';
import { LogOut, Shuffle, Wifi, WifiOff } from 'lucide-react';

function makeId(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function Game() {
  const router = useRouter();
    const [playerId, setPlayerId] = useState<string>("asdf");

  useEffect(() => {
    setPlayerId(crypto.randomUUID().slice(0, 8));
  }, []);

  const { gameStates, send, connected } = useGame(playerId);
  const timer = gameStates[gameStates.length - 1]?.timer;

  const [spread, setSpread] = useState(-1);

  const { seconds, minutes, pause, restart } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
  });

  // Join the game once connected
  useEffect(() => {
    if (connected) {
      send({ type: 'join', playerId });
    }
    console.log("HERE" + connected)
  }, [connected, send, playerId]);

  // Update the timer display based on backend
  useEffect(() => {
    if (!timer) return;

    if (!timer.startedAt && !timer.isRunning && timer.duration === null) {
      pause();
      restart(new Date(), false);
      return;
    }

    if (!timer.isRunning && timer.duration! > 0) {
      pause();
      return;
    }

    if (timer.startedAt) {
      const expiry = new Date(timer.startedAt + timer.duration! * 1000);
      restart(expiry, true);
    }
  }, [timer, pause, restart]);

  const leaveGame = () => {
    send({ type: 'leave', playerId });
    router.push('/');
  };

  const makeTrade = () =>
    send({ type: 'trade', trade: { playerId, value: Math.floor(Math.random() * 100) } });

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-wider text-foreground">
              TRADE<span className="text-primary">GAME</span>
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Player <span className="font-mono text-primary">{playerId}</span>
            </p>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-3 text-xs">
            {!connected ? (
              <div className="flex items-center gap-1.5 text-primary">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <Wifi size={14} />
                <span className="text-muted-foreground">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-destructive">
                <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <WifiOff size={14} />
                <span className="text-muted-foreground">Disconnected</span>
              </div>
            )}
          </div>
        </div>

        {/* Timer */}
        <h2 className="text-2xl font-bold mb-2">
          Timer: {minutes}:{seconds.toString().padStart(2, '0')}
        </h2>

        {/* Actions */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={leaveGame}
            className="flex items-center gap-2 rounded-md bg-secondary py-2.5 px-2 text-sm font-medium neon-soft-border text-secondary-foreground hover:bg-secondary/70 transition"
          >
            <LogOut size={16} /> Leave Game
          </button>
          <button
            onClick={makeTrade}
            className="flex items-center gap-2 rounded-md bg-primary/10 py-2.5 px-2 text-sm font-medium text-primary neon-soft-border hover:bg-primary/20 transition"
          >
            <Shuffle size={16} /> Make Trade
          </button>
        </div>

        {/* GameState History + Gamemaster Panel */}
        <div className="grid gap-4 grid-cols-2">
          <GameHistory playerId={playerId} />
          <GamemasterPanel sendMessage={send} playerId={playerId} />
        </div>
      </div>
    </div>
  );
}
