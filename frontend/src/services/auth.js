import jwtDecode from 'jwt-decode';
import api from './api';

const auth = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },
  register: async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getUser: () => {
    const u = localStorage.getItem('user');
    if (!u) return null;
    try {
      return JSON.parse(u);
    } catch (err) {
      return null;
    }
  },
  getToken: () => localStorage.getItem('token')
};

export default auth;
