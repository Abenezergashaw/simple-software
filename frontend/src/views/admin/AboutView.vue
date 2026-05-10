<template>
  <div class="max-w-2xl">
    <div class="mb-8">
      <h1 class="font-display text-2xl font-semibold text-white">About Us Content</h1>
      <p class="text-muted text-sm mt-1">Edit the content displayed on the public About section.</p>
    </div>
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="skeleton h-20 rounded-xl"></div>
    </div>
    <div v-else class="card p-6">
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="label">Company Description *</label>
          <textarea v-model="form.companyDescription" rows="4" class="input-field resize-none" required></textarea>
        </div>
        <div>
          <label class="label">Mission Statement *</label>
          <textarea v-model="form.mission" rows="3" class="input-field resize-none" required></textarea>
        </div>
        <div>
          <label class="label">Vision Statement *</label>
          <textarea v-model="form.vision" rows="3" class="input-field resize-none" required></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Founded Year</label>
            <input v-model="form.foundedYear" type="number" class="input-field" min="2000" :max="new Date().getFullYear()" />
          </div>
          <div>
            <label class="label">Team Size</label>
            <input v-model="form.teamSize" type="number" class="input-field" min="1" />
          </div>
        </div>
        <hr class="border-white/5" />
        <p class="text-muted text-xs uppercase tracking-widest font-semibold">Contact Info (shown on public site)</p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Email</label>
            <input v-model="form.contactEmail" type="email" class="input-field" placeholder="hello@simplesoftware.com" />
          </div>
          <div>
            <label class="label">Phone</label>
            <input v-model="form.contactPhone" type="tel" class="input-field" placeholder="+251 91 000 0000" />
          </div>
          <div class="col-span-2">
            <label class="label">Location</label>
            <input v-model="form.location" type="text" class="input-field" placeholder="Gondar, Ethiopia" />
          </div>
        </div>
        <p v-if="saved" class="text-emerald-400 text-sm flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Saved successfully!</p>
        <button type="submit" :disabled="saving" class="btn-gold px-8 py-3">{{ saving ? 'Saving...' : 'Save Changes' }}</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const form = ref({ companyDescription: '', mission: '', vision: '', foundedYear: 2020, teamSize: 5, contactEmail: '', contactPhone: '', location: '' });
const loading = ref(true);
const saving = ref(false);
const saved = ref(false);

const fetch = async () => { const { data } = await api.get('/about'); if (data) form.value = { ...data }; loading.value = false; };
const save = async () => { saving.value = true; await api.put('/about', form.value); saving.value = false; saved.value = true; setTimeout(() => { saved.value = false; }, 3000); };

onMounted(fetch);
</script>
