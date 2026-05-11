import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [pendingDeposits, setPendingDeposits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPending = async () => {
        setIsLoading(true);
        try {
            // Get token from storage in case the API utility hasn't set it globally
            const token = localStorage.getItem('token');
            
            const res = await api.get('/deposits/all', {
                headers: { Authorization: `Bearer ${token}` }
            }); 
            
            // Filter for PENDING status
            const pending = res.data.filter(d => d.status === 'PENDING');
            setPendingDeposits(pending);
        } catch (err) {
            console.error("Error fetching deposits:", err);
            // If the error is 403 or 401, it means the role/token is rejected
            if (err.response?.status === 403) {
                alert("Access Denied: You do not have Admin permissions.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id) => {
        if (!window.confirm("Verify and approve this deposit?")) return;
        
        try {
            const token = localStorage.getItem('token');
            await api.post(`/deposits/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert("Deposit Approved! User balance updated.");
            fetchPending(); // Refresh list
        } catch (err) {
            console.error("Approval failed:", err);
            alert("Approval failed. Ensure the backend endpoint /approve/{id} exists.");
        }
    };

    if (isLoading) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
                <div className="loader">Loading deposits...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="section-title">Admin: Pending Deposits</h2>
            <div className="card" style={{ padding: '20px', marginTop: '20px' }}>
                {pendingDeposits.length === 0 ? (
                    <p className="text-center text-muted">No pending deposit requests.</p>
                ) : (
                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Email</th>
                                <th style={{ padding: '12px' }}>Amount</th>
                                <th style={{ padding: '12px' }}>Ref #</th>
                                <th style={{ padding: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingDeposits.map(d => (
                                <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{d.email}</td>
                                    <td style={{ padding: '12px' }}>₱{parseFloat(d.amount).toFixed(2)}</td>
                                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#666' }}>
                                        {d.refNumber}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <button 
                                            className="btn-primary btn-sm" 
                                            style={{ backgroundColor: '#2ecc71', borderColor: '#27ae60' }}
                                            onClick={() => handleApprove(d.id)}
                                        >
                                            Approve
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;