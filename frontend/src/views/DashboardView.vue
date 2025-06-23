<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    await authStore.fetchUser() // 確保用戶數據是最新的
    user.value = authStore.user
  } catch (err) {
    error.value = '無法載入用戶數據。'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="dashboard">
    <h2>用戶儀表板</h2>
    <div v-if="loading">載入中...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="user">
      <p><strong>歡迎，{{ user.name }}！</strong></p>
      <p>您的電子郵件: {{ user.email }}</p>
      <p>管理員狀態: {{ user.is_admin ? '是' : '否' }}</p>
      <p>加入時間: {{ user.created_at }}</p>
    </div>
    <div v-else>
      <p>無法找到用戶數據。請<router-link to="/login">登入</router-link>。</p>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  text-align: center;
  padding: 30px;
}
.dashboard h2 {
  color: var(--color-heading);
  margin-bottom: 25px;
}
.dashboard p {
  margin-bottom: 10px;
  color: var(--color-text);
}
</style>
