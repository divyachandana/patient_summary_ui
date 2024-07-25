import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const websocketRef = useRef(null);

  useEffect(() => {
    websocketRef.current = new WebSocket('ws://localhost:8000/ws');

    websocketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocketRef.current.onmessage = (event) => {
      const message = event.data;
      setMessages(prevMessages => [...prevMessages, { text: message, type: 'received' }]);
    };

    websocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    setMessages(prevMessages => [...prevMessages, { text: newMessage, type: 'user' }]);
    websocketRef.current.send(newMessage);
    setNewMessage('');
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
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
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
        />
        <button onClick={handleSendMessage} style={{ display: 'none' }}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
