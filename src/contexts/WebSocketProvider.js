import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, url }) => {
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);
  const reconnectTimeout = useRef(null);
  const isConnected = useRef(false);

  const connect = useCallback(() => {
    if (isConnected.current) return;

    console.log('Attempting to connect to WebSocket...');
    socket.current = new WebSocket(url);

    socket.current.onopen = () => {
      console.log('WebSocket connection established');
      isConnected.current = true;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    };

    socket.current.onmessage = (event) => {
      console.log('Received WebSocket message:', event.data);
      setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    };

    socket.current.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      isConnected.current = false;
      if (!reconnectTimeout.current) {
        reconnectTimeout.current = setTimeout(() => connect(), 5000);
      }
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      socket.current.close();
    };
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      if (socket.current) {
        socket.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      isConnected.current = false;
    };
  }, [connect]);

  const sendMessage = (message) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(message));
    } else {
      console.log('WebSocket not open. Message not sent:', message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
