import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 1. Request Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const userObj = JSON.parse(savedUser);
                if (userObj?.token) {
                    config.headers.Authorization = `Bearer ${userObj.token}`;
                }
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 2. Response Interceptor (FIXED LOGIC)
api.interceptors.response.use(
    (response) => response, 
    (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            // 401 means the token is invalid or expired. WE MUST LOG OUT.
            console.warn("Session expired - logging out.");
            localStorage.clear();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        } else if (status === 403) {
            // 403 means "I know who you are, but you aren't an Admin."
            // DO NOT log out. Just let the specific page handle the error.
            console.error("Access Denied: You do not have the required role.");
        }
        
        return Promise.reject(error);
    }
);

// Endpoints
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getUserProfile = () => api.get('/users/profile');
export const updateProfile = (formData) => api.put('/users/profile', formData);
export const payFare = (paymentData) => api.post('/users/pay', paymentData);

// Add this so your AdminDashboard.jsx can use it
export const getAllDeposits = () => api.get('/deposits/all');
export const approveDeposit = (id) => api.post(`/deposits/approve/${id}`);

export default api;