<template>
  <div class="min-h-screen bg-navy flex">
    <!-- Sidebar -->
    <aside :class="['fixed inset-y-0 left-0 z-30 w-64 bg-navy-light border-r border-white/5 flex flex-col transition-transform duration-300', sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-5 h-16 border-b border-white/5">
        <div class="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-navy font-bold text-sm flex-shrink-0">S</div>
        <span class="font-display font-semibold text-white text-sm leading-tight">Simple <span class="text-gold">Software</span></span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <router-link v-for="item in navItems" :key="item.to" :to="item.to" class="admin-sidebar-link" active-class="active"
          v-show="!item.adminOnly || user?.role === 'ADMIN'"
        >
          <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
          {{ item.label }}
          <span v-if="item.badge" class="ml-auto bg-gold text-navy text-xs font-bold px-1.5 py-0.5 rounded-full">{{ item.badge }}</span>
        </router-link>
      </nav>

      <!-- User -->
      <div class="px-3 py-4 border-t border-white/5">
        <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-navy-medium transition-colors">
          <div class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-sm flex-shrink-0">
            {{ user?.name?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="min-w-0">
            <p class="text-white text-sm font-medium truncate">{{ user?.name }}</p>
            <p class="text-muted text-xs capitalize">{{ user?.role?.toLowerCase() }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:bg-red-500/10 hover:text-red-400 transition-all text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Sign Out
        </button>
        <a href="/" class="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:text-white transition-all text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          View Website
        </a>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-20 bg-black/50 lg:hidden" @click="sidebarOpen = false"></div>

    <!-- Main content -->
    <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
      <!-- Topbar -->
      <header class="sticky top-0 z-10 h-16 bg-navy-light/80 backdrop-blur border-b border-white/5 flex items-center px-4 gap-4">
        <button class="lg:hidden text-muted hover:text-white p-1" @click="sidebarOpen = !sidebarOpen">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div class="flex-1"></div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-sm">
            {{ user?.name?.charAt(0)?.toUpperCase() }}
          </div>
          <span class="text-white text-sm font-medium hidden sm:block">{{ user?.name }}</span>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 md:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const router = useRouter();
const sidebarOpen = ref(false);

const handleLogout = () => { auth.logout(); router.push('/admin/login'); };

const icon = (d) => defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d })]) });

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: icon('M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z') },
  { to: '/admin/projects', label: 'Projects', icon: icon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2') },
  { to: '/admin/finance', label: 'Finance', icon: icon('M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'), adminOnly: true },
  { to: '/admin/services', label: 'Services', icon: icon('M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'), adminOnly: true },
  { to: '/admin/about', label: 'About Us', icon: icon('M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'), adminOnly: true },
  { to: '/admin/contacts', label: 'Contacts', icon: icon('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'), adminOnly: true },
  { to: '/admin/team', label: 'Team', icon: icon('M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'), adminOnly: true },
];
</script>
