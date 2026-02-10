'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [playerId, setPlayerId] = useState('');

  const startGame = () => {
    if (!playerId) return;
    router.push(`/game?playerId=${playerId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Trade Game!</h1>
      <input
        type="text"
        placeholder="Enter your player name"
        value={playerId}
        onChange={(e) => setPlayerId(e.target.value)}
        className="border p-2 rounded mb-4"
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={startGame}
      >
        Join Game
      </button>
    </div>
  );
}
