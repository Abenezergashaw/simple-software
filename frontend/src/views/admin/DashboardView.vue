<template>
  <div>
    <div class="mb-8">
      <h1 class="font-display text-2xl font-semibold text-white">Dashboard</h1>
      <p class="text-muted text-sm mt-1">Welcome back, {{ user?.name }}. Here's what's happening.</p>
    </div>

    <!-- Stat Cards -->
    <div v-if="loadingSummary" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="i in 4" :key="i" class="skeleton h-28 rounded-xl"></div>
    </div>
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="card p-5">
        <div class="flex items-start justify-between mb-3">
          <p class="text-muted text-sm">{{ stat.label }}</p>
          <div class="w-9 h-9 rounded-lg flex items-center justify-center" :class="stat.bg">
            <component :is="stat.icon" class="w-4 h-4" :class="stat.iconColor" />
          </div>
        </div>
        <p class="text-white font-display text-2xl font-semibold">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Recent Projects -->
    <div class="grid lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-white font-semibold">Recent Projects</h2>
          <router-link to="/admin/projects" class="text-gold text-sm hover:text-gold-light transition-colors">View all</router-link>
        </div>
        <div v-if="loadingProjects" class="space-y-3">
          <div v-for="i in 4" :key="i" class="skeleton h-14 rounded-lg"></div>
        </div>
        <div v-else class="space-y-3">
          <div v-for="p in recentProjects" :key="p.id" class="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-medium transition-colors cursor-pointer" @click="$router.push('/admin/projects/' + p.id)">
            <div class="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden bg-navy-medium">
              <img v-if="p.thumbnailUrl" :src="p.thumbnailUrl" class="w-full h-full object-cover" :alt="p.title" />
              <div v-else class="w-full h-full flex items-center justify-center text-gold/40 text-xs">{{ p.category[0] }}</div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ p.title }}</p>
              <p class="text-muted text-xs">{{ p.clientName }}</p>
            </div>
            <span :class="statusBadge(p.status)" class="badge text-xs flex-shrink-0">{{ formatStatus(p.status) }}</span>
          </div>
        </div>
      </div>

      <!-- Unread Contacts -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-white font-semibold">New Inquiries</h2>
          <router-link to="/admin/contacts" class="text-gold text-sm hover:text-gold-light transition-colors">View all</router-link>
        </div>
        <div v-if="loadingContacts" class="space-y-3">
          <div v-for="i in 3" :key="i" class="skeleton h-16 rounded-lg"></div>
        </div>
        <div v-else-if="contacts.length === 0" class="text-center py-8 text-muted text-sm">No unread messages</div>
        <div v-else class="space-y-3">
          <div v-for="c in contacts.slice(0,5)" :key="c.id" class="p-3 rounded-lg hover:bg-navy-medium transition-colors">
            <div class="flex items-center justify-between mb-1">
              <p class="text-white text-sm font-medium">{{ c.name }}</p>
              <p class="text-muted text-xs">{{ formatDate(c.createdAt) }}</p>
            </div>
            <p class="text-muted text-xs truncate">{{ c.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import api from '@/api';

const { user } = storeToRefs(useAuthStore());
const summary = ref({});
const recentProjects = ref([]);
const contacts = ref([]);
const loadingSummary = ref(true);
const loadingProjects = ref(true);
const loadingContacts = ref(true);

const icon = (d) => defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d })]) });

const stats = computed(() => [
  { label: 'Total Revenue', value: formatMoney(summary.value.totalRevenue), bg: 'bg-gold/10', iconColor: 'text-gold', icon: icon('M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
  { label: 'Total Profit', value: formatMoney(summary.value.totalProfit), bg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', icon: icon('M13 7h8m0 0v8m0-8l-8 8-4-4-6 6') },
  { label: 'Active Projects', value: summary.value.activeProjects ?? '—', bg: 'bg-blue-500/10', iconColor: 'text-blue-400', icon: icon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2') },
  { label: 'Unread Messages', value: summary.value.unreadContacts ?? '—', bg: 'bg-purple-500/10', iconColor: 'text-purple-400', icon: icon('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z') },
]);

const formatMoney = (v) => v != null ? `ETB ${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—';
const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const formatStatus = (s) => ({ PLANNING: 'Planning', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed', ON_HOLD: 'On Hold' }[s] || s);
const statusBadge = (s) => ({ PLANNING: 'bg-yellow-500/20 text-yellow-300', IN_PROGRESS: 'bg-blue-500/20 text-blue-300', COMPLETED: 'bg-emerald-500/20 text-emerald-300', ON_HOLD: 'bg-red-500/20 text-red-300' }[s]);

onMounted(async () => {
  try {
    const [s, p, c] = await Promise.all([
      api.get('/finance/summary'),
      api.get('/projects', { params: { limit: 5 } }),
      api.get('/contacts', { params: { unread: 'true' } }),
    ]);
    summary.value = s.data;
    recentProjects.value = p.data.slice(0, 5);
    contacts.value = c.data;
  } catch {}
  loadingSummary.value = false;
  loadingProjects.value = false;
  loadingContacts.value = false;
});
</script>
