import { createRouter, createWebHistory } from '@ionic/vue-router'

const routes = [
  { path: '/', component: () => import('../pages/wallet-detail.vue') },
  { path: '/wallet', component: () => import('../pages/wallet.vue') },
  { path: '/wallet/:id', component: () => import('../pages/wallet-detail.vue') },
  { path: '/categories/:id', component: () => import('../pages/categories.vue') },
  { path: '/statistics', component: () => import('../pages/statistics.vue') },
  { path: '/profile', component: () => import('../pages/profile.vue') },
  { path: '/login', component: () => import('../pages/login.vue') },
  { path: '/register', component: () => import('../pages/register.vue') },
]

export const router = createRouter({
  history: createWebHistory('/'),
  routes,
})
