'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from 'react-timer-hook';
import { useGame } from '../hooks/useGame';
import GameHistory from './gameHistory';

type GamemasterDashboardProps = {
  send: (data: any) => void;
  playerId: string;
};

function GamemasterDashboard({ send, playerId }: GamemasterDashboardProps) {
  return (
    <div className="mt-6 space-y-2">
      <h2 className="text-xl font-bold">Gamemaster Dashboard</h2>
      <div className="flex flex-wrap gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => {
            send({ type: 'gamemaster', fn: 'bonusPoints', args: [playerId, 50]})
            }
        }
        >
          Give 50 Points
        </button>
        <button
          className="px-3 py-1 bg-green-500 text-white rounded"
          onClick={() => send({ type: 'timer', action: 'start', duration: 600 })}
        >
          Start Timer
        </button>
        <button
          className="px-3 py-1 bg-yellow-500 text-white rounded"
          onClick={() => send({ type: 'timer', action: 'pause' })}
        >
          Pause Timer
        </button>
        <button
          className="px-3 py-1 bg-green-400 text-white rounded"
          onClick={() => send({ type: 'timer', action: 'resume' })}
        >
          Resume Timer
        </button>
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded"
          onClick={() => send({ type: 'timer', action: 'reset' })}
        >
          Reset Timer
        </button>
      </div>
    </div>
  );
}

function makeId(length: number) {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function Game() {
  const router = useRouter();
  const [playerId] = useState(makeId(8));
  const { gameStates, send, connected } = useGame(playerId);
  const timer = (gameStates[gameStates.length - 1])?.timer;

  const [spread, setSpread] = useState(-1);

  const { seconds, minutes, pause, restart } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
  });

    useEffect(() => {
        if (connected) {
            send({ type: 'join', playerId });
        }
    }, [connected]);

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

  const sendSpread = () => {
    send({ type: 'action', spread });
    router.push('/');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Trade Game</h1>
      <div className="flex gap-2 mb-4">
        <button className="px-3 py-1 bg-gray-500 text-white rounded" onClick={leaveGame}>
          Leave Game
        </button>
        <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={makeTrade}>
          Make Trade
        </button>
      </div>

      <GameHistory playerId={playerId}/>

      <h2 className="text-2xl font-bold mb-2">
        Timer: {minutes}:{seconds.toString().padStart(2, '0')}
      </h2>

      <GamemasterDashboard send={send} playerId={playerId} />
    </div>
  );
}
