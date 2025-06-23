<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const planId = ref(route.params.id)
const isEditing = ref(!!planId.value)

const form = ref({
  name: '',
  price: 0,
  description: '',
  features: [], // array of strings
  newFeature: '', // for adding new features
  is_active: true,
})

const loading = ref(true)
const submitLoading = ref(false)
const errors = ref({})
const successMessage = ref('')

const fetchPlan = async () => {
  if (!isEditing.value) {
    loading.value = false
    return
  }
  try {
    const response = await axios.get(`/admin/plans/${planId.value}`)
    const planData = response.data.data
    form.value.name = planData.name
    form.value.price = planData.price
    form.value.description = planData.description
    form.value.features = Array.isArray(planData.features) ? planData.features : []
    form.value.is_active = planData.is_active
  } catch (err) {
    console.error('Failed to fetch plan:', err)
    alert('無法載入方案數據。')
    router.push({ name: 'admin-plans' })
  } finally {
    loading.value = false
  }
}

const addFeature = () => {
  if (form.value.newFeature.trim() !== '') {
    form.value.features.push(form.value.newFeature.trim())
    form.value.newFeature = ''
  }
}

const removeFeature = (index) => {
  form.value.features.splice(index, 1)
}

const handleSubmit = async () => {
  submitLoading.value = true
  errors.value = {}
  successMessage.value = ''

  try {
    let response;
    const dataToSend = { ...form.value };
    delete dataToSend.newFeature; // 移除不需要的欄位

    if (isEditing.value) {
      response = await axios.put(`/admin/plans/${planId.value}`, dataToSend)
    } else {
      response = await axios.post('/admin/plans', dataToSend)
    }
    successMessage.value = response.data.message || '操作成功！'
    setTimeout(() => {
      router.push({ name: 'admin-plans' })
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

onMounted(fetchPlan)
</script>

<template>
  <div class="admin-form-container">
    <h2>{{ isEditing ? '編輯方案' : '新增方案' }}</h2>
    <div v-if="loading">載入中...</div>
    <form v-else @submit.prevent="handleSubmit">
      <div v-if="errors.general" class="error-message">{{ errors.general[0] }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div class="form-group">
        <label for="name">方案名稱:</label>
        <input type="text" id="name" v-model="form.name" required />
        <div v-if="errors.name" class="error-message">{{ errors.name[0] }}</div>
      </div>

      <div class="form-group">
        <label for="price">價格:</label>
        <input type="number" id="price" v-model="form.price" required min="0" step="0.01" />
        <div v-if="errors.price" class="error-message">{{ errors.price[0] }}</div>
      </div>

      <div class="form-group">
        <label for="description">描述:</label>
        <textarea id="description" v-model="form.description"></textarea>
        <div v-if="errors.description" class="error-message">{{ errors.description[0] }}</div>
      </div>

      <div class="form-group">
        <label>特點:</label>
        <div class="feature-input-group" style="display:flex; gap: 5px; margin-bottom: 10px;">
          <input type="text" v-model="form.newFeature" placeholder="新增特點..." @keyup.enter="addFeature" style="flex-grow: 1;"/>
          <button type="button" @click="addFeature" style="padding: 8px 12px; background-color: #28a745; color: white; border-radius: 4px; cursor: pointer;">新增</button>
        </div>
        <ul v-if="form.features.length > 0" style="list-style-type: none; padding: 0;">
          <li v-for="(feature, index) in form.features" :key="index" style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px dashed #eee;">
            <span>{{ feature }}</span>
            <button type="button" @click="removeFeature(index)" style="background-color: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer;">移除</button>
          </li>
        </ul>
        <div v-if="errors.features" class="error-message">{{ errors.features[0] }}</div>
      </div>

      <div class="form-group form-group-checkbox">
        <input type="checkbox" id="is_active" v-model="form.is_active" />
        <label for="is_active">是否啟用</label>
        <div v-if="errors.is_active" class="error-message">{{ errors.is_active[0] }}</div>
      </div>

      <div class="form-actions">
        <button type="button" @click="router.push({ name: 'admin-plans' })" class="cancel-button">取消</button>
        <button type="submit" :disabled="submitLoading" class="submit-button">
          {{ submitLoading ? '提交中...' : (isEditing ? '更新' : '創建') }}
        </button>
      </div>
    </form>
  </div>
</template>
