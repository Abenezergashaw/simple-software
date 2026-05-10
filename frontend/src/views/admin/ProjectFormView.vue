<template>
  <!-- Standalone project creation page (router redirects here for /admin/projects/new) -->
  <div class="max-w-2xl">
    <button @click="$router.back()" class="flex items-center gap-2 text-muted hover:text-white text-sm mb-6 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Back to Projects
    </button>
    <h1 class="font-display text-2xl font-semibold text-white mb-6">New Project</h1>
    <div class="card p-6">
      <form @submit.prevent="save" class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2"><label class="label">Project Title *</label><input v-model="form.title" class="input-field" required /></div>
          <div><label class="label">Category *</label><select v-model="form.category" class="select-field" required><option value="WEB">Web App</option><option value="MOBILE">Mobile App</option><option value="DESKTOP">Desktop</option></select></div>
          <div><label class="label">Client Name *</label><input v-model="form.clientName" class="input-field" required /></div>
          <div class="col-span-2"><label class="label">Short Description *</label><input v-model="form.shortDesc" class="input-field" required /></div>
          <div class="col-span-2"><label class="label">Full Description *</label><textarea v-model="form.fullDesc" rows="5" class="input-field resize-none" required></textarea></div>
          <div><label class="label">Status</label><select v-model="form.status" class="select-field"><option value="PLANNING">Planning</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="ON_HOLD">On Hold</option></select></div>
          <div><label class="label">Completion %</label><input v-model="form.completionPercent" type="number" min="0" max="100" class="input-field" /></div>
          <div><label class="label">Start Date</label><input v-model="form.startDate" type="date" class="input-field" /></div>
          <div><label class="label">End Date</label><input v-model="form.endDate" type="date" class="input-field" /></div>
          <div class="col-span-2"><label class="label">Live URL</label><input v-model="form.liveUrl" type="url" class="input-field" placeholder="https://..." /></div>
          <div class="col-span-2"><label class="label">Thumbnail</label><input type="file" accept="image/*" @change="onThumb" class="input-field py-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gold/10 file:text-gold file:text-sm cursor-pointer" /></div>
          <div class="col-span-2 flex items-center gap-3">
            <button type="button" @click="form.isPublic = !form.isPublic" :class="['w-10 h-5 rounded-full transition-all relative', form.isPublic ? 'bg-gold' : 'bg-navy-medium']"><span :class="['absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all', form.isPublic ? 'right-0.5' : 'left-0.5']"></span></button>
            <span class="text-sm text-slate-300">Show on public portfolio</span>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="$router.back()" class="btn-outline flex-1 justify-center py-3">Cancel</button>
          <button type="submit" :disabled="saving" class="btn-gold flex-1 justify-center py-3">{{ saving ? 'Creating...' : 'Create Project' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';

const router = useRouter();
const form = ref({ title: '', shortDesc: '', fullDesc: '', category: 'WEB', clientName: '', liveUrl: '', status: 'PLANNING', completionPercent: 0, startDate: '', endDate: '', isPublic: false });
const thumbFile = ref(null);
const saving = ref(false);

const onThumb = (e) => { thumbFile.value = e.target.files[0]; };
const save = async () => {
  saving.value = true;
  const fd = new FormData();
  Object.entries(form.value).forEach(([k, v]) => fd.append(k, v));
  if (thumbFile.value) fd.append('thumbnail', thumbFile.value);
  try {
    const { data } = await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    router.push('/admin/projects/' + data.id);
  } catch (e) { alert(e.response?.data?.message || 'Error'); }
  saving.value = false;
};
</script>
