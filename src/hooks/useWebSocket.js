import { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';

export function useWebSocket(channel) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const { token } = useSelector((state) => state.auth);

  const connect = useCallback(() => {
    if (!token) return;

    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001';
    socketRef.current = new WebSocket(`${wsUrl}?token=${token}`);

    socketRef.current.onopen = () => {
      setIsConnected(true);
      // Subscribe to channel
      if (channel) {
        socketRef.current.send(JSON.stringify({
          type: 'subscribe',
          channel: channel
        }));
      }
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages(prev => [...prev, data]);
        
        // Handle specific message types
        if (data.type === 'device-update') {
          // Dispatch to Redux or handle accordingly
          window.dispatchEvent(new CustomEvent('deviceUpdate', { detail: data.payload }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(connect, 5000);
    };
  }, [token, channel]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      if (channel) {
        socketRef.current.send(JSON.stringify({
          type: 'unsubscribe',
          channel: channel
        }));
      }
      socketRef.current.close();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, [channel]);

  const sendMessage = useCallback((data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, [isConnected]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    messages,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
}
