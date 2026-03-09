import React, { useState } from 'react';
import { login } from '../services/api'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(credentials);
            
            // 1. Save the user object to localStorage so App.jsx and Dashboard can see it
            localStorage.setItem('user', JSON.stringify(response.data)); 
            
            // 2. Optional: If your backend returns a token, save it too
            // localStorage.setItem('token', response.data.token); 

            console.log("Login Success:", response.data);
            
            // 3. Navigate to dashboard - App.jsx will now allow this because 'user' exists
            navigate('/dashboard'); 
        } catch (error) {
            // Provide a more specific error message if available
            const errorMsg = error.response?.data || "Invalid email or password";
            alert("Login Failed: " + errorMsg);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>BusPay Login</h2>
                <input 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                />
                
                <button type="submit" className="auth-button">Sign In</button>
                <p>
                    New to BusPay? <Link to="/register">Create an account</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;