import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem('app_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [view, setView] = useState(localStorage.getItem('app_user') ? 'dashboard' : 'auth');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/auth/all");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    // Simplified payload: Always send 'password'. Java will map it to 'password_hash'.
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const response = await axios.post(`http://localhost:8080${endpoint}`, payload);
      
      const data = response.data;
      const isSuccess = typeof data === 'string' 
        ? data.toLowerCase().includes("successful") 
        : !!data; // If it's an object, assume success

      if (isLogin && isSuccess) {
        const userDetails = users.find(u => u.email === formData.email) || { email: formData.email };
        localStorage.setItem('app_user', JSON.stringify(userDetails));
        setLoggedInUser(userDetails);
        setView('dashboard');
      } else {
        alert(typeof data === 'string' ? data : "Success!");
        if (!isLogin) {
          setIsLogin(true);
          fetchUsers();
        }
      }
    } catch (error) {
      alert("Error: " + (error.response?.data || "Server unreachable"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('app_user');
    setLoggedInUser(null);
    setFormData({ username: '', email: '', password: '' });
    setView('auth');
  };

  if (view === 'auth') {
    return (
      <div className="container">
        <div className="card">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input 
                className="input-field"
                type="text" 
                placeholder="Username"
                value={formData.username}
                required 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
              />
            )}
            <input 
              className="input-field"
              type="email" 
              placeholder="Email"
              value={formData.email}
              required 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
            <input 
              className="input-field"
              type="password" 
              placeholder="Password"
              value={formData.password}
              required 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
            <button type="submit" className="btn-primary">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <p onClick={() => {
            setIsLogin(!isLogin);
            setFormData({ username: '', email: '', password: '' });
          }} className="toggle-link">
            {isLogin ? "Need an account? Register" : "Have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => setView('dashboard')}>Dashboard</button>
        <button onClick={() => setView('profile')}>Profile</button>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="card">
        {view === 'dashboard' ? (
          <div>
            <h1>🏠 Dashboard</h1>
            <p>Welcome back, <strong>{loggedInUser?.username || loggedInUser?.email}</strong>!</p>
          </div>
        ) : (
          <div>
            <h1>👤 Profile</h1>
            <p><strong>Username:</strong> {loggedInUser?.username || "N/A"}</p>
            <p><strong>Email:</strong> {loggedInUser?.email}</p>
            <p><strong>Status:</strong> <span style={{color: 'green'}}>{loggedInUser?.status || "ACTIVE"}</span></p>
            {loggedInUser?.created_at && (
                <p><strong>Member Since:</strong> {new Date(loggedInUser.created_at).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;