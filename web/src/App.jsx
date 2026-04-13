import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';

function App() {
    // 1. Initialize state strictly
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        if (!saved || saved === "undefined") return null;
        try {
            return JSON.parse(saved);
        } catch (e) {
            return null;
        }
    });

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        localStorage.clear(); // Clears user and token at once
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route 
                    path="/login" 
                    element={user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
                />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route 
                    path="/dashboard" 
                    element={user ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
                />
                <Route 
                    path="/deposit" 
                    element={user ? <Deposit onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
                />

                {/* Root & Catch-all */}
                <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;