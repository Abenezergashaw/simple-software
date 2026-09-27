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
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2"><label class="label">Project Title *</label><input v-model="form.title" class="input-field" required /></div>
          <div class="sm:col-span-2"><label class="label">Platforms * <span class="text-muted font-normal">(select all that apply)</span></label><div class="grid grid-cols-3 gap-2"><label v-for="platform in platformOptions" :key="platform.value" class="flex items-center gap-2 p-3 rounded-xl border border-white/10 bg-navy/50 cursor-pointer"><input v-model="form.categories" type="checkbox" :value="platform.value" class="accent-gold" /><span class="text-sm">{{ platform.label }}</span></label></div></div>
          <div><label class="label">Client Name *</label><input v-model="form.clientName" class="input-field" required /></div>
          <div class="sm:col-span-2"><label class="label">Short Description *</label><input v-model="form.shortDesc" class="input-field" required /></div>
          <div class="sm:col-span-2"><label class="label">Full Description *</label><textarea v-model="form.fullDesc" rows="5" class="input-field resize-none" required></textarea></div>
          <div><label class="label">Status</label><select v-model="form.status" class="select-field"><option value="PLANNING">Planning</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="ON_HOLD">On Hold</option></select></div>
          <div><label class="label">Completion %</label><input v-model="form.completionPercent" type="number" min="0" max="100" class="input-field" /></div>
          <div><label class="label">Start Date</label><input v-model="form.startDate" type="date" class="input-field" /></div>
          <div><label class="label">End Date</label><input v-model="form.endDate" type="date" class="input-field" /></div>
          <div class="col-span-2"><label class="label">Live URL</label><input v-model="form.liveUrl" type="url" class="input-field" placeholder="https://..." /></div>
          <div class="col-span-2"><label class="label">Thumbnail</label><input type="file" accept="image/*" @change="onThumb" class="input-field py-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gold/10 file:text-gold file:text-sm cursor-pointer" /></div>
          <div class="col-span-2"><label class="label">Project Gallery (up to 10 images)</label><input type="file" accept="image/*" multiple @change="onGallery" class="input-field py-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gold/10 file:text-gold file:text-sm cursor-pointer" /></div>
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
const platformOptions = [{ value: 'WEB', label: 'Web' }, { value: 'MOBILE', label: 'Mobile' }, { value: 'DESKTOP', label: 'Desktop' }];
const form = ref({ title: '', shortDesc: '', fullDesc: '', categories: ['WEB'], clientName: '', liveUrl: '', status: 'PLANNING', completionPercent: 0, startDate: '', endDate: '', isPublic: false });
const thumbFile = ref(null);
const galleryFiles = ref([]);
const saving = ref(false);

const onThumb = (e) => { thumbFile.value = e.target.files[0]; };
const onGallery = (e) => { galleryFiles.value = Array.from(e.target.files).slice(0, 10); };
const save = async () => {
  saving.value = true;
  if (!form.value.categories.length) { alert('Select at least one platform'); saving.value = false; return; }
  const fd = new FormData();
  Object.entries(form.value).forEach(([k, v]) => fd.append(k, k === 'categories' ? JSON.stringify(v) : v));
  if (thumbFile.value) fd.append('thumbnail', thumbFile.value);
  galleryFiles.value.forEach((file) => fd.append('images', file));
  try {
    const { data } = await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    router.push('/admin/projects/' + data.id);
  } catch (e) { alert(e.response?.data?.message || 'Error'); }
  saving.value = false;
};
</script>
