<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-display text-2xl font-semibold text-white">Services</h1>
        <p class="text-muted text-sm mt-1">Manage the services shown on the public website.</p>
      </div>
      <button @click="openForm()" class="btn-gold text-sm">+ Add Service</button>
    </div>

    <div v-if="loading" class="grid md:grid-cols-3 gap-4">
      <div v-for="i in 3" :key="i" class="skeleton h-36 rounded-xl"></div>
    </div>

    <div v-else class="grid md:grid-cols-3 gap-4">
      <div v-for="s in services" :key="s.id" class="card p-6">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
            <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547"/></svg>
          </div>
          <div class="flex gap-1">
            <button @click="openForm(s)" class="p-1.5 text-muted hover:text-white transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
            <button @click="removeService(s.id)" class="p-1.5 text-muted hover:text-red-400 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
          </div>
        </div>
        <h3 class="text-white font-semibold mb-2">{{ s.title }}</h3>
        <p class="text-muted text-sm leading-relaxed line-clamp-3">{{ s.description }}</p>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showForm = false">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="relative bg-navy-light border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <h2 class="font-display text-xl font-semibold text-white mb-5">{{ editing ? 'Edit Service' : 'New Service' }}</h2>
            <form @submit.prevent="save" class="space-y-4">
              <div><label class="label">Title *</label><input v-model="form.title" class="input-field" required /></div>
              <div><label class="label">Description *</label><textarea v-model="form.description" rows="4" class="input-field resize-none" required></textarea></div>
              <div class="grid grid-cols-2 gap-4">
                <div><label class="label">Icon name</label><input v-model="form.icon" class="input-field" placeholder="Monitor" /></div>
                <div><label class="label">Order</label><input v-model="form.orderIndex" type="number" class="input-field" /></div>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="showForm = false" class="btn-outline flex-1 justify-center py-3">Cancel</button>
                <button type="submit" class="btn-gold flex-1 justify-center py-3">{{ editing ? 'Update' : 'Create' }}</button>
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
import api from '@/api';

const services = ref([]);
const loading = ref(true);
const showForm = ref(false);
const editing = ref(null);
const form = ref({ title: '', description: '', icon: 'Monitor', orderIndex: 0 });

const fetchServices = async () => { loading.value = true; const { data } = await api.get('/services'); services.value = data; loading.value = false; };
const openForm = (s = null) => { editing.value = s; form.value = s ? { title: s.title, description: s.description, icon: s.icon, orderIndex: s.orderIndex } : { title: '', description: '', icon: 'Monitor', orderIndex: 0 }; showForm.value = true; };
const save = async () => { if (editing.value) { await api.put(`/services/${editing.value.id}`, form.value); } else { await api.post('/services', form.value); } showForm.value = false; await fetchServices(); };
const removeService = async (id) => { if (!confirm('Delete this service?')) return; await api.delete(`/services/${id}`); services.value = services.value.filter((s) => s.id !== id); };

onMounted(fetchServices);
</script>
<style scoped>
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
