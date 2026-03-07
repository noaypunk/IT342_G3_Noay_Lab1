import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', credentials);
            localStorage.setItem('token', res.data.accessToken); // Save token
            navigate('/dashboard');
        } catch (err) {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login to BusPay</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" onChange={e => setCredentials({...credentials, username: e.target.value})} />
                <input type="password" placeholder="Password" onChange={e => setCredentials({...credentials, password: e.target.value})} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;