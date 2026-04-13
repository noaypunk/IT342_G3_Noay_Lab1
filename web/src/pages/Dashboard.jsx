import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ onLogout }) => { // <--- Added prop here
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstName: '',
        balance: 0,
        rewardPoints: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
                if (error.response?.status === 401) {
                    handleLogout(); // Use our logout logic if token expires
                }
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        onLogout(); // This clears the user state in App.jsx
        navigate('/login');
    };

    if (loading) return <div className="flex justify-center p-10 font-medium">Loading your account...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 px-6 py-4 mb-8">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="text-xl font-bold text-blue-600 tracking-tight">BusPay</div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/deposit')} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Deposit</button>
                        <button onClick={() => navigate('/profile')} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Profile</button>
                        <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700 transition">Logout</button>
                    </div>
                </div>
            </nav>

            <div className="p-6 max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userData.firstName}!</h1>
                    <p className="text-gray-500">Manage your fares and rewards here.</p>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg shadow-blue-200">
                        <p className="text-blue-100 text-xs uppercase tracking-widest font-bold">Current Balance</p>
                        <h2 className="text-4xl font-black mt-2">
                            ₱{userData.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h2>
                    </div>

                    <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
                        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">BusPay Rewards</p>
                        <div className="flex items-center mt-2">
                            <span className="text-4xl font-black text-yellow-500">{userData.rewardPoints || 0}</span>
                            <span className="ml-3 text-gray-500 font-bold text-lg">Points</span>
                        </div>
                    </div>
                </div>

                <section className="mt-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => navigate('/deposit')} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-xl font-bold transition flex-1 md:flex-none text-center">Add Funds</button>
                        <button className="bg-gray-900 text-white hover:bg-black px-6 py-3 rounded-xl font-bold transition flex-1 md:flex-none text-center">Pay Fare</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;