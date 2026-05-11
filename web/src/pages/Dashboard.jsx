import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ firstName: '', balance: 0, rewardPoints: 0 });
    const [loading, setLoading] = useState(true);

    const [showPayModal, setShowPayModal] = useState(false);
    const [amountToPay, setAmountToPay] = useState('');
    const [receipt, setReceipt] = useState(null);

    // Using useCallback so we can reference it safely inside useEffect and handlers
    const fetchProfile = useCallback(async () => {
        try {
            const response = await api.get('/users/profile');
            setUserData(response.data);
        } catch (error) {
            console.error("Fetch error", error);
            // If the error is 403 or 401, the token is bad. Go to login.
            if (error.response?.status === 403 || error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handlePayFare = async (e) => {
        e.preventDefault();
        const payAmount = parseFloat(amountToPay);

        if (isNaN(payAmount) || payAmount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        if (payAmount > userData.balance) {
            alert("Insufficient balance!");
            return;
        }

        try {
            // FIX: You need to actually tell the backend to deduct the money!
            // Assuming you have a /users/pay endpoint
            const response = await api.post('/users/pay', { amount: payAmount });
            
            // If backend successful, show receipt
            setReceipt({
                amount: payAmount,
                ref: response.data.reference || "BP-" + Math.random().toString(36).substr(2, 7).toUpperCase(),
                date: new Date().toLocaleString(),
                merchant: "City Transit Bus"
            });

            setShowPayModal(false);
            setAmountToPay('');
            fetchProfile(); // Refresh balance from the real database
        } catch (err) {
            console.error("Payment error", err);
            alert("Payment failed. Please check your connection.");
        }
    };

    if (loading) return <div className="loading-spinner">Connecting to BusPay...</div>;

    return (
        <div className="dashboard-content">
            <header className="mb-8">
                <h1 className="welcome-text">Welcome back, {userData.firstName || 'User'}!</h1>
                <p className="text-muted">Manage your transit fares and rewards here.</p>
            </header>
            
            <div className="stats-grid">
                <div className="card card-balance">
                    <p className="card-label">Current Balance</p>
                    <h2 className="balance-amount">
                        ₱{Number(userData.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                </div>

                <div className="card card-white">
                    <p className="card-label text-muted">BusPay Rewards</p>
                    <div className="rewards-display">
                        <span className="points-amount">{userData.rewardPoints || 0}</span>
                        <span className="points-label">Points</span>
                    </div>
                </div>
            </div>

            <section className="quick-actions-section">
                <h3 className="section-title">Quick Actions</h3>
                <div className="action-button-group">
                    <button onClick={() => navigate('/deposit')} className="btn-primary">
                        Add Funds
                    </button>
                    <button onClick={() => setShowPayModal(true)} className="btn-secondary">
                        Pay Fare
                    </button>
                </div>
            </section>

            {/* PAYMENT MODAL */}
            {showPayModal && (
                <div className="modal-overlay">
                    <div className="auth-card modal-content">
                        <h3>Pay Transit Fare</h3>
                        <p className="text-muted">Enter the amount to pay the driver</p>
                        <form onSubmit={handlePayFare} style={{marginTop: '20px'}}>
                            <input 
                                type="number" 
                                step="0.01" // Allows decimals
                                className="auth-input" 
                                placeholder="₱ 0.00"
                                value={amountToPay}
                                onChange={(e) => setAmountToPay(e.target.value)}
                                autoFocus
                                required
                            />
                            <div className="action-button-group">
                                <button type="submit" className="btn-primary" style={{flex: 2}}>Confirm Pay</button>
                                <button type="button" onClick={() => setShowPayModal(false)} className="btn-secondary" style={{flex: 1}}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DIGITAL RECEIPT */}
            {receipt && (
                <div className="modal-overlay">
                    <div className="receipt-card">
                        <div className="receipt-success-icon">✓</div>
                        <h2 style={{color: '#0066ff'}}>Payment Success</h2>
                        <div className="receipt-divider"></div>
                        <div className="receipt-row"><span>Merchant:</span> <strong>{receipt.merchant}</strong></div>
                        <div className="receipt-row"><span>Amount:</span> <strong style={{fontSize: '1.2rem'}}>₱{receipt.amount.toFixed(2)}</strong></div>
                        <div className="receipt-row"><span>Ref Number:</span> <code>{receipt.ref}</code></div>
                        <div className="receipt-row"><span>Date:</span> <small>{receipt.date}</small></div>
                        <button onClick={() => setReceipt(null)} className="btn-primary" style={{width: '100%', marginTop: '20px'}}>Done</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;