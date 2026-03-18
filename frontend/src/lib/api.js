import axios from 'axios';

// ✅ BASE URL (NO extra mistakes)
const API_BASE = `${process.env.REACT_APP_API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ AUTH ROUTES (FINAL CORRECT)
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// (optional others stay same)
export default api;