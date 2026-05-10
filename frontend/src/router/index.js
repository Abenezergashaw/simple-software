import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public
    { path: '/', component: () => import('@/views/public/HomeView.vue') },
    { path: '/portfolio', component: () => import('@/views/public/PortfolioView.vue') },

    // Admin
    { path: '/admin/login', component: () => import('@/views/admin/LoginView.vue') },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', component: () => import('@/views/admin/DashboardView.vue') },
        { path: 'projects', component: () => import('@/views/admin/ProjectsView.vue') },
        { path: 'projects/:id', component: () => import('@/views/admin/ProjectDetailView.vue') },
        { path: 'projects/new', component: () => import('@/views/admin/ProjectFormView.vue') },
        { path: 'finance', component: () => import('@/views/admin/FinanceView.vue'), meta: { adminOnly: true } },
        { path: 'services', component: () => import('@/views/admin/ServicesView.vue'), meta: { adminOnly: true } },
        { path: 'about', component: () => import('@/views/admin/AboutView.vue'), meta: { adminOnly: true } },
        { path: 'contacts', component: () => import('@/views/admin/ContactsView.vue'), meta: { adminOnly: true } },
        { path: 'team', component: () => import('@/views/admin/TeamView.vue'), meta: { adminOnly: true } },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, saved) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return saved || { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) return next('/admin/login');
  if (to.meta.adminOnly && auth.user?.role !== 'ADMIN') return next('/admin/dashboard');
  next();
});

export default router;
