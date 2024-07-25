import React, { useState, useEffect } from 'react';
import './PatientDetails.css';

function PatientDetails({ selectedCategory, messages }) {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    console.log('Messages useEffect triggered with:', messages);
    if (messages.length > 0) {
      const latestMessage = messages.join(''); // Join messages into a single string
      console.log('Appending message to summary:', latestMessage);
      setSummary((prevSummary) => {
        const newSummary = `${latestMessage}`;
        console.log('Updated summary:', newSummary);
        return newSummary;
      });
    } else {
      console.log('No messages to append');
    }
  }, [messages]);

  useEffect(() => {
    console.log('Category changed to:', selectedCategory);
    setSummary(''); // Reset the summary when the category changes
  }, [selectedCategory]);

  return (
    <div className="patient-details">
      <h2>{selectedCategory}</h2>
      <div className="summary-content">
        {messages.length === 0 ? (
          <p>Select a patient to get summary</p>
        ) : (
          summary.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))
        )}
      </div>
    </div>
  );
}

export default PatientDetails;
