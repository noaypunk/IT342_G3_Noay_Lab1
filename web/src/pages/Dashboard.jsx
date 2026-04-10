import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    
    // Retrieve user data stored during login
    const user = JSON.parse(localStorage.getItem('user'));

    // Mock data - In the future, fetch this from your Spring Boot API
    const [balance] = useState(250.75);
    const [points] = useState(120);
    const [transactions] = useState([
        { id: 1, date: '2026-03-10', route: 'Line 101 - Northbound', amount: -15.00, status: 'Completed' },
        { id: 2, date: '2026-03-09', route: 'Top-up via Gcash', amount: 200.00, status: 'Completed' },
        { id: 3, date: '2026-03-08', route: 'Line 202 - Central', amount: -12.50, status: 'Completed' },
    ]);

    const handleLogout = () => {
        localStorage.removeItem('user'); 
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
                        <h2>User Profile</h2>
                        <table className="profile-table">
                            <tbody>
                                <tr><td><strong>Email:</strong></td><td>{user?.email}</td></tr>
                                <tr><td><strong>Account Status:</strong></td><td> Active </td></tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <>
                        <div className="welcome-text">
                            <h1>Welcome back, {user?.username || 'User'}!</h1>
                            <p>Manage your bus payments and account details here.</p>
                        </div>

                        {/* Stats Row: Balance and Points */}
                        <div className="stats-grid">
                            <div className="card balance-card">
                                <h3>Available Balance</h3>
                                <div className="balance-amount">₱ {balance.toFixed(2)}</div>
                            </div>
                            <div className="card points-card">
                                <h3>BusPay Points</h3>
                                <div className="points-amount">{points} pts</div>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="card history-card">
                            <h3>Recent Transactions</h3>
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td>{tx.date}</td>
                                            <td>{tx.route}</td>
                                            <td className={tx.amount > 0 ? "text-success" : "text-danger"}>
                                                {tx.amount > 0 ? `+₱${tx.amount}` : `-₱${Math.abs(tx.amount)}`}
                                            </td>
                                            <td><span className="status-pill">{tx.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;