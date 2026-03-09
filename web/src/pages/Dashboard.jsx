import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    
    // Retrieve user data stored during login
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        // Clear user session data
        localStorage.removeItem('user'); 
        // Redirect back to login page
        navigate('/login');
    };

    return (
  <div className="container">
    <nav className="navbar">
      <div className="nav-logo">BusPay</div>
      <div className="nav-links">
        <button className="nav-btn" onClick={() => setShowProfile(!showProfile)}>
          {showProfile ? "Home" : "Profile"}
        </button>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>

    <main className="dashboard-content">
      {showProfile ? (
        <div className="card">
          {/* Your Profile Details Table here */}
        </div>
      ) : (
        <div className="welcome-text">
          <h1>Welcome back, {user?.firstName}!</h1>
          <p>Manage your bus payments and account details here.</p>
        </div>
      )}
    </main>
  </div>
);
};

export default Dashboard;