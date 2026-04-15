import React, { useState } from 'react';
import { login } from '../services/api'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(''); // Added local error state for cleaner UI
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await login(credentials);
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            onLoginSuccess(response.data); 
            navigate('/dashboard'); 
        } catch (error) {
            const errorMsg = error.response?.data || "Invalid email or password";
            setError(errorMsg);
        }
    };

    return (
        /* Use auth-page for the centered Radiant Blue layout */
        <div className="auth-page"> 
            <div className="auth-card">
                <h2 className="nav-logo" style={{fontSize: '2rem', marginBottom: '1rem'}}>BusPay</h2>
                <p className="text-muted" style={{marginBottom: '2rem'}}>Sign in to your commuter wallet</p>
                
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input 
                            type="email" 
                            className="auth-input" /* Styled in App.css */
                            placeholder="Email Address" 
                            required 
                            value={credentials.email}
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                        />
                        <input 
                            type="password" 
                            className="auth-input"
                            placeholder="Password" 
                            required 
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                        />
                        
                        <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                            Sign In
                        </button>
                    </div>

                    <p className="mt-4" style={{fontSize: '0.9rem', marginTop: '20px'}}>
                        New to BusPay? <Link to="/register">Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;