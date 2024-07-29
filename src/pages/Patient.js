import React, { useState, useEffect } from 'react';
import PatientDetails from '../components/PatientDetails';
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import './Patient.css';
import useWebSocket from '../hooks/useWebSocket';
import Chat from '../components/Chat';

function Patient() {
  // State to store the currently selected category
  const [selectedCategory, setSelectedCategory] = useState('Health Summary');
  
  // Custom hook for WebSocket connection
  const { messages, sendMessage, clearMessages } = useWebSocket('ws://localhost:8000/ws_generate_summary');
  
  // State to store summaries for each patient
  const [summaries, setSummaries] = useState({});
  
  // State to store the currently selected patient
  const [selectedPatient, setSelectedPatient] = useState(null);

  // useEffect to log messages whenever they are updated
  useEffect(() => {
    console.log('Messages in Patient component updated:', messages);
  }, [messages]);

  // Handler for selecting a category
  const handleCategorySelect = (categoryName, patientId) => {
    setSelectedCategory(categoryName);
    clearMessages(); // Clear messages on new category selection

    const patientSummaries = summaries[patientId] || {};
    const categorySummary = patientSummaries[categoryName];

    // Send a message if the summary for the selected category is not available
    if (!categorySummary) {
      const message = categoryName === 'Health Summary'
        ? patientId
        : `${patientId}/${categoryName.toLowerCase().replace(' ', '_')}`;
      console.log('Sending category message:', message);
      sendMessage(message);
    }
  };

  // Handler for updating messages
  const handleMessagesUpdate = (newMessages) => {
    setSummaries((prevSummaries) => {
      const updatedSummaries = { ...prevSummaries };
      if (selectedPatient) {
        if (!updatedSummaries[selectedPatient]) {
          updatedSummaries[selectedPatient] = {};
        }
        updatedSummaries[selectedPatient][selectedCategory] = newMessages;
      }
      return updatedSummaries;
    });
  };

  // Handler for changing the selected patient
  const handlePatientChange = (patientId) => {
    setSelectedPatient(patientId);
    setSelectedCategory('Health Summary');
    setSummaries((prevSummaries) => {
      if (!prevSummaries[patientId]) {
        prevSummaries[patientId] = {};
      }
      return prevSummaries;
    });
    clearMessages();
    sendMessage(patientId);
  };

  return (
    <Box className="patient-page">
      <Sidebar onCategorySelect={handleCategorySelect} onPatientChange={handlePatientChange} className="sidebar" />
      <Box className="main-content">
        <PatientDetails selectedCategory={selectedCategory} messages={messages} />
      </Box>
      <Chat />
    </Box>
  );
}

export default Patient;
