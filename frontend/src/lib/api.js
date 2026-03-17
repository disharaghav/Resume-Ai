import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL; // ✅ FIXED

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    signup: (data) => api.post('/signup', data), // ✅ FIXED
    login: (data) => api.post('/login', data),   // ✅ FIXED
    me: () => api.get('/me'), // optional (you can remove if not implemented)
};

export const jobsAPI = {
    create: (data) => api.post('/jobs', data),
    list: () => api.get('/jobs'),
    get: (id) => api.get(`/jobs/${id}`),
    myJobs: () => api.get('/jobs/employer/my-jobs'),
};

export const resumesAPI = {
    list: () => api.get('/resumes'),
    create: (data) => api.post('/resumes', data),
};

export const applicationsAPI = {
    list: () => api.get('/applications'),
    create: (data) => api.post('/applications', data),
};

export default api;