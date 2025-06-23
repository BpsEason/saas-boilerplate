<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const loading = ref(false)
const successMessage = ref('')

const handleRegister = async () => {
  loading.value = true
  successMessage.value = ''
  try {
    await authStore.register(name.value, email.value, password.value, password_confirmation.value)
    successMessage.value = '註冊成功！即將跳轉...'
  } catch (error) {
    // 錯誤已在 store 中處理並設置，這裡只需確保 loading 狀態和清除成功訊息
    console.error("Registration attempt failed:", error);
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister">
    <h2>註冊</h2>
    <div v-if="authStore.errors.general" class="error-message">
      {{ authStore.errors.general[0] }}
    </div>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <div>
      <label for="name">姓名:</label>
      <input type="text" id="name" v-model="name" required />
      <div v-if="authStore.errors.name" class="error-message">
        {{ authStore.errors.name[0] }}
      </div>
    </div>
    <div>
      <label for="email">電子郵件:</label>
      <input type="email" id="email" v-model="email" required />
      <div v-if="authStore.errors.email" class="error-message">
        {{ authStore.errors.email[0] }}
      </div>
    </div>
    <div>
      <label for="password">密碼:</label>
      <input type="password" id="password" v-model="password" required />
      <div v-if="authStore.errors.password" class="error-message">
        {{ authStore.errors.password[0] }}
      </div>
    </div>
    <div>
      <label for="password_confirmation">確認密碼:</label>
      <input type="password" id="password_confirmation" v-model="password_confirmation" required />
    </div>
    <button type="submit" :disabled="loading">
      {{ loading ? '註冊中...' : '註冊' }}
    </button>
  </form>
</template>
