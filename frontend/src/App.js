import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register'
import './App.css'

const App = () => {
  return (
    <AuthProvider>
      <Router>
      <Routes>
          <Route path="/" element={<Login />} /> {/* Updated syntax */}
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} /> {/* Updated syntax */}
      </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
