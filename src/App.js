import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Patient from './pages/Patient';
import ReactQueryProvider from './ReactQueryProvider';
import './App.css';


function App() {
  return (
    <ReactQueryProvider>
      <Router>
        <div className="app">
          <Header />
          <div className="main-container">
            <Routes>
              <Route path="/" element={<Patient />} />
              <Route path="/patient/:id" element={<Patient />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ReactQueryProvider>
  );
}

export default App;
