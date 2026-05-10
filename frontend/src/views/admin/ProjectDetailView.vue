<template>
  <div v-if="loading" class="space-y-4">
    <div class="skeleton h-8 w-1/3 rounded-lg"></div>
    <div class="skeleton h-48 rounded-xl"></div>
  </div>
  <div v-else-if="project">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <button @click="$router.back()" class="flex items-center gap-2 text-muted hover:text-white text-sm mb-2 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Back to Projects
        </button>
        <h1 class="font-display text-2xl font-semibold text-white">{{ project.title }}</h1>
        <p class="text-muted text-sm mt-1">{{ project.clientName }}</p>
      </div>
      <div class="flex gap-2">
        <span :class="['badge text-sm px-3 py-1', statusBadge(project.status)]">{{ formatStatus(project.status) }}</span>
        <span :class="['badge text-sm px-3 py-1', project.isPublic ? 'bg-gold/20 text-gold' : 'bg-gray-500/20 text-gray-400']">{{ project.isPublic ? 'Public' : 'Private' }}</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 bg-navy-medium/50 p-1 rounded-lg w-fit">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="['px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === tab ? 'bg-navy-light text-white shadow-sm' : 'text-muted hover:text-white']">{{ tab }}</button>
    </div>

    <!-- Overview Tab -->
    <div v-if="activeTab === 'Overview'" class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <h2 class="text-white font-semibold mb-3">Description</h2>
          <p class="text-muted leading-relaxed">{{ project.fullDesc }}</p>
          <div class="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5 text-sm">
            <div><p class="text-muted mb-1">Start Date</p><p class="text-white">{{ formatDate(project.startDate) }}</p></div>
            <div><p class="text-muted mb-1">End Date</p><p class="text-white">{{ formatDate(project.endDate) }}</p></div>
            <div><p class="text-muted mb-1">Live URL</p><a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="text-gold hover:underline truncate block">{{ project.liveUrl }}</a><span v-else class="text-muted">—</span></div>
          </div>
        </div>
        <!-- Progress -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-white font-semibold">Progress</h2>
            <span class="text-gold font-semibold">{{ project.completionPercent }}%</span>
          </div>
          <div class="w-full h-2 bg-navy-medium rounded-full overflow-hidden mb-6">
            <div class="h-full bg-gold rounded-full transition-all duration-700" :style="{ width: project.completionPercent + '%' }"></div>
          </div>
          <!-- Milestones -->
          <h3 class="text-white text-sm font-medium mb-3">Milestones</h3>
          <div class="space-y-2">
            <div v-for="m in project.milestones" :key="m.id" class="flex items-center gap-3 p-3 rounded-lg bg-navy/50">
              <button @click="cycleMilestone(m)" :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all', m.status === 'DONE' ? 'bg-gold border-gold' : m.status === 'IN_PROGRESS' ? 'border-blue-400 bg-blue-400/20' : 'border-muted/40']">
                <svg v-if="m.status === 'DONE'" class="w-2.5 h-2.5 text-navy" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                <svg v-else-if="m.status === 'IN_PROGRESS'" class="w-2 h-2 text-blue-400" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg>
              </button>
              <div class="flex-1 min-w-0">
                <p :class="['text-sm', m.status === 'DONE' ? 'text-muted line-through' : 'text-white']">{{ m.title }}</p>
                <p v-if="m.dueDate" class="text-muted text-xs">Due: {{ formatDate(m.dueDate) }}</p>
              </div>
              <span :class="['badge text-xs', milestoneBadge(m.status)]">{{ m.status }}</span>
            </div>
          </div>
          <button @click="showMilestoneForm = true" class="mt-3 text-gold text-sm hover:text-gold-light transition-colors flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Milestone
          </button>
        </div>
      </div>

      <!-- Right column -->
      <div class="space-y-6">
        <!-- Finance summary (admin only) -->
        <div v-if="isAdmin && project.finance" class="card p-5">
          <h2 class="text-white font-semibold mb-4">Finance Summary</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-muted">Contract Value</span><span class="text-white">{{ fmt(project.finance.budget) }}</span></div>
            <div class="flex justify-between"><span class="text-muted">Amount Received</span><span class="text-emerald-400">{{ fmt(project.finance.totalRevenue) }}</span></div>
            <div class="flex justify-between"><span class="text-muted">Outstanding</span><span :class="project.finance.budget - project.finance.totalRevenue > 0 ? 'text-yellow-400' : 'text-muted'">{{ fmt(project.finance.budget - project.finance.totalRevenue) }}</span></div>
            <div class="flex justify-between"><span class="text-muted">Expenses</span><span class="text-red-400">{{ fmt(project.finance.totalExpenses) }}</span></div>
            <div class="flex justify-between pt-2 border-t border-white/5"><span class="text-white font-medium">Net Profit</span><span :class="['font-semibold', project.finance.totalRevenue - project.finance.totalExpenses >= 0 ? 'text-gold' : 'text-red-400']">{{ fmt(project.finance.totalRevenue - project.finance.totalExpenses) }}</span></div>
            <div class="flex justify-between"><span class="text-muted">Payment</span><span :class="['badge text-xs', paymentBadge(project.finance.paymentStatus)]">{{ project.finance.paymentStatus }}</span></div>
          </div>
          <button @click="activeTab = 'Finance'" class="btn-outline w-full text-center justify-center text-sm py-2 mt-4">Edit Finance</button>
        </div>
        <!-- Thumbnail -->
        <div v-if="project.thumbnailUrl" class="card overflow-hidden">
          <img :src="project.thumbnailUrl" :alt="project.title" class="w-full h-40 object-cover" />
        </div>
      </div>
    </div>

    <!-- Notes Tab -->
    <div v-if="activeTab === 'Notes'" class="max-w-2xl">
      <div class="card p-6 mb-4">
        <textarea v-model="newNote" rows="3" class="input-field resize-none mb-3" placeholder="Add an internal note..."></textarea>
        <button @click="addNote" :disabled="!newNote.trim()" class="btn-gold text-sm px-5 py-2">Post Note</button>
      </div>
      <div class="space-y-4">
        <div v-for="note in project.notes" :key="note.id" class="card p-5">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-sm flex-shrink-0">{{ note.user.name.charAt(0) }}</div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <p class="text-white text-sm font-medium">{{ note.user.name }}</p>
                <p class="text-muted text-xs">{{ formatDateFull(note.createdAt) }}</p>
              </div>
              <p class="text-slate-300 text-sm leading-relaxed">{{ note.content }}</p>
            </div>
            <button @click="deleteNote(note.id)" class="text-muted hover:text-red-400 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
          </div>
        </div>
        <p v-if="project.notes?.length === 0" class="text-center text-muted py-8">No notes yet. Be the first to add one.</p>
      </div>
    </div>

    <!-- Finance Tab (admin only) -->
    <div v-if="activeTab === 'Finance' && isAdmin" class="max-w-lg">
      <div class="card p-6">
        <h2 class="text-white font-semibold mb-5">Project Financials</h2>
        <form @submit.prevent="saveFinance" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Contract Value (ETB) <span class="text-muted font-normal normal-case">— what you quoted the client</span></label>
              <input v-model="finance.budget" type="number" step="0.01" class="input-field" placeholder="0.00" />
            </div>
            <div>
              <label class="label">Amount Received (ETB) <span class="text-muted font-normal normal-case">— what the client has paid</span></label>
              <input v-model="finance.totalRevenue" type="number" step="0.01" class="input-field" placeholder="0.00" />
            </div>
            <div>
              <label class="label">Outstanding (Unpaid) <span class="text-muted font-normal normal-case">— auto</span></label>
              <div class="input-field flex items-center" :class="outstanding > 0 ? 'text-yellow-400' : 'text-emerald-400'">{{ fmt(outstanding) }}</div>
            </div>
            <div>
              <label class="label">Expenses (ETB) <span class="text-muted font-normal normal-case">— what you spent</span></label>
              <input v-model="finance.totalExpenses" type="number" step="0.01" class="input-field" placeholder="0.00" />
            </div>
            <div class="col-span-2">
              <label class="label">Net Profit <span class="text-muted font-normal normal-case">— auto (Received − Expenses)</span></label>
              <div class="input-field flex items-center" :class="profit >= 0 ? 'text-emerald-400' : 'text-red-400'">{{ fmt(profit) }}</div>
            </div>
          </div>
          <div>
            <label class="label">Payment Status</label>
            <select v-model="finance.paymentStatus" class="select-field">
              <option value="PENDING">Pending</option>
              <option value="PARTIAL">Partial</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
          <div>
            <label class="label">Finance Notes</label>
            <textarea v-model="finance.notes" rows="3" class="input-field resize-none" placeholder="Any notes about payments, invoices, etc."></textarea>
          </div>
          <button type="submit" :disabled="savingFinance" class="btn-gold w-full justify-center py-3">{{ savingFinance ? 'Saving...' : 'Save Financials' }}</button>
        </form>
      </div>
    </div>
  </div>

  <!-- Add Milestone Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showMilestoneForm" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showMilestoneForm = false">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative bg-navy-light border border-white/10 rounded-2xl w-full max-w-md p-6">
          <h3 class="font-display text-xl font-semibold text-white mb-4">Add Milestone</h3>
          <form @submit.prevent="addMilestone" class="space-y-4">
            <div><label class="label">Title *</label><input v-model="mForm.title" class="input-field" required /></div>
            <div><label class="label">Due Date</label><input v-model="mForm.dueDate" type="date" class="input-field" /></div>
            <div class="flex gap-3"><button type="button" @click="showMilestoneForm = false" class="btn-outline flex-1 justify-center py-2.5 text-sm">Cancel</button><button type="submit" class="btn-gold flex-1 justify-center py-2.5 text-sm">Add</button></div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import api from '@/api';

const route = useRoute();
const { user } = storeToRefs(useAuthStore());
const isAdmin = computed(() => user.value?.role === 'ADMIN');

const project = ref(null);
const loading = ref(true);
const activeTab = ref('Overview');
const tabs = computed(() => ['Overview', 'Notes', ...(isAdmin.value ? ['Finance'] : [])]);
const newNote = ref('');
const showMilestoneForm = ref(false);
const mForm = ref({ title: '', dueDate: '' });
const finance = ref({ budget: 0, totalRevenue: 0, totalExpenses: 0, paymentStatus: 'PENDING', notes: '' });
const savingFinance = ref(false);

const outstanding = computed(() => (parseFloat(finance.value.budget) || 0) - (parseFloat(finance.value.totalRevenue) || 0));
const profit = computed(() => (parseFloat(finance.value.totalRevenue) || 0) - (parseFloat(finance.value.totalExpenses) || 0));

const fmt = (v) => `ETB ${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const formatDateFull = (d) => new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const statusBadge = (s) => ({ PLANNING: 'bg-yellow-500/20 text-yellow-300', IN_PROGRESS: 'bg-blue-500/20 text-blue-300', COMPLETED: 'bg-emerald-500/20 text-emerald-300', ON_HOLD: 'bg-red-500/20 text-red-300' }[s]);
const milestoneBadge = (s) => ({ PENDING: 'bg-gray-500/20 text-gray-400', IN_PROGRESS: 'bg-blue-500/20 text-blue-300', DONE: 'bg-emerald-500/20 text-emerald-300' }[s]);
const paymentBadge = (s) => ({ PENDING: 'bg-yellow-500/20 text-yellow-300', PARTIAL: 'bg-blue-500/20 text-blue-300', PAID: 'bg-emerald-500/20 text-emerald-300' }[s]);
const formatStatus = (s) => ({ PLANNING: 'Planning', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed', ON_HOLD: 'On Hold' }[s] || s);

const fetchProject = async () => {
  loading.value = true;
  const { data } = await api.get(`/projects/${route.params.id}`);
  project.value = data;
  if (data.finance) finance.value = { ...data.finance };
  loading.value = false;
};

const addNote = async () => {
  if (!newNote.value.trim()) return;
  const { data } = await api.post(`/projects/${route.params.id}/notes`, { content: newNote.value });
  project.value.notes.unshift(data);
  newNote.value = '';
};

const deleteNote = async (nid) => {
  await api.delete(`/projects/${route.params.id}/notes/${nid}`);
  project.value.notes = project.value.notes.filter((n) => n.id !== nid);
};

const cycleMilestone = async (m) => {
  const order = ['PENDING', 'IN_PROGRESS', 'DONE'];
  const next = order[(order.indexOf(m.status) + 1) % order.length];
  m.status = next;
  await api.put(`/projects/${route.params.id}/milestones/${m.id}`, { ...m, status: next });
};

const addMilestone = async () => {
  const { data } = await api.post(`/projects/${route.params.id}/milestones`, { ...mForm.value, status: 'PENDING' });
  project.value.milestones.push(data);
  showMilestoneForm.value = false;
  mForm.value = { title: '', dueDate: '' };
};

const saveFinance = async () => {
  savingFinance.value = true;
  await api.put(`/finance/project/${route.params.id}`, finance.value);
  savingFinance.value = false;
};

onMounted(fetchProject);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
