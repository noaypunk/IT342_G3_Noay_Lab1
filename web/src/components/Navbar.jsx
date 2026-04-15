import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation(); // To highlight the active link

    const handleLogoutClick = () => {
        if (onLogout) {
            onLogout();
        }
        navigate('/login');
    };

    // Helper to check if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo / Brand */}
                <div 
                    className="nav-logo"
                    onClick={() => navigate('/dashboard')}
                >
                    BusPay
                </div>
                
                {/* Navigation Links */}
                <div className="nav-links">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => navigate('/deposit')}
                        className={`nav-item ${isActive('/deposit') ? 'active' : ''}`}
                    >
                        Deposit
                    </button>
                    <button 
                        onClick={() => navigate('/profile')}
                        className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
                    >
                        Profile
                    </button>
                    
                    <div className="nav-divider"></div>
                    
                    <button 
                        onClick={handleLogoutClick}
                        className="nav-logout-btn"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;