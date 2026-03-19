import axios from 'axios';

// ✅ BASE URL
const API_BASE = `${process.env.REACT_APP_API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ AUTH
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ✅ JOBS (FIXES YOUR BUILD ERROR)
export const jobsAPI = {
  create: (data) => api.post('/jobs', data),
  list: () => api.get('/jobs'),
  get: (id) => api.get(`/jobs/${id}`),
  myJobs: () => api.get('/jobs/employer/my-jobs'),
};

// ✅ RESUMES
export const resumesAPI = {
  list: () => api.get('/resumes'),
  create: (data) => api.post('/resumes', data),
};

// ✅ APPLICATIONS
export const applicationsAPI = {
  list: () => api.get('/applications'),
  create: (data) => api.post('/applications', data),
};

export default api;