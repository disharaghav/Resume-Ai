import axios from 'axios';

// ✅ IMPORTANT: base URL WITH /api
const API_BASE = `${process.env.REACT_APP_API_URL}/api`;

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ✅ AUTH APIs (MATCH BACKEND)
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
};

// (keep others same)
export default api;