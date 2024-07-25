import { useEffect, useRef, useState, useCallback } from 'react';

const useWebSocket = (url, reconnectInterval = 5000) => {
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);
  const reconnectTimeout = useRef(null);
  const isConnected = useRef(false); // Track connection status

  const connect = useCallback(() => {
    if (isConnected.current) return; // Prevent multiple connections

    console.log('Attempting to connect to WebSocket...');
    socket.current = new WebSocket(url);

    socket.current.onopen = () => {
      console.log('WebSocket connection established');
      isConnected.current = true; // Mark as connected
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    };

    socket.current.onmessage = (event) => {
      console.log('Received WebSocket message:', event.data);
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, event.data];
        console.log('Updated messages:', newMessages);
        return newMessages;
      });
    };

    socket.current.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      isConnected.current = false; // Mark as disconnected
      if (!reconnectTimeout.current) {
        reconnectTimeout.current = setTimeout(() => connect(), reconnectInterval);
      }
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      socket.current.close();
    };
  }, [url, reconnectInterval]);

  useEffect(() => {
    connect();

    return () => {
      if (socket.current) {
        socket.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      isConnected.current = false; // Ensure disconnection status
    };
  }, [connect]);

  const sendMessage = (message) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      console.log('Sending WebSocket message:', message);
      socket.current.send(message);
    } else {
      console.log('WebSocket not open. Message not sent:', message);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return { messages, sendMessage, clearMessages };
};

export default useWebSocket;
