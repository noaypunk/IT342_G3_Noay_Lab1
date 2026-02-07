import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [users, setUsers] = useState([]); // To store the list of users

  // Function to fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/auth/all");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users automatically when the component loads
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await axios.post(`http://localhost:8080${endpoint}`, formData);
      
      // If the backend returns a string (like "Login Successful!"), it shows in response.data
      const message = typeof response.data === 'string' ? response.data : "Success!";
      alert(message);
      
      // Refresh the user list if a new user was just registered
      if (!isLogin) fetchUsers();
      
    } catch (error) {
      // Improved error handling to show backend error messages
      const errorMsg = error.response?.data || "Server unreachable. Make sure Spring Boot is running!";
      alert("Error: " + errorMsg);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Segoe UI, Arial' }}>
      <div style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px', display: 'inline-block' }}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div>
            <label>Email:</label><br/>
            <input 
              type="email" 
              value={formData.email}
              required 
              style={{ padding: '8px', width: '200px' }}
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <br/>
          <div>
            <label>Password:</label><br/>
            <input 
              type="password" 
              value={formData.password}
              required 
              style={{ padding: '8px', width: '200px' }}
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          <br/>
          <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <p onClick={() => {
            setIsLogin(!isLogin);
            setFormData({email: '', password: ''}); // Clear form on toggle
          }} 
          style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline', marginTop: '15px' }}>
          {isLogin ? "Need an account? Register" : "Have an account? Login"}
        </p>
      </div>

      <hr style={{ margin: '40px 0' }} />

      <h3>Registered Users (Database)</h3>
      <button onClick={fetchUsers} style={{ marginBottom: '10px' }}>Refresh List</button>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table border="1" style={{ width: '50%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#eee' }}>
              <th>ID</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
              </tr>
            )) : <tr><td colSpan="2">No users found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;