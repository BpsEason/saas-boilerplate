<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  // 登出後自動跳轉到登入頁，路由守衛會處理
}
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <template v-if="!authStore.isLoggedIn">
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </template>
      <template v-else>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/admin/users">Admin Users</RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/admin/plans">Admin Plans</RouterLink>
        <button @click="handleLogout" class="nav-button">Logout</button>
      </template>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  padding: 20px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: center;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 15px;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.nav-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

main {
  padding: 20px;
}
</style>
