<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/api'
import { useRouter } from 'vue-router'

const users = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()

const fetchUsers = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('/admin/users')
    users.value = response.data.data // Laravel API Resource 響應
  } catch (err) {
    console.error('Failed to fetch users:', err)
    error.value = '無法載入用戶列表。'
  } finally {
    loading.value = false
  }
}

const editUser = (id) => {
  router.push({ name: 'admin-users-edit', params: { id } })
}

const deleteUser = async (id) => {
  if (confirm('您確定要刪除此用戶嗎？')) {
    try {
      await axios.delete(`/admin/users/${id}`)
      await fetchUsers() // 重新載入列表
    } catch (err) {
      console.error('Failed to delete user:', err)
      alert('刪除用戶失敗。')
    }
  }
}

onMounted(fetchUsers)
</script>

<template>
  <div class="admin-user-list">
    <h2>管理員 - 用戶列表</h2>
    <button @click="router.push({ name: 'admin-users-create' })" class="add-button">新增用戶</button>

    <div v-if="loading">載入中...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>電子郵件</th>
            <th>管理員</th>
            <th>動作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.is_admin ? '是' : '否' }}</td>
            <td>
              <button @click="editUser(user.id)" class="edit">編輯</button>
              <button @click="deleteUser(user.id)" class="delete">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="users.length === 0">沒有用戶。</p>
    </div>
  </div>
</template>

<style scoped>
.admin-user-list {
  padding: 20px;
}
.add-button {
  background-color: #007bff;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  float: right;
}
.add-button:hover {
  background-color: #0056b3;
}
</style>
