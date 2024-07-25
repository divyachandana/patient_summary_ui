import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const websocketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const RECONNECT_INTERVAL = 5000; // 5 seconds

  const getTimeStamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const connectWebSocket = () => {
    websocketRef.current = new WebSocket('ws://localhost:8000/ws');

    websocketRef.current.onopen = () => {
      console.log('WebSocket connection established');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };



    websocketRef.current.onmessage = (event) => {
        const message = event.data;
        console.log('Received message chunk:', message);
        
        setMessages(prevMessages => {
          const lastMessage = prevMessages.length > 0 ? prevMessages[prevMessages.length - 1] : null;
      
          if (lastMessage && lastMessage.type === 'received' && !lastMessage.complete) {
            // Update the last message's text by appending the new chunk
            const updatedText = lastMessage.text + message;
            return [...prevMessages.slice(0, -1), { ...lastMessage, text: updatedText }];
          }
      
          // Add the new message chunk as a new message
          return [...prevMessages, { text: message, type: 'received', timestamp: getTimeStamp(), complete: false }];
        });
      };

    websocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      scheduleReconnect();
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      websocketRef.current.close();
    };
  };

  const scheduleReconnect = () => {
    if (!reconnectTimeoutRef.current) {
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect to WebSocket...');
        connectWebSocket();
      }, RECONNECT_INTERVAL);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    setMessages(prevMessages => [...prevMessages, { text: newMessage, type: 'user', timestamp: getTimeStamp() }]);
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(newMessage);
    }
    setNewMessage('');
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">Chat</div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type}`}>
            {message.text}
            <div className="chat-timestamp">{message.timestamp}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
        />
        <button onClick={handleSendMessage} style={{ display: 'none' }}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
