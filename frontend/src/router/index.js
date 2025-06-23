import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('@/views/admin/UserListView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/users/create',
      name: 'admin-users-create',
      component: () => import('@/views/admin/UserFormView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/users/edit/:id',
      name: 'admin-users-edit',
      component: () => import('@/views/admin/UserFormView.vue'),
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/plans',
      name: 'admin-plans',
      component: () => import('@/views/admin/PlanListView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/plans/create',
      name: 'admin-plans-create',
      component: () => import('@/views/admin/PlanFormView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/plans/edit/:id',
      name: 'admin-plans-edit',
      component: () => import('@/views/admin/PlanFormView.vue'),
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 如果用戶尚未加載，嘗試從本地儲存加載
  if (!authStore.user && authStore.token) {
    await authStore.fetchUser();
  }

  const isLoggedIn = authStore.isLoggedIn;
  const isAdmin = authStore.isAdmin;

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 需要認證但未登入，重定向到登入頁
    next('/login');
  } else if (to.meta.requiresAdmin && !isAdmin) {
    // 需要管理員權限但不是管理員，重定向到儀表板或首頁
    next('/dashboard'); // 或者 next('/')
  } else if ((to.name === 'login' || to.name === 'register') && isLoggedIn) {
    // 已登入用戶嘗試訪問登入或註冊頁面，重定向到儀表板
    next('/dashboard');
  } else {
    next();
  }
});


export default router

