import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Chat from './Chat';
import Login from './Login';
import PrivateMessages from './PrivateMessages';
import Register from './Register';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Chat en Temps Réel</h1>
        <Routes>
          {/* Route pour la page de connexion */}
          <Route path="/" element={<Login />} />
          
          {/* Route pour la page du chat */}
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/register" element={<Register />} />

          {/* Route pour la page des MP */}
          <Route path="/private-messages" element={<PrivateMessages />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
