import React, { useState } from 'react';
import { register } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            alert("Registration Successful!");
        } catch (error) {
            alert("Registration Failed: " + error.response?.data || error.message);
        }
    };

  return (
    <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <table>
                <tr>
                    <td>
                        <input type="text" placeholder="First Name" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                    </td>
                    <td>
                        <input type="text" placeholder="Last Name" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </td>
                    <td>
                        <input type="password" placeholder="Set Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </td>
                </tr>
            </table>
            
            <button type="submit" className="auth-button">Register</button>
           
            <p>Already have an account? <a href="/login">Login</a></p>
        </form>
    </div>
);
};

export default Register;