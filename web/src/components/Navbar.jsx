import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout, user: userFromProps }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Use user from props first, fallback to localStorage if props aren't passed
    const user = userFromProps || JSON.parse(localStorage.getItem('user'));

    const handleLogoutClick = () => {
        if (onLogout) onLogout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="nav-logo" onClick={() => navigate('/dashboard')}>
                    BusPay
                </div>
                
                <div className="nav-links">
                    <button 
                        type="button" // Explicitly set type to prevent form issues
                        onClick={() => navigate('/dashboard')}
                        className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        Home
                    </button>

                    {/* ADMIN ONLY LINK */}
                    {user?.role === 'ROLE_ADMIN' && (
                        <button 
                            type="button"
                            onClick={() => navigate('/admin/deposits')}
                            className={`nav-item ${isActive('/admin/deposits') ? 'active' : ''}`}
                            style={{ color: '#f39c12', fontWeight: 'bold' }} 
                        >
                            Admin Panel
                        </button>
                    )}

                    <button 
                        type="button"
                        onClick={() => navigate('/deposit')}
                        className={`nav-item ${isActive('/deposit') ? 'active' : ''}`}
                    >
                        Deposit
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => navigate('/profile')}
                        className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
                    >
                        Profile
                    </button>
                    
                    <div className="nav-divider"></div>
                    
                    <button 
                        type="button"
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