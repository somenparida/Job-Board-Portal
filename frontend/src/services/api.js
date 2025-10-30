import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// only set JSON content-type for methods that send a body
api.interceptors.request.use((config) => {
  if (config.method && !['get', 'delete', 'head'].includes(config.method.toLowerCase())) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// normalize errors so components can show friendly messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // network error (no response)
    if (err && err.request && !err.response) {
      return Promise.reject({
        original: err,
        message: `Network Error: Unable to reach API at ${api.defaults.baseURL}. Is the backend running?`,
      });
    }

    // server responded with status
    const status = err.response?.status;
    const dataMessage = err.response?.data?.message || err.response?.data?.error || null;
    const message = dataMessage || (status ? `Request failed with status ${status}` : 'An unknown error occurred');
    return Promise.reject({ original: err, message, status });
  }
);

export default api;
