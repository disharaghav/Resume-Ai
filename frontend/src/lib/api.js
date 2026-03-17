import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

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
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
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

