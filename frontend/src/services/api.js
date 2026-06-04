import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export const destinationsAPI = {
  getAll: (params) => api.get('/api/destinations', { params }),
  getOne: (id) => api.get(`/api/destinations/${id}`),
  create: (data) => api.post('/api/destinations', data),
  update: (id, data) => api.put(`/api/destinations/${id}`, data),
  remove: (id) => api.delete(`/api/destinations/${id}`),
  getStats: () => api.get('/api/destinations/stats'),
};