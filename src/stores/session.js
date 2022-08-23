import { defineStore } from 'pinia';
import { api } from '../boot/axios';

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

  return JSON.parse(jsonPayload);
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    token: '',
  }),
  getters: {
    getToken: (state) => state.token,
  },
  actions: {
    saveToken(token) {
      this.token = token;
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      window.localStorage.setItem('token', token);
    },
    clearToken() {
      window.localStorage.removeItem('token');
      api.defaults.headers.common.Authorization = undefined;
      this.token = '';
    },
    checkToken() {
      const token = window.localStorage.getItem('token');
      if (token) {
        const decodedToken = parseJwt(token, 'base64');
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          this.saveToken(token);
        } else {
          this.clearToken();
        }
      }
    },
  },
});
