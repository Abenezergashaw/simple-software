<template>
  <div>
    <div class="mb-8">
      <h1 class="font-display text-2xl font-semibold text-white">Finance Reports</h1>
      <p class="text-muted text-sm mt-1">Track revenue, expenses, and profit across all projects.</p>
    </div>

    <!-- Filters -->
    <div class="card p-5 mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label class="label text-xs">From</label>
        <input v-model="filters.from" type="date" class="input-field text-sm py-2" />
      </div>
      <div>
        <label class="label text-xs">To</label>
        <input v-model="filters.to" type="date" class="input-field text-sm py-2" />
      </div>
      <div>
        <label class="label text-xs">Category</label>
        <select v-model="filters.category" class="select-field text-sm py-2">
          <option value="ALL">All</option>
          <option value="WEB">Web</option>
          <option value="MOBILE">Mobile</option>
          <option value="DESKTOP">Desktop</option>
        </select>
      </div>
      <div>
        <label class="label text-xs">Payment Status</label>
        <select v-model="filters.paymentStatus" class="select-field text-sm py-2">
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="PARTIAL">Partial</option>
          <option value="PAID">Paid</option>
        </select>
      </div>
      <button @click="fetchReports" class="btn-gold text-sm px-5 py-2">Apply Filters</button>
      <button @click="resetFilters" class="btn-outline text-sm px-5 py-2">Reset</button>
    </div>

    <!-- Summary Cards -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="card p-5">
        <p class="text-muted text-xs mb-1">Total Received</p>
        <p class="text-muted text-xs mb-2">Money clients have paid</p>
        <p class="text-emerald-400 font-display text-2xl font-semibold">{{ fmt(summary.totalRevenue) }}</p>
      </div>
      <div class="card p-5">
        <p class="text-muted text-xs mb-1">Total Outstanding</p>
        <p class="text-muted text-xs mb-2">Still unpaid by clients</p>
        <p class="text-yellow-400 font-display text-2xl font-semibold">{{ fmt(summary.totalOutstanding) }}</p>
      </div>
      <div class="card p-5">
        <p class="text-muted text-xs mb-1">Total Expenses</p>
        <p class="text-muted text-xs mb-2">Money spent on projects</p>
        <p class="text-red-400 font-display text-2xl font-semibold">{{ fmt(summary.totalExpenses) }}</p>
      </div>
      <div class="card p-5">
        <p class="text-muted text-xs mb-1">Net Profit</p>
        <p class="text-muted text-xs mb-2">Received minus Expenses</p>
        <p :class="['font-display text-2xl font-semibold', summary.totalProfit >= 0 ? 'text-gold' : 'text-red-400']">{{ fmt(summary.totalProfit) }}</p>
      </div>
    </div>

    <!-- Chart -->
    <div class="card p-6 mb-6">
      <h2 class="text-white font-semibold mb-4">Amount Received vs Expenses</h2>
      <div v-if="reports.length > 0" style="height: 260px">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
      <p v-else class="text-center text-muted py-10">No data for selected filters.</p>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div v-if="loading" class="p-6 space-y-3">
        <div v-for="i in 5" :key="i" class="skeleton h-12 rounded"></div>
      </div>
      <table v-else-if="reports.length > 0" class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/5 text-muted text-xs uppercase">
            <th class="text-left px-5 py-3 font-medium">Project</th>
            <th class="text-left px-5 py-3 font-medium hidden md:table-cell">Client</th>
            <th class="text-left px-5 py-3 font-medium hidden lg:table-cell">Category</th>
            <th class="text-right px-5 py-3 font-medium">Received</th>
            <th class="text-right px-5 py-3 font-medium hidden md:table-cell">Outstanding</th>
            <th class="text-right px-5 py-3 font-medium hidden md:table-cell">Expenses</th>
            <th class="text-right px-5 py-3 font-medium">Profit</th>
            <th class="text-left px-5 py-3 font-medium hidden sm:table-cell">Payment</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in reports" :key="r.id" class="border-b border-white/5 hover:bg-navy-medium/40 transition-colors cursor-pointer" @click="$router.push('/admin/projects/' + r.projectId)">
            <td class="px-5 py-4 text-white font-medium">{{ r.project.title }}</td>
            <td class="px-5 py-4 text-muted hidden md:table-cell">{{ r.project.clientName }}</td>
            <td class="px-5 py-4 hidden lg:table-cell"><span :class="['badge', categoryBadge(r.project.category)]">{{ r.project.category }}</span></td>
            <td class="px-5 py-4 text-emerald-400 text-right">{{ fmt(r.totalRevenue) }}</td>
            <td class="px-5 py-4 text-right hidden md:table-cell" :class="(r.budget - r.totalRevenue) > 0 ? 'text-yellow-400' : 'text-muted'">{{ fmt(r.budget - r.totalRevenue) }}</td>
            <td class="px-5 py-4 text-red-400 text-right hidden md:table-cell">{{ fmt(r.totalExpenses) }}</td>
            <td class="px-5 py-4 text-right font-semibold" :class="r.totalRevenue - r.totalExpenses >= 0 ? 'text-gold' : 'text-red-400'">{{ fmt(r.totalRevenue - r.totalExpenses) }}</td>
            <td class="px-5 py-4 hidden sm:table-cell"><span :class="['badge', paymentBadge(r.paymentStatus)]">{{ r.paymentStatus }}</span></td>
          </tr>
        </tbody>
        <tfoot class="border-t border-white/10">
          <tr>
            <td class="px-5 py-4 text-white font-semibold" colspan="3">Totals</td>
            <td class="px-5 py-4 text-emerald-400 font-semibold text-right">{{ fmt(summary.totalRevenue) }}</td>
            <td class="px-5 py-4 text-yellow-400 font-semibold text-right hidden md:table-cell">{{ fmt(summary.totalOutstanding) }}</td>
            <td class="px-5 py-4 text-red-400 font-semibold text-right hidden md:table-cell">{{ fmt(summary.totalExpenses) }}</td>
            <td class="px-5 py-4 font-bold text-right" :class="summary.totalProfit >= 0 ? 'text-gold' : 'text-red-400'">{{ fmt(summary.totalProfit) }}</td>
            <td class="hidden sm:table-cell"></td>
          </tr>
        </tfoot>
      </table>
      <p v-else-if="!loading" class="text-center text-muted py-16">No finance records found for the selected filters.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import api from '@/api';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const reports = ref([]);
const loading = ref(true);
const filters = ref({ from: '', to: '', category: 'ALL', paymentStatus: 'ALL' });

const summary = computed(() => ({
  totalRevenue: reports.value.reduce((s, r) => s + r.totalRevenue, 0),
  totalOutstanding: reports.value.reduce((s, r) => s + (r.budget - r.totalRevenue), 0),
  totalExpenses: reports.value.reduce((s, r) => s + r.totalExpenses, 0),
  totalProfit: reports.value.reduce((s, r) => s + (r.totalRevenue - r.totalExpenses), 0),
}));

const chartData = computed(() => ({
  labels: reports.value.map((r) => r.project.title.substring(0, 14) + (r.project.title.length > 14 ? '…' : '')),
  datasets: [
    { label: 'Amount Received', data: reports.value.map((r) => r.totalRevenue), backgroundColor: 'rgba(52,211,153,0.7)', borderRadius: 4 },
    { label: 'Expenses', data: reports.value.map((r) => r.totalExpenses), backgroundColor: 'rgba(248,113,113,0.7)', borderRadius: 4 },
  ],
}));

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#7B8AAB' } } }, scales: { x: { ticks: { color: '#7B8AAB' }, grid: { color: 'rgba(255,255,255,0.05)' } }, y: { ticks: { color: '#7B8AAB' }, grid: { color: 'rgba(255,255,255,0.05)' } } } };

const fmt = (v) => `ETB ${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const categoryBadge = (c) => ({ WEB: 'bg-blue-500/20 text-blue-300', MOBILE: 'bg-purple-500/20 text-purple-300', DESKTOP: 'bg-emerald-500/20 text-emerald-300' }[c] || '');
const paymentBadge = (s) => ({ PENDING: 'bg-yellow-500/20 text-yellow-300', PARTIAL: 'bg-blue-500/20 text-blue-300', PAID: 'bg-emerald-500/20 text-emerald-300' }[s] || '');

const fetchReports = async () => {
  loading.value = true;
  const params = {};
  if (filters.value.from) params.from = filters.value.from;
  if (filters.value.to) params.to = filters.value.to;
  if (filters.value.category !== 'ALL') params.category = filters.value.category;
  if (filters.value.paymentStatus !== 'ALL') params.paymentStatus = filters.value.paymentStatus;
  const { data } = await api.get('/finance/reports', { params });
  reports.value = data;
  loading.value = false;
};

const resetFilters = () => { filters.value = { from: '', to: '', category: 'ALL', paymentStatus: 'ALL' }; fetchReports(); };

onMounted(fetchReports);
</script>
