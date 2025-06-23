<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/api'
import { useRouter } from 'vue-router'

const plans = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()

const fetchPlans = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('/admin/plans')
    plans.value = response.data.data // Laravel API Resource 響應
  } catch (err) {
    console.error('Failed to fetch plans:', err)
    error.value = '無法載入方案列表。'
  } finally {
    loading.value = false
  }
}

const editPlan = (id) => {
  router.push({ name: 'admin-plans-edit', params: { id } })
}

const deletePlan = async (id) => {
  if (confirm('您確定要刪除此方案嗎？此操作不可逆！')) {
    try {
      await axios.delete(`/admin/plans/${id}`)
      await fetchPlans() // 重新載入列表
    } catch (err) {
      console.error('Failed to delete plan:', err)
      alert('刪除方案失敗。')
    }
  }
}

onMounted(fetchPlans)
</script>

<template>
  <div class="admin-plan-list">
    <h2>管理員 - 方案列表</h2>
    <button @click="router.push({ name: 'admin-plans-create' })" class="add-button">新增方案</button>

    <div v-if="loading">載入中...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>名稱</th>
            <th>價格</th>
            <th>描述</th>
            <th>特點</th>
            <th>啟用中</th>
            <th>動作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in plans" :key="plan.id">
            <td>{{ plan.id }}</td>
            <td>{{ plan.name }}</td>
            <td>{{ plan.price }}</td>
            <td>{{ plan.description }}</td>
            <td>{{ plan.features ? plan.features.join(', ') : '-' }}</td>
            <td>{{ plan.is_active ? '是' : '否' }}</td>
            <td>
              <button @click="editPlan(plan.id)" class="edit">編輯</button>
              <button @click="deletePlan(plan.id)" class="delete">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="plans.length === 0">沒有方案。</p>
    </div>
  </div>
</template>

<style scoped>
.admin-plan-list {
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
