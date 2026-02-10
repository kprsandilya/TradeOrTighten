'use client';
import { useGame } from '../hooks/useGame';

export default function GameHistory({ playerId }: { playerId: string }) {
  const { gameStates, send, connected } = useGame(playerId);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Game State History</h1>

      <div className="space-y-4 max-h-96 overflow-auto border p-2 rounded bg-white">
        {gameStates.map((state, index) => (
          <pre key={index} className="bg-gray-100 p-2 rounded">
            {JSON.stringify(state, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  );
}
