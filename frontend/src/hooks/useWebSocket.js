import { useState, useEffect, useRef } from 'react';

export default function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setConnected(true)
      console.log('Connected to WebSocket server');
    }
    ws.current.onmessage = (event) => {
      setMessages(prev => [...prev, JSON.parse(event.data)]);
    };
    ws.current.onclose = () => console.log('WebSocket closed');

    return () => ws.current.close();
  }, [url]);

  const sendMessage = (msg) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  };

  return { messages, sendMessage, connected };
}
