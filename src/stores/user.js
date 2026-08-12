import { defineStore } from 'pinia';
import { Notyf } from 'notyf';
import api from '../api';

const notyf = new Notyf({ duration: 3000, dismissible: true });

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
  }),

  actions: {
    async login(email, password) {
      try {
        const res = await api.post('/users/login', { email, password });
        this.token = res.data.access;
        localStorage.setItem('token', this.token);
        
        await this.fetchProfile();
        notyf.success('Welcome back!');
      } catch (err) {
        notyf.error(err.response?.data?.message || 'Login failed');
        throw err;
      }
    },

    async fetchProfile() {
      if (!this.token) return;
      try {
        const res = await api.post('/users/details');
        this.user = res.data;
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        this.logout();
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      notyf.success('Successfully logged out');
    }
  }
});