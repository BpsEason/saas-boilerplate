import { defineStore } from 'pinia'
import axios from '@/api' // 引入配置好的 axios 實例
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    errors: {}
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user && state.user.is_admin === true,
  },
  actions: {
    setAuthData(user, token) {
      this.user = user
      this.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
      this.errors = {}
    },

    clearAuthData() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      this.errors = {}
    },

    loadUserFromLocalStorage() {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        this.token = storedToken
        // 如果有 token 但還沒有 user 信息，嘗試從後端獲取
        if (!this.user) {
          this.fetchUser();
        }
      }
    },

    async register(name, email, password, password_confirmation) {
      this.errors = {};
      try {
        const response = await axios.post('/register', { name, email, password, password_confirmation });
        this.setAuthData(response.data.user, response.data.access_token);
        router.push('/dashboard');
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          console.error('Registration error:', error);
          this.errors = { general: ['註冊失敗，請稍後再試。'] };
        }
        this.clearAuthData(); // 註冊失敗，清除任何舊的認證信息
        throw error; // 重新拋出錯誤讓組件捕獲
      }
    },

    async login(email, password) {
      this.errors = {};
      try {
        const response = await axios.post('/login', { email, password });
        this.setAuthData(response.data.user, response.data.access_token);
        router.push('/dashboard');
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          console.error('Login error:', error);
          this.errors = { general: ['登入失敗，請檢查您的憑證。'] };
        }
        this.clearAuthData(); // 登入失敗，清除任何舊的認證信息
        throw error; // 重新拋出錯誤讓組件捕獲
      }
    },

    async logout() {
      try {
        await axios.post('/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.clearAuthData();
        router.push('/login');
      }
    },

    async fetchUser() {
      if (!this.token) {
        this.clearAuthData();
        return;
      }
      try {
        const response = await axios.get('/user');
        this.user = response.data.data; // 注意 Laravel API Resource 的 data 鍵
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        this.clearAuthData(); // 如果獲取用戶失敗，可能 token 無效，清除認證信息
        router.push('/login');
      }
    },
  },
})
