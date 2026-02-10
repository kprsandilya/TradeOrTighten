import { useEffect, useState, useRef } from 'react';

export type GameState = {
  players: Record<string, { points: number }>;
  trades: any[];
  timer: { duration: number | null; startedAt: number | null; pausedAt: number | null; isRunning: boolean };
  spread: number;
};

export function useGame(playerId: string) {
    // Store an array of game states
    const [gameStates, setGameStates] = useState<GameState[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const [connected, setConnected] = useState(false);
    const connectedRef = useRef(false);

    useEffect(() => {
        if (connectedRef.current) return; // skip if already connected

        wsRef.current = new WebSocket('ws://localhost:8080');

        wsRef.current.onopen = () => {
            connectedRef.current = true;
            wsRef.current?.send(JSON.stringify({ type: 'join', playerId }));
        };

        wsRef.current.onmessage = (event) => {
            const newState = JSON.parse(event.data);
            setGameStates((prev) => {
                const last = prev[prev.length - 1];
                if (JSON.stringify(last) === JSON.stringify(newState)) return prev;
                return [...prev, newState];
            });
        };

        return () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'leave', playerId }));
        }
        wsRef.current?.close();
        };
    }, [playerId]);

  const send = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  };

  return { gameStates, send, connected };
}
