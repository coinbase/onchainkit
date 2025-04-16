import { useEffect, useRef } from 'react';

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000;
const WEBSOCKET_URL = 'ws://localhost:3333';

export function useWebsocket() {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let reconnectAttempts = 0;

    function connectWebSocket() {
      wsRef.current = new WebSocket(WEBSOCKET_URL);

      wsRef.current.onclose = () => {
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          console.log('WebSocket closed, reconnecting...');
          reconnectAttempts++;
          setTimeout(connectWebSocket, RECONNECT_DELAY);
        }
      };

      wsRef.current.onerror = (err) => {
        console.error('WebSocket error:', err);
      };
    }

    connectWebSocket();

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return wsRef.current;
}
