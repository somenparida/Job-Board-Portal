import axios from 'axios';

// Prefer an explicit REACT_APP_API_URL. During local development, default to localhost so
// developers running the backend locally will hit their local API and see seeded jobs.
const defaultRemote = 'https://job-board-portal-1-t2ql.onrender.com/api';
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : defaultRemote),
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
