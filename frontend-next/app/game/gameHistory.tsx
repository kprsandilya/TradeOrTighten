'use client';
import { useGame } from '../hooks/useGame';

export default function GameHistory({ playerId }: { playerId: string }) {
  const { gameStates, send, connected } = useGame(playerId);

  return (
    <div className="grid-cols-full">
      <div className="py-4 max-w-2xl mx-auto neon-border rounded-lg">
        <div className="px-4">
          <h1 className="text-2xl font-display font-bold mb-4">
            Trade History
          </h1>

          <div className="space-y-2 max-h-96 overflow-auto border border-border rounded-lg bg-panel p-3 font-mono text-sm text-foreground scanlines">
            {gameStates.map((state, index) => (
              <pre key={index} className="bg-panel/50 p-2 rounded">
                {JSON.stringify(state, null, 2)}
              </pre>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
