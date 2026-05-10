<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-display text-2xl font-semibold text-white">Team Management</h1>
        <p class="text-muted text-sm mt-1">Manage admin and developer accounts.</p>
      </div>
      <button @click="openForm()" class="btn-gold text-sm">+ Add Member</button>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="skeleton h-16 rounded-xl"></div>
    </div>
    <div v-else class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/5 text-muted text-xs uppercase">
            <th class="text-left px-5 py-3 font-medium">Member</th>
            <th class="text-left px-5 py-3 font-medium hidden md:table-cell">Email</th>
            <th class="text-left px-5 py-3 font-medium">Role</th>
            <th class="text-left px-5 py-3 font-medium hidden lg:table-cell">Joined</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-b border-white/5 hover:bg-navy-medium/40 transition-colors">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-sm">{{ u.name.charAt(0).toUpperCase() }}</div>
                <span class="text-white font-medium">{{ u.name }}</span>
                <span v-if="u.id === currentUser?.id" class="text-muted text-xs">(you)</span>
              </div>
            </td>
            <td class="px-5 py-4 text-muted hidden md:table-cell">{{ u.email }}</td>
            <td class="px-5 py-4"><span :class="['badge', u.role === 'ADMIN' ? 'bg-gold/20 text-gold' : 'bg-blue-500/20 text-blue-300']">{{ u.role }}</span></td>
            <td class="px-5 py-4 text-muted hidden lg:table-cell">{{ formatDate(u.createdAt) }}</td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2 justify-end">
                <button @click="openForm(u)" class="p-1.5 text-muted hover:text-white transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                <button v-if="u.id !== currentUser?.id" @click="remove(u)" class="p-1.5 text-muted hover:text-red-400 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showForm = false">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="relative bg-navy-light border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h2 class="font-display text-xl font-semibold text-white mb-5">{{ editing ? 'Edit Member' : 'Add Team Member' }}</h2>
            <form @submit.prevent="save" class="space-y-4">
              <div><label class="label">Full Name *</label><input v-model="form.name" class="input-field" required /></div>
              <div><label class="label">Email *</label><input v-model="form.email" type="email" class="input-field" required :disabled="!!editing" /></div>
              <div><label class="label">{{ editing ? 'New Password (leave blank to keep)' : 'Password *' }}</label><input v-model="form.password" type="password" class="input-field" :required="!editing" /></div>
              <div><label class="label">Role</label>
                <select v-model="form.role" class="select-field">
                  <option value="ADMIN">Admin (full access)</option>
                  <option value="DEVELOPER">Developer (limited access)</option>
                </select>
              </div>
              <p v-if="formError" class="text-red-400 text-sm">{{ formError }}</p>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="showForm = false" class="btn-outline flex-1 justify-center py-3">Cancel</button>
                <button type="submit" :disabled="saving" class="btn-gold flex-1 justify-center py-3">{{ saving ? 'Saving...' : (editing ? 'Update' : 'Create') }}</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import api from '@/api';

const { user: currentUser } = storeToRefs(useAuthStore());
const users = ref([]);
const loading = ref(true);
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);
const formError = ref('');
const form = ref({ name: '', email: '', password: '', role: 'DEVELOPER' });

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const fetchUsers = async () => { loading.value = true; const { data } = await api.get('/users'); users.value = data; loading.value = false; };
const openForm = (u = null) => { editing.value = u; form.value = u ? { name: u.name, email: u.email, password: '', role: u.role } : { name: '', email: '', password: '', role: 'DEVELOPER' }; formError.value = ''; showForm.value = true; };

const save = async () => {
  saving.value = true;
  formError.value = '';
  try {
    if (editing.value) {
      const data = { name: form.value.name, role: form.value.role };
      if (form.value.password) data.password = form.value.password;
      await api.put(`/users/${editing.value.id}`, data);
    } else {
      await api.post('/users', form.value);
    }
    showForm.value = false;
    await fetchUsers();
  } catch (e) { formError.value = e.response?.data?.message || 'Error saving'; }
  saving.value = false;
};

const remove = async (u) => {
  if (!confirm(`Remove ${u.name}?`)) return;
  await api.delete(`/users/${u.id}`);
  users.value = users.value.filter((x) => x.id !== u.id);
};

onMounted(fetchUsers);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
