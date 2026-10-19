<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="font-display text-2xl font-semibold text-white">Projects</h1>
        <p class="text-muted text-sm mt-1">Manage all client projects — public portfolio and internal tracking.</p>
      </div>
      <button @click="openForm()" class="btn-gold text-sm">+ New Project</button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <input v-model="search" type="text" placeholder="Search projects..." class="input-field w-full sm:max-w-xs text-sm py-2" />
      <select v-model="filterCategory" class="select-field flex-1 sm:flex-none sm:max-w-[160px] text-sm py-2">
        <option value="ALL">All Categories</option>
        <option value="WEB">Web</option>
        <option value="MOBILE">Mobile</option>
        <option value="DESKTOP">Desktop</option>
      </select>
      <select v-model="filterStatus" class="select-field flex-1 sm:flex-none sm:max-w-[160px] text-sm py-2">
        <option value="ALL">All Statuses</option>
        <option value="PLANNING">Planning</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="ON_HOLD">On Hold</option>
      </select>
    </div>

    <!-- Cards -->
    <div v-if="loading" class="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      <div v-for="i in 6" :key="i" class="card overflow-hidden"><div class="skeleton h-36"></div><div class="p-4 space-y-2"><div class="skeleton h-5 w-2/3"></div><div class="skeleton h-4 w-1/2"></div><div class="skeleton h-2 w-full"></div></div></div>
    </div>
    <div v-else-if="projects.length === 0" class="card text-center py-16 text-muted">
      <svg class="w-10 h-10 mx-auto mb-3 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
      No projects found.
    </div>
    <div v-else class="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      <div v-for="p in projects" :key="p.id" @click="$router.push('/admin/projects/' + p.id)" class="card overflow-hidden flex flex-col cursor-pointer group hover:border-gold/30 transition-colors">
        <!-- Image -->
        <div class="relative h-36 bg-navy-medium">
          <img v-if="p.thumbnailUrl" :src="p.thumbnailUrl" :alt="p.title" class="w-full h-full object-contain p-2" />
          <div v-else class="w-full h-full flex items-center justify-center text-gold/30 text-3xl font-bold">{{ p.title[0] }}</div>
          <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1"><span v-for="platform in projectCategories(p)" :key="platform" :class="['badge', categoryBadge(platform)]">{{ formatPlatform(platform) }}</span></div>
          <span :class="['badge absolute top-2.5 right-2.5', statusBadge(p.status)]">{{ formatStatus(p.status) }}</span>
        </div>
        <!-- Body -->
        <div class="p-4 flex-1 flex flex-col gap-3">
          <div class="min-w-0">
            <h3 class="text-white font-semibold truncate group-hover:text-gold transition-colors">{{ p.title }}</h3>
            <p class="text-muted text-sm truncate">{{ p.clientName }}</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-1.5 bg-navy-medium rounded-full overflow-hidden">
              <div class="h-full bg-gold rounded-full" :style="{ width: p.completionPercent + '%' }"></div>
            </div>
            <span class="text-muted text-xs w-9 text-right">{{ p.completionPercent }}%</span>
          </div>
        </div>
        <!-- Footer -->
        <div class="px-4 py-3 border-t border-white/5 flex items-center justify-between gap-2" @click.stop>
          <button @click="togglePublic(p)" class="flex items-center gap-2 text-xs text-muted hover:text-white" :title="p.isPublic ? 'Hide from public portfolio' : 'Show on public portfolio'">
            <span :class="['w-10 h-5 rounded-full transition-all duration-300 relative', p.isPublic ? 'bg-gold' : 'bg-navy-medium']">
              <span :class="['absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300', p.isPublic ? 'right-0.5' : 'left-0.5']"></span>
            </span>
            {{ p.isPublic ? 'Public' : 'Hidden' }}
          </button>
          <div class="flex items-center gap-1">
            <button @click="openForm(p)" class="p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-navy-medium" title="Edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button @click="confirmDelete(p)" class="p-2 text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-navy-medium" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Form Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showForm = false">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="relative bg-navy-light border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-6 border-b border-white/5">
              <h2 class="font-display text-xl font-semibold text-white">{{ editProject ? 'Edit Project' : 'New Project' }}</h2>
              <button @click="showForm = false" class="text-muted hover:text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <form @submit.prevent="saveProject" class="p-6 space-y-5">
              <div class="grid sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="label">Project Title *</label>
                  <input v-model="form.title" class="input-field" required placeholder="SmartInventory Pro" />
                </div>
                <div class="sm:col-span-2">
                  <label class="label">Platforms * <span class="text-muted font-normal">(select all that apply)</span></label>
                  <div class="grid grid-cols-3 gap-2">
                    <label v-for="platform in platformOptions" :key="platform.value" class="flex items-center gap-2 p-3 rounded-xl border border-white/10 bg-navy/50 cursor-pointer hover:border-gold/40 transition-colors">
                      <input v-model="form.categories" type="checkbox" :value="platform.value" class="accent-gold w-4 h-4" />
                      <span class="text-sm text-slate-200">{{ platform.label }}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="label">Client Name *</label>
                  <input v-model="form.clientName" class="input-field" required placeholder="Acme Ltd" />
                </div>
                <div class="sm:col-span-2">
                  <label class="label">Short Description * (shown on portfolio card)</label>
                  <input v-model="form.shortDesc" class="input-field" required placeholder="Brief one-line description..." />
                </div>
                <div class="sm:col-span-2">
                  <label class="label">Full Description * (shown in project modal)</label>
                  <textarea v-model="form.fullDesc" rows="4" class="input-field resize-none" required placeholder="Detailed description of the project, the problem it solved, and the impact..."></textarea>
                </div>
                <div>
                  <label class="label">Status</label>
                  <select v-model="form.status" class="select-field">
                    <option value="PLANNING">Planning</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>
                <div>
                  <label class="label">Completion %</label>
                  <input v-model="form.completionPercent" type="number" min="0" max="100" class="input-field" placeholder="0" />
                </div>
                <div>
                  <label class="label">Start Date</label>
                  <input v-model="form.startDate" type="date" class="input-field" />
                </div>
                <div>
                  <label class="label">End Date</label>
                  <input v-model="form.endDate" type="date" class="input-field" />
                </div>
                <div class="sm:col-span-2 space-y-3">
                  <p class="label mb-0">Project Links <span class="text-muted font-normal">(optional — customers see a button for each one you fill in)</span></p>
                  <div v-for="link in linkOptions" :key="link.url" class="grid sm:grid-cols-[1fr_200px] gap-2">
                    <div>
                      <label class="label">{{ link.label }}</label>
                      <input v-model="form[link.url]" type="url" class="input-field" :placeholder="link.placeholder" />
                    </div>
                    <div>
                      <label class="label">Button text</label>
                      <input v-model="form[link.text]" maxlength="40" class="input-field" :placeholder="link.defaultText" />
                    </div>
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label class="label">Thumbnail Image</label>
                  <input type="file" accept="image/*" @change="onThumb" class="input-field py-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gold/10 file:text-gold file:text-sm" />
                </div>
                <div class="sm:col-span-2">
                  <label class="label">Project Gallery <span class="text-muted font-normal">(up to 10 images)</span></label>
                  <input type="file" accept="image/*" multiple @change="onGallery" class="input-field py-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gold/10 file:text-gold file:text-sm" />
                  <p v-if="galleryFiles.length" class="text-xs text-gold mt-2">{{ galleryFiles.length }} image{{ galleryFiles.length === 1 ? '' : 's' }} selected</p>
                </div>
                <div class="sm:col-span-2 flex items-center gap-3">
                  <button type="button" @click="form.isPublic = !form.isPublic" :class="['w-10 h-5 rounded-full transition-all relative', form.isPublic ? 'bg-gold' : 'bg-navy-medium']">
                    <span :class="['absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all', form.isPublic ? 'right-0.5' : 'left-0.5']"></span>
                  </button>
                  <span class="text-sm text-slate-300">Show on public portfolio</span>
                </div>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="showForm = false" class="btn-outline flex-1 justify-center py-3">Cancel</button>
                <button type="submit" :disabled="saving" class="btn-gold flex-1 justify-center py-3">{{ saving ? 'Saving...' : (editProject ? 'Update Project' : 'Create Project') }}</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import api from '@/api';

const projects = ref([]);
const loading = ref(true);
const showForm = ref(false);
const editProject = ref(null);
const saving = ref(false);
const search = ref('');
const filterCategory = ref('ALL');
const filterStatus = ref('ALL');
const thumbFile = ref(null);
const galleryFiles = ref([]);

const platformOptions = [{ value: 'WEB', label: 'Web' }, { value: 'MOBILE', label: 'Mobile' }, { value: 'DESKTOP', label: 'Desktop' }];
const linkOptions = [
  { url: 'liveUrl', text: 'liveLabel', label: 'Website', placeholder: 'https://...', defaultText: 'Visit Website' },
  { url: 'androidUrl', text: 'androidLabel', label: 'Android (Google Play)', placeholder: 'https://play.google.com/store/apps/details?id=...', defaultText: 'Get it on Google Play' },
  { url: 'iosUrl', text: 'iosLabel', label: 'iOS (App Store)', placeholder: 'https://apps.apple.com/app/...', defaultText: 'Download on the App Store' },
];
const emptyForm = () => ({ title: '', shortDesc: '', fullDesc: '', categories: ['WEB'], clientName: '', liveUrl: '', androidUrl: '', iosUrl: '', liveLabel: '', androidLabel: '', iosLabel: '', status: 'PLANNING', completionPercent: 0, startDate: '', endDate: '', isPublic: false });
const form = ref(emptyForm());

const categoryBadge = (c) => ({ WEB: 'bg-blue-500/20 text-blue-300', MOBILE: 'bg-purple-500/20 text-purple-300', DESKTOP: 'bg-emerald-500/20 text-emerald-300' }[c] || 'bg-gray-500/20 text-gray-300');
const projectCategories = (p) => p.categories?.length ? p.categories : [p.category];
const formatPlatform = (p) => ({ WEB: 'Web', MOBILE: 'Mobile', DESKTOP: 'Desktop' }[p] || p);
const statusBadge = (s) => ({ PLANNING: 'bg-yellow-500/20 text-yellow-300', IN_PROGRESS: 'bg-blue-500/20 text-blue-300', COMPLETED: 'bg-emerald-500/20 text-emerald-300', ON_HOLD: 'bg-red-500/20 text-red-300' }[s]);
const formatStatus = (s) => ({ PLANNING: 'Planning', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed', ON_HOLD: 'On Hold' }[s] || s);

const fetchProjects = async () => {
  loading.value = true;
  const params = {};
  if (filterCategory.value !== 'ALL') params.category = filterCategory.value;
  if (filterStatus.value !== 'ALL') params.status = filterStatus.value;
  if (search.value) params.search = search.value;
  const { data } = await api.get('/projects', { params });
  projects.value = data;
  loading.value = false;
};

const openForm = (project = null) => {
  editProject.value = project;
  if (project) {
    form.value = { title: project.title, shortDesc: project.shortDesc, fullDesc: project.fullDesc, categories: projectCategories(project), clientName: project.clientName, liveUrl: project.liveUrl || '', androidUrl: project.androidUrl || '', iosUrl: project.iosUrl || '', liveLabel: project.liveLabel || '', androidLabel: project.androidLabel || '', iosLabel: project.iosLabel || '', status: project.status, completionPercent: project.completionPercent, startDate: project.startDate ? project.startDate.split('T')[0] : '', endDate: project.endDate ? project.endDate.split('T')[0] : '', isPublic: project.isPublic };
  } else {
    form.value = emptyForm();
  }
  thumbFile.value = null;
  galleryFiles.value = [];
  showForm.value = true;
};

const onThumb = (e) => { thumbFile.value = e.target.files[0]; };
const onGallery = (e) => { galleryFiles.value = Array.from(e.target.files).slice(0, 10); };

const saveProject = async () => {
  saving.value = true;
  if (!form.value.categories.length) { alert('Select at least one platform'); saving.value = false; return; }
  const fd = new FormData();
  Object.entries(form.value).forEach(([k, v]) => fd.append(k, k === 'categories' ? JSON.stringify(v) : v));
  if (thumbFile.value) fd.append('thumbnail', thumbFile.value);
  galleryFiles.value.forEach((file) => fd.append('images', file));
  try {
    if (editProject.value) {
      await api.put(`/projects/${editProject.value.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
      await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    showForm.value = false;
    await fetchProjects();
  } catch (e) { alert(e.response?.data?.message || 'Error saving project'); }
  saving.value = false;
};

const togglePublic = async (p) => {
  p.isPublic = !p.isPublic;
  const fd = new FormData();
  Object.entries(p).forEach(([k, v]) => { if (typeof v !== 'object') fd.append(k, v); });
  fd.append('categories', JSON.stringify(projectCategories(p)));
  await api.put(`/projects/${p.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};

const confirmDelete = async (p) => {
  if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
  await api.delete(`/projects/${p.id}`);
  projects.value = projects.value.filter((x) => x.id !== p.id);
};

let searchTimer;
watch([search, filterCategory, filterStatus], () => { clearTimeout(searchTimer); searchTimer = setTimeout(fetchProjects, 400); });
onMounted(fetchProjects);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
