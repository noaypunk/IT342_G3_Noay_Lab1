import axios from 'axios';

const api = axios.create({
    // Set the base to /api so you can access /auth, /users, etc.
    baseURL: 'http://localhost:8080/api',
});

// Add an Interceptor to automatically attach the token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication endpoints
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// User/Account endpoints (needed for your Dashboard)
export const getUserProfile = () => api.get('/users/profile');
export const depositFunds = (amount) => api.post('/users/deposit', { amount });

export default api;