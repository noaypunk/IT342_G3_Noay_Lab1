import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gcashLogo from '../assets/gcash-logo.png';

const Deposit = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1: Amount, 2: GCash Mock Login, 3: Success
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleNextStep = (e) => {
        e.preventDefault();
        if (!amount || amount < 10) {
            setStatus({ type: 'error', message: 'Minimum deposit is ₱10.00' });
            return;
        }
        setStatus({ type: '', message: '' });
        setStep(2);
    };

    const confirmPayment = async () => {
    setIsProcessing(true);
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        const response = await axios.post('http://192.168.254.105:8080/api/wallet/deposit', {
            email: user.email,
            amount: amount,
            method: 'GCash'
        });

        if (response.status === 200) {
            setStep(3); // Success Screen
            // Update local storage balance
            const updatedUser = { ...user, balance: user.balance + parseFloat(amount) };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    } catch (error) {
        setStatus({ type: 'error', message: 'Payment failed. Please check server connection.' });
    } finally {
        setIsProcessing(false);
    }
};

    return (
        <div className="container">
            <div className="card deposit-card">
                {step < 3 && (
                    <button className="back-link" onClick={() => step === 1 ? navigate('/dashboard') : setStep(1)}>
                        ← Back
                    </button>
                )}

                {step === 1 && (
                    <div className="deposit-form">
                        <img src={gcashLogo} alt="GCash" className="gcash-logo" />
                        <h2>Deposit via GCash</h2>
                        <form onSubmit={handleNextStep}>
                            <div className="form-group">
                                <label>Enter Amount</label>
                                <div className="input-wrapper">
                                    <span className="currency-prefix">₱</span>
                                    <input 
                                        type="number" 
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="amount-input-large"
                                    />
                                </div>
                            </div>
                            {status.message && <div className={`alert alert-${status.type}`}>{status.message}</div>}
                            <button type="submit" className="btn-gcash-continue">Continue</button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="gcash-confirm">
                        <div className="gcash-blue-header">
                            <img src={gcashLogo} alt="GCash" className="gcash-logo" />
                        </div>
                        <div className="payment-details">
                            <p>Merchant: <strong>BusPay App</strong></p>
                            <p>Amount to pay: <strong className="pay-amount">₱{parseFloat(amount).toFixed(2)}</strong></p>
                        </div>
                        <button 
                            className="btn-gcash-pay" 
                            onClick={confirmPayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing..." : "Pay with GCash"}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="success-screen">
                        <div className="success-icon">✔</div>
                        <h2>Payment Successful!</h2>
                        <p>₱{parseFloat(amount).toFixed(2)} has been added to your BusPay balance.</p>
                        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Deposit;