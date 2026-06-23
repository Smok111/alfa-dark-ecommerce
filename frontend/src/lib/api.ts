import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Attach JWT token to every request and handle FormData
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('alfa_dark_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let the browser set Content-Type automatically for FormData (multipart/form-data with boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Interceptor: Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('alfa_dark_token');
      localStorage.removeItem('alfa_dark_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
