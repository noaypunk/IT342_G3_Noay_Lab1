import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    // Client-side validation function
    const validateForm = () => {
        if (!formData.firstName.trim() || !formData.lastName.trim() || 
            !formData.email.trim() || !formData.password.trim()) {
            setStatus({ type: 'error', message: 'All fields are required.' });
            return false;
        }
        // Basic email regex validation
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
        
        // 1. Validate fields before sending request
        if (!validateForm()) return;

        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            await register(formData);
            
            setStatus({ 
                type: 'success', 
                message: "Registration Successful! Redirecting to login..." 
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setIsSubmitting(false);
            
            // 2. Handle Duplicate Email Error from Backend
            // Spring Boot usually returns a 409 Conflict or 400 Bad Request for duplicates
            const errorData = error.response?.data;
            const statusLabel = error.response?.status;

            if (statusLabel === 409 || (typeof errorData === 'string' && errorData.includes("exists"))) {
                setStatus({ 
                    type: 'error', 
                    message: "Registration Failed: This email is already registered." 
                });
            } else {
                setStatus({ 
                    type: 'error', 
                    message: "Registration Failed: " + (errorData || error.message) 
                });
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <h2>Create Account</h2>
                <p>Join BusPay to manage your commute.</p>

                {status.message && (
                    <div className={`alert alert-${status.type}`}>
                        {status.message}
                    </div>
                )}

                <table className="auth-table">
                    <tbody>
                        <tr>
                            <td>
                                <input 
                                    type="text" 
                                    placeholder="First Name" 
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    placeholder="Last Name" 
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <input 
                                    style={{ width: '100%' }}
                                    type="email" 
                                    placeholder="Email Address" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <input 
                                    style={{ width: '100%' }}
                                    type="password" 
                                    placeholder="Set Password" 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <button 
                    type="submit" 
                    className="auth-button" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Processing..." : "Register"}
                </button>
               
                <p className="auth-footer">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
};

export default Register;