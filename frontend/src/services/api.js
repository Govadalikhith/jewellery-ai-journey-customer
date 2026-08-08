import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aurum_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Unified Error Handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('aurum_token');
        localStorage.removeItem('aurum_user');
        window.location.href = '/login';
      }
    }
    const customError = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.message || 'Unable to communicate with Aurum intelligence servers.'
    };
    return Promise.reject(customError);
  }
);

export default api;
