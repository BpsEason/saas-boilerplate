import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth' // 引入 Auth Store

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 在應用程式啟動時嘗試加載用戶資訊 (如果本地有token)
const authStore = useAuthStore()
authStore.loadUserFromLocalStorage()

app.mount('#app')
