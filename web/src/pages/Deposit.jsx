import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import gcashLogo from '../assets/gcash-logo.png';

const Deposit = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [refNumber, setRefNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1: Input, 2: Instructions/Ref, 3: Success
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleNextStep = (e) => {
        e.preventDefault();
        // Basic validation
        if (!amount || parseFloat(amount) < 10) {
            setStatus({ type: 'error', message: 'Minimum deposit is ₱10.00' });
            return;
        }
        setStatus({ type: '', message: '' });
        setStep(2);
    };

    const confirmPayment = async () => {
        // GCash reference numbers are typically 13 digits
        if (!refNumber || refNumber.length < 10) {
            setStatus({ type: 'error', message: 'Please enter a valid GCash Reference Number.' });
            return;
        }

        setIsProcessing(true);
        setStatus({ type: '', message: '' });
        
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            // Note: This matches the @PostMapping("/request") in your DepositController
            const response = await api.post('/deposits/request', {
                email: user.email,
                amount: parseFloat(amount),
                refNumber: refNumber
            });

            if (response.status === 200 || response.status === 201) {
                setStep(3); 
            }
        } catch (error) {
            console.error("Deposit Error:", error);
            const msg = error.response?.data?.message || 'Submission failed. This Reference Number might already be used.';
            setStatus({ type: 'error', message: msg });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container">
            <div className="card deposit-card fade-in">
                {/* Back Navigation */}
                {step < 3 && (
                    <button 
                        className="back-link" 
                        onClick={() => step === 1 ? navigate('/dashboard') : setStep(1)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', marginBottom: '1rem' }}
                    >
                        ← {step === 1 ? 'Back to Dashboard' : 'Change Amount'}
                    </button>
                )}

                {step === 1 && (
                    <div className="deposit-form text-center">
                        <img src={gcashLogo} alt="GCash" className="gcash-logo" style={{ width: '120px', marginBottom: '1.5rem' }} />
                        <h2 className="section-title">Deposit via GCash</h2>
                        <p className="text-muted mb-6">Enter the amount you wish to add to your wallet.</p>
                        
                        <form onSubmit={handleNextStep}>
                            <div className="form-group">
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold' }}>₱</span>
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="auth-input"
                                        style={{ paddingLeft: '35px', fontSize: '1.2rem' }}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            {status.message && <div className={`alert alert-${status.type} mt-4`}>{status.message}</div>}
                            <button type="submit" className="btn-primary w-full mt-6">Continue</button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="gcash-confirm">
                        <div className="instructions-box" style={{ background: '#f0f7ff', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                            <h3 style={{ color: '#007bff', marginTop: 0 }}>How to pay:</h3>
                            <ol style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                <li>Open your GCash App.</li>
                                <li>Send <strong>₱{parseFloat(amount).toFixed(2)}</strong> to <br/><strong>0999-513-7892</strong> (BusPay Admin: Ry*n N.).</li>
                                <li>Save your receipt or copy the <strong>Reference Number</strong>.</li>
                            </ol>
                        </div>
                        
                        <div className="form-group">
                            <label className="card-label">13-Digit Reference Number</label>
                            <input 
                                type="text"
                                placeholder="e.g. 9012345678901"
                                value={refNumber}
                                onChange={(e) => setRefNumber(e.target.value)}
                                className="auth-input"
                                required
                            />
                        </div>
                        
                        {status.message && <div className={`alert alert-${status.type} mt-4`}>{status.message}</div>}

                        <button 
                            className="btn-primary w-full mt-6" 
                            onClick={confirmPayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Verifying..." : "Submit for Approval"}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="success-screen text-center" style={{ padding: '2rem 0' }}>
                        <div className="success-icon" style={{ fontSize: '4rem', color: '#22c55e', marginBottom: '1rem' }}>check_circle</div>
                        <h2 className="welcome-text">Request Submitted!</h2>
                        <p className="text-muted">
                            Your deposit of <strong>₱{parseFloat(amount).toFixed(2)}</strong> is now being verified. 
                            Your balance will update once approved by the admin.
                        </p>
                        <button className="btn-primary mt-8" onClick={() => navigate('/dashboard')}>
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Deposit;