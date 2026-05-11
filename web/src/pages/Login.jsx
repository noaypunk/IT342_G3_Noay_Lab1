import React, { useState } from 'react';
import { login } from '../services/api'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await login(credentials);
            
            // Debug: Check if 'role' is actually 'ROLE_ADMIN'
            console.log("Backend Response:", response.data);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));

            onLoginSuccess(response.data); 
            
            // If they are an admin, you might want to send them straight to admin
            if (response.data.role === 'ROLE_ADMIN') {
                navigate('/admin/deposits');
            } else {
                navigate('/dashboard'); 
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Invalid email or password";
            setError(errorMsg);
        }
    };

    return (
        <div className="auth-page"> 
            <div className="auth-card">
                <h2 className="nav-logo" style={{fontSize: '2rem', marginBottom: '1rem'}}>BusPay</h2>
                <p className="text-muted" style={{marginBottom: '2rem'}}>Sign in to your commuter wallet</p>
                
                {error && <div className="alert alert-error" style={{marginBottom: '1rem'}}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input 
                            type="email" 
                            className="auth-input" 
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

                    <p style={{fontSize: '0.9rem', marginTop: '20px'}}>
                        New to BusPay? <Link to="/register">Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;