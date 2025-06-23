import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// 創建 Axios 實例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 從環境變數獲取基礎 URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // 確保發送跨域請求時包含 cookie
});

// 請求攔截器：添加 JWT Token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器：處理錯誤響應，特別是 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    if (error.response && error.response.status === 401 && authStore.isLoggedIn) {
      // 如果收到 401 且用戶之前是登入狀態，表示 token 可能過期或無效
      console.error('Unauthorized, logging out...');
      await authStore.logout(); // 清除認證信息並重定向到登入頁
      router.push('/login'); // 確保跳轉
    }
    return Promise.reject(error);
  }
);

export default api;
