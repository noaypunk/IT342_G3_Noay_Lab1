import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = () => {
    const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '' });
    const [formData, setFormData] = useState({ firstName: '', lastName: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/profile');
            
            // 1. Update the display state
            setUserData(response.data);
            
            // 2. CRITICAL: Update the form state so the inputs aren't empty
            setFormData({
                firstName: response.data.firstName || '',
                lastName: response.data.lastName || ''
            });
        } catch (error) {
            const errorDetail = error.response?.data?.error || error.message;
            setMessage({ type: 'error', text: `Error: ${errorDetail}` });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        
        try {
            // Send the updated names to the backend
            const response = await api.put('/users/profile', formData);
            
            // 1. Update the display state immediately
            // We use the functional update to keep existing fields (like email/balance)
            setUserData(prev => ({ 
                ...prev, 
                firstName: formData.firstName, 
                lastName: formData.lastName 
            }));

            // 2. Update localStorage so the Navbar/Sidebar updates the name without a refresh
            const savedUser = JSON.parse(localStorage.getItem('user'));
            if (savedUser) {
                const updatedUser = { 
                    ...savedUser, 
                    firstName: formData.firstName, 
                    lastName: formData.lastName 
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            setIsEditing(false);
            setMessage({ type: 'success', text: response.data.message || 'Profile updated successfully!' });
        } catch (error) {
            console.error("Update error:", error);
            const errorMsg = error.response?.data?.error || 'Failed to update profile.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    if (loading) return (
        <div className="flex-center" style={{ height: '50vh', flexDirection: 'column' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '15px', color: '#64748b' }}>Fetching your profile...</p>
        </div>
    );

    return (
        <div className="dashboard-content fade-in">
            <header className="mb-8">
                <h1 className="welcome-text">Account Settings</h1>
                <p className="text-muted">Manage your personal information and security.</p>
            </header>

            {message.text && (
                <div className={`alert alert-${message.type}`} style={{ marginBottom: '20px' }}>
                    {message.text}
                </div>
            )}

            <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 className="section-title" style={{ margin: 0 }}>Personal Details</h3>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn-secondary">
                            Edit Profile
                        </button>
                    )}
                </div>

                <form onSubmit={handleUpdate}>
                    <div className="profile-field">
                        <label className="card-label text-muted">Email Address</label>
                        <input 
                            className="auth-input" 
                            value={userData.email || ''} 
                            disabled 
                            style={{ backgroundColor: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed', border: '1px solid #e2e8f0' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="card-label text-muted">First Name</label>
                            <input 
                                className="auth-input"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                disabled={!isEditing}
                                placeholder="Enter first name"
                                required
                                style={!isEditing ? { border: '1px solid transparent', backgroundColor: 'transparent', paddingLeft: 0, fontWeight: '600', color: '#1e293b' } : {}}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="card-label text-muted">Last Name</label>
                            <input 
                                className="auth-input"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                disabled={!isEditing}
                                placeholder="Enter last name"
                                required
                                style={!isEditing ? { border: '1px solid transparent', backgroundColor: 'transparent', paddingLeft: 0, fontWeight: '600', color: '#1e293b' } : {}}
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="action-button-group" style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn-primary">Save Changes</button>
                            <button 
                                type="button" 
                                onClick={() => { 
                                    setIsEditing(false); 
                                    setFormData({ firstName: userData.firstName, lastName: userData.lastName }); 
                                }} 
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;