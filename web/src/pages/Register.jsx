import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        if (!formData.firstName.trim() || !formData.lastName.trim() || 
            !formData.email.trim() || !formData.password.trim()) {
            setStatus({ type: 'error', message: 'All fields are required.' });
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus({ type: 'error', message: 'Please enter a valid email address.' });
            return false;
        }
        if (formData.password.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            await register(formData);
            setStatus({ 
                type: 'success', 
                message: "Registration Successful! Redirecting to login..." 
            });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setIsSubmitting(false);
            const errorData = error.response?.data;
            const statusLabel = error.response?.status;

            if (statusLabel === 409 || (typeof errorData === 'string' && errorData.includes("exists"))) {
                setStatus({ type: 'error', message: "This email is already registered." });
            } else {
                setStatus({ type: 'error', message: "Registration Failed: " + (errorData || error.message) });
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <h2 className="nav-logo" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>BusPay</h2>
                <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Join the community of modern commuters.</p>

                {status.message && (
                    <div className={`alert alert-${status.type}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Row for Name Inputs */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input 
                            className="auth-input"
                            type="text" 
                            placeholder="First Name" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                        />
                        <input 
                            className="auth-input"
                            type="text" 
                            placeholder="Last Name" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                        />
                    </div>

                    <input 
                        className="auth-input"
                        type="email" 
                        placeholder="Email Address" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />

                    <input 
                        className="auth-input"
                        type="password" 
                        placeholder="Set Password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    />

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>
                   
                    <p className="mt-4" style={{ fontSize: '0.9rem', marginTop: '20px' }}>
                        Already a member? <Link to="/login">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;