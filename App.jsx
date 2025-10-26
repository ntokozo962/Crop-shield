// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './pages/Dashboard';
import ScanHistory from './pages/ScanHistory';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Weather from './pages/Weather';
import Pricing from './pages/Pricing';
import PestScanner from './components/PestScanner'; // ✅ Imported
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
          <Navbar />
          <Routes>
            {/* Keep Hero on home route */}
            <Route path="/" element={<Hero />} />
            
            {/* New route for AI Pest Scanner */}
            <Route path="/scanner" element={<PestScanner />} />
            
            {/* Existing routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<ScanHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;