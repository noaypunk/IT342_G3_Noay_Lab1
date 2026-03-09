import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
    // 1. Change 'token' to 'user' to match what we save in Login.jsx
    const isAuthenticated = () => !!localStorage.getItem('user');

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/dashboard" 
                    element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
                />
                {/* 2. Catch-all: Redirect any unknown path to login or dashboard */}
                <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;