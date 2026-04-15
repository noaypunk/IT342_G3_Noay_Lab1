import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Style Imports
import './App.css'; 

// Component Imports
import Navbar from './components/Navbar'; 

// Page Imports
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';

// 1. Create a Layout component to keep the UI consistent
const ProtectedLayout = ({ user, handleLogout }) => {
    // If no user, kick them to login
    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="container">
            <Navbar onLogout={handleLogout} />
            <main className="dashboard-content">
                {/* Outlet renders the specific page (Dashboard or Deposit) */}
                <Outlet /> 
            </main>
        </div>
    );
};

function App() {
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
        localStorage.clear();
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes - No Navbar here */}
                <Route 
                    path="/login" 
                    element={user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
                />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes - Wrapped in ProtectedLayout */}
                <Route element={<ProtectedLayout user={user} handleLogout={handleLogout} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/deposit" element={<Deposit />} />
                </Route>

                {/* Global Redirects */}
                <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;