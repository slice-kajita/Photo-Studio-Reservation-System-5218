import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import EmailJSSetupPage from './pages/EmailJSSetupPage';
import './App.css';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'authenticated') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('adminAuth', 'authenticated');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <Home />
            </>
          } />
          <Route path="/booking" element={
            <>
              <Header />
              <Booking />
            </>
          } />
          <Route path="/confirmation" element={
            <>
              <Header />
              <BookingConfirmation />
            </>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            isAdminAuthenticated ? (
              <Admin onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          } />
          
          {/* EmailJS Setup Route */}
          <Route path="/emailjs-setup" element={
            isAdminAuthenticated ? (
              <EmailJSSetupPage />
            ) : (
              <Navigate to="/admin" replace />
            )
          } />
          
          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;