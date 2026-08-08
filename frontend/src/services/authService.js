import api from './api';

export const authService = {
  async login(email, password, rememberMe = false) {
    const res = await api.post('/auth/login', { email, password, rememberMe });
    if (res.data?.token) {
      localStorage.setItem('aurum_token', res.data.token);
      localStorage.setItem('aurum_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async forgotPassword(email) {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    localStorage.removeItem('aurum_token');
    localStorage.removeItem('aurum_user');
  }
};
