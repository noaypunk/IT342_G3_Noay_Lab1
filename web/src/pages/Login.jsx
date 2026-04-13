import React, { useState } from 'react';
import { login } from '../services/api'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => { // <--- Added prop here
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(credentials);
            
            // 1. Save the token for API headers
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            // 2. Pass the user object back to App.jsx
            // This triggers the state change that makes the dashboard visible
            onLoginSuccess(response.data); 
            
            console.log("Login Success:", response.data);
            navigate('/dashboard'); 
        } catch (error) {
            const errorMsg = error.response?.data || "Invalid email or password";
            alert("Login Failed: " + errorMsg);
        }
    };

    return (
        <div className="auth-container flex items-center justify-center min-h-screen bg-gray-100">
            <form className="auth-form bg-white p-8 rounded-lg shadow-md w-96" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Welcome to BusPay</h2>
                
                <div className="space-y-4">
                    <input 
                        type="email" 
                        className="w-full p-2 border rounded"
                        placeholder="Email" 
                        required 
                        value={credentials.email}
                        onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                    />
                    <input 
                        type="password" 
                        className="w-full p-2 border rounded"
                        placeholder="Password" 
                        required 
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                    />
                    
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
                        Sign In
                    </button>
                </div>

                <p className="mt-4 text-center text-sm text-gray-600">
                    New to BusPay? <Link to="/register" className="text-blue-600 hover:underline">Create an account</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;