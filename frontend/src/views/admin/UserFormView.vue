<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const userId = ref(route.params.id)
const isEditing = ref(!!userId.value)

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  is_admin: false,
})

const loading = ref(true)
const submitLoading = ref(false)
const errors = ref({})
const successMessage = ref('')

const fetchUser = async () => {
  if (!isEditing.value) {
    loading.value = false
    return
  }
  try {
    const response = await axios.get(`/admin/users/${userId.value}`)
    const userData = response.data.data
    form.value.name = userData.name
    form.value.email = userData.email
    form.value.is_admin = userData.is_admin
  } catch (err) {
    console.error('Failed to fetch user:', err)
    alert('無法載入用戶數據。')
    router.push({ name: 'admin-users' })
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitLoading.value = true
  errors.value = {}
  successMessage.value = ''

  try {
    let response;
    if (isEditing.value) {
      response = await axios.put(`/admin/users/${userId.value}`, form.value)
    } else {
      response = await axios.post('/admin/users', form.value)
    }
    successMessage.value = response.data.message || '操作成功！'
    setTimeout(() => {
      router.push({ name: 'admin-users' })
    }, 1500)
  } catch (err) {
    if (err.response && err.response.status === 422) {
      errors.value = err.response.data.errors
    } else {
      console.error('Operation failed:', err)
      errors.value.general = ['操作失敗，請稍後再試。']
    }
  } finally {
    submitLoading.value = false
  }
}

onMounted(fetchUser)
</script>

<template>
  <div class="admin-form-container">
    <h2>{{ isEditing ? '編輯用戶' : '新增用戶' }}</h2>
    <div v-if="loading">載入中...</div>
    <form v-else @submit.prevent="handleSubmit">
      <div v-if="errors.general" class="error-message">{{ errors.general[0] }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div class="form-group">
        <label for="name">姓名:</label>
        <input type="text" id="name" v-model="form.name" required />
        <div v-if="errors.name" class="error-message">{{ errors.name[0] }}</div>
      </div>

      <div class="form-group">
        <label for="email">電子郵件:</label>
        <input type="email" id="email" v-model="form.email" required />
        <div v-if="errors.email" class="error-message">{{ errors.email[0] }}</div>
      </div>

      <div class="form-group">
        <label for="password">密碼:</label>
        <input type="password" id="password" v-model="form.password" :required="!isEditing" />
        <div v-if="errors.password" class="error-message">{{ errors.password[0] }}</div>
      </div>

      <div class="form-group">
        <label for="password_confirmation">確認密碼:</label>
        <input type="password" id="password_confirmation" v-model="form.password_confirmation" :required="!isEditing" />
      </div>

      <div class="form-group form-group-checkbox">
        <input type="checkbox" id="is_admin" v-model="form.is_admin" />
        <label for="is_admin">是否為管理員</label>
        <div v-if="errors.is_admin" class="error-message">{{ errors.is_admin[0] }}</div>
      </div>

      <div class="form-actions">
        <button type="button" @click="router.push({ name: 'admin-users' })" class="cancel-button">取消</button>
        <button type="submit" :disabled="submitLoading" class="submit-button">
          {{ submitLoading ? '提交中...' : (isEditing ? '更新' : '創建') }}
        </button>
      </div>
    </form>
  </div>
</template>
