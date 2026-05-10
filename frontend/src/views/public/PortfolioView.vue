<template>
  <div>
    <TheNavbar />
    <main class="pt-24 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12" data-aos="fade-up">
          <p class="text-gold text-sm font-semibold tracking-widest uppercase mb-4">Our Portfolio</p>
          <h1 class="section-title mb-4">All <span class="gradient-text">Projects</span></h1>
          <span class="gold-line"></span>
          <p class="section-subtitle">Every project represents a real problem solved for a real business.</p>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <button v-for="tab in tabs" :key="tab.value" @click="setCategory(tab.value)"
            :class="['px-5 py-2 rounded-full text-sm font-medium transition-all', activeCategory === tab.value ? 'bg-gold text-navy' : 'border border-white/10 text-muted hover:border-gold/40 hover:text-white']"
          >{{ tab.label }}</button>
        </div>

        <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="rounded-xl"><div class="skeleton h-48 mb-3 rounded-xl"></div><div class="skeleton h-5 w-3/4 mb-2"></div><div class="skeleton h-4 w-full"></div></div>
        </div>

        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(project, i) in projects" :key="project.id" class="card overflow-hidden cursor-pointer group" @click="openModal(project)" :data-aos="'fade-up'" :data-aos-delay="i * 60">
            <div class="relative h-48 bg-navy-medium overflow-hidden">
              <img v-if="project.thumbnailUrl" :src="project.thumbnailUrl" :alt="project.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-12 h-12 text-gold/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5"/></svg>
              </div>
              <span :class="['badge absolute top-3 left-3', categoryBadge(project.category)]">{{ project.category }}</span>
            </div>
            <div class="p-5">
              <p class="text-muted text-xs mb-1">{{ project.clientName }}</p>
              <h3 class="text-white font-semibold text-lg mb-2 group-hover:text-gold transition-colors">{{ project.title }}</h3>
              <p class="text-muted text-sm line-clamp-2">{{ project.shortDesc }}</p>
            </div>
          </div>
        </div>

        <div v-if="!loading && projects.length === 0" class="text-center py-20 text-muted">No projects in this category yet.</div>
      </div>
    </main>
    <TheFooter />

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selected" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="selected = null">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="relative bg-navy-light border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="relative h-56 bg-navy-medium overflow-hidden rounded-t-2xl">
              <img v-if="selected.thumbnailUrl" :src="selected.thumbnailUrl" :alt="selected.title" class="w-full h-full object-cover"/>
              <div v-else class="w-full h-full flex items-center justify-center"><svg class="w-16 h-16 text-gold/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5"/></svg></div>
              <button @click="selected = null" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/80">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <span :class="['badge absolute bottom-4 left-4', categoryBadge(selected.category)]">{{ selected.category }}</span>
            </div>
            <div class="p-6">
              <p class="text-gold text-sm font-medium mb-1">{{ selected.clientName }}</p>
              <h2 class="font-display text-2xl font-semibold text-white mb-4">{{ selected.title }}</h2>
              <p class="text-muted leading-relaxed mb-6">{{ selected.fullDesc }}</p>
              <a v-if="selected.liveUrl" :href="selected.liveUrl" target="_blank" class="btn-gold text-sm px-5 py-2.5">View Live Project</a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TheNavbar from '@/components/public/TheNavbar.vue';
import TheFooter from '@/components/public/TheFooter.vue';
import api from '@/api';

const projects = ref([]);
const loading = ref(true);
const activeCategory = ref('ALL');
const selected = ref(null);

const tabs = [
  { label: 'All', value: 'ALL' },
  { label: 'Web Apps', value: 'WEB' },
  { label: 'Mobile', value: 'MOBILE' },
  { label: 'Desktop', value: 'DESKTOP' },
];

const categoryBadge = (cat) => ({ WEB: 'bg-blue-500/20 text-blue-300', MOBILE: 'bg-purple-500/20 text-purple-300', DESKTOP: 'bg-emerald-500/20 text-emerald-300' }[cat] || 'bg-gray-500/20 text-gray-300');

const setCategory = (cat) => { activeCategory.value = cat; fetchProjects(cat); };
const openModal = (p) => { selected.value = p; };

const fetchProjects = async (cat) => {
  loading.value = true;
  try {
    const params = cat && cat !== 'ALL' ? { category: cat } : {};
    const { data } = await api.get('/projects/public', { params });
    projects.value = data;
  } catch { projects.value = []; }
  loading.value = false;
};

onMounted(() => fetchProjects('ALL'));
</script>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
