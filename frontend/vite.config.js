import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    // 如果您在開發時前端和後端不在同一個端口，需要代理 API 請求
    proxy: {
      '/api': {
        target: 'http://nginx', // 指向 docker-compose 中的 nginx 服務
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // 保持 /api 路徑
      }
    }
  }
})
