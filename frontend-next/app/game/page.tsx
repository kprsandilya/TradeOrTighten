'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from 'react-timer-hook';
import { useGame } from '../hooks/useGame';
import GameHistory from './gameHistory';
import GamemasterPanel from './GamemasterDashboard';
import Spread from './Spread';
import { LogOut, Shuffle } from 'lucide-react';

export default function Game() {
  const router = useRouter();

  const [playerId, setPlayerId] = useState<string | null>(null);

  // generate stable playerId on the client
  useEffect(() => {
    setPlayerId(crypto.randomUUID().slice(0, 8));
  }, []);

  // always call useGame, pass playerId as null if not ready
  const { gameStates, send, connected } = useGame(playerId);

const timer = gameStates[gameStates.length - 1]?.timer;
  const [spread, setSpread] = useState(-1);

  const { seconds, minutes, pause, restart } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
  });
    // Timer syncing with backend
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

  // render loading if playerId not yet set
  if (!playerId) return <div>Loading...</div>;

  const leaveGame = () => {
    send({ type: 'leave', playerId });
    router.push('/');
  };

  const makeTrade = () => {
    send({ type: 'trade', trade: { playerId, value: Math.floor(Math.random() * 100) } });
  };

  const setSpreadValue = (value: number) => {
    setSpread(value);
    send({ type: 'spread', playerId, value });
  };

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

          <div className="flex items-center gap-3 text-xs">
            {connected ? <span>Connected</span> : <span>Disconnected</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-4">
          <button onClick={leaveGame} className="btn-secondary">
            <LogOut size={16} /> Leave Game
          </button>
          <button onClick={makeTrade} className="btn-primary">
            <Shuffle size={16} /> Make Trade
          </button>
        </div>

        {/* GameState */}
        <div className="grid gap-4 grid-cols-2">
          <GameHistory playerId={playerId} />
          <div className="grid grid-rows-2 gap-4">
            <GamemasterPanel sendMessage={send} playerId={playerId} />
            <Spread playerId={playerId} sendMessage={send} />
          </div>
        </div>
      </div>
    </div>
  );
}
