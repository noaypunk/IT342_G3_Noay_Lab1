import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/user/me')
            .then(res => setUser(res.data))
            .catch(() => handleLogout());
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard">
            <h1>Welcome to BusPay Dashboard</h1>
            {user ? (
                <div>
                    <p>Logged in as: <strong>{user.username}</strong></p>
                    <p>Email: {user.email}</p>
                    <button onClick={handleLogout} style={{backgroundColor: 'red', color: 'white'}}>Logout</button>
                </div>
            ) : <p>Loading profile...</p>}
        </div>
    );
};

export default Dashboard;