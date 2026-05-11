import React, { useState, useEffect } from 'react';
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
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedLayout = ({ user, handleLogout }) => {
    // Check state first, then storage
    const sessionUser = user || JSON.parse(localStorage.getItem('user'));
    
    if (!sessionUser) return <Navigate to="/login" replace />;

    return (
        <div className="container">
            {/* FIX: Added user={sessionUser} so Navbar knows your role instantly */}
            <Navbar onLogout={handleLogout} user={sessionUser} />
            <main className="dashboard-content">
                <Outlet /> 
            </main>
        </div>
    );
};

const AdminRoute = ({ user }) => {
    const sessionUser = user || JSON.parse(localStorage.getItem('user'));
    
    console.log("AdminRoute Check - User Role:", sessionUser?.role);

    if (!sessionUser || sessionUser.role !== 'ROLE_ADMIN') {
        // If they aren't an admin, send them to dashboard, NOT login
        return <Navigate to="/dashboard" replace />;
    }
    
    return <Outlet />;
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

    useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem('user');
            if (saved) setUser(JSON.parse(saved));
            else setUser(null);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLoginSuccess = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                {/* Public */}
                <Route 
                    path="/login" 
                    element={user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
                />
                <Route path="/register" element={<Register />} />

                {/* Protected Group */}
                <Route element={<ProtectedLayout user={user} handleLogout={handleLogout} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/deposit" element={<Deposit />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Admin Specific */}
                    <Route element={<AdminRoute user={user} />}>
                        <Route path="/admin/deposits" element={<AdminDashboard />} />
                    </Route>
                </Route>

                <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;