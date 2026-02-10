import { useEffect, useState, useRef } from 'react';

export type GameState = {
  players: Record<string, { points: number }>;
  trades: any[];
  timer: { duration: number | null; startedAt: number | null; pausedAt: number | null; isRunning: boolean };
  spread: number;
};

export function useGame(playerId: string) {
  const [gameStates, setGameStates] = useState<GameState[]>([]);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const connectedRef = useRef(false);

  // Initialize WebSocket once
  useEffect(() => {
    if (connectedRef.current) return; // prevent duplicate connections

    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;

    ws.onopen = () => {
      connectedRef.current = true;
      setConnected(true);
      console.log('WebSocket connected', playerId);

      // Send join immediately
      ws.send(JSON.stringify({ type: 'join', playerId }));
    };

    ws.onmessage = (event) => {
      const newState = JSON.parse(event.data);
      setGameStates((prev) => {
        const last = prev[prev.length - 1];
        if (JSON.stringify(last) === JSON.stringify(newState)) return prev;
        return [...prev, newState];
      });
    };

    ws.onclose = () => {
      connectedRef.current = false;
      setConnected(false);
      console.log('WebSocket disconnected', playerId);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'leave', playerId }));
      }
      ws.close();
      connectedRef.current = false;
    };
  }, [playerId]);

  const send = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected yet:', data);
    }
  };

  return { gameStates, send, connected };
}
