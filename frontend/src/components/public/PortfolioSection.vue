<template>
  <section id="portfolio" class="py-24 bg-navy-light">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12" data-aos="fade-up">
        <p class="text-gold text-sm font-semibold tracking-widest uppercase mb-4">Our Work</p>
        <h2 class="section-title mb-4">Featured <span class="gradient-text">Projects</span></h2>
        <span class="gold-line"></span>
        <p class="section-subtitle">Real systems built for real businesses. Each project replaced a manual process with something faster, smarter, and more reliable.</p>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap justify-center gap-3 mb-12" data-aos="fade-up" data-aos-delay="100">
        <button
          v-for="tab in tabs" :key="tab.value"
          @click="setCategory(tab.value)"
          :class="['px-5 py-2 rounded-full text-sm font-medium transition-all duration-300',
            activeCategory === tab.value
              ? 'bg-gold text-navy shadow-lg shadow-gold/20'
              : 'border border-white/10 text-muted hover:border-gold/40 hover:text-white']"
        >{{ tab.label }}</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="rounded-xl overflow-hidden">
          <div class="skeleton h-48 mb-4"></div>
          <div class="skeleton h-5 w-3/4 mb-2"></div>
          <div class="skeleton h-4 w-full mb-1"></div>
          <div class="skeleton h-4 w-2/3"></div>
        </div>
      </div>

      <!-- Projects Grid -->
      <TransitionGroup v-else name="project-grid" tag="div" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(project, i) in projects"
          :key="project.id"
          class="card overflow-hidden cursor-pointer group"
          @click="openModal(project)"
          :data-aos="'fade-up'"
          :data-aos-delay="i * 80"
        >
          <!-- Thumbnail -->
          <div class="relative overflow-hidden h-48 bg-navy-medium">
            <img v-if="project.thumbnailUrl" :src="project.thumbnailUrl" :alt="project.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-medium to-navy">
              <svg class="w-12 h-12 text-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9h18M9 21V9"/></svg>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-navy-light/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <span class="text-white text-sm font-medium flex items-center gap-2">View Details <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></span>
            </div>
            <span :class="['badge absolute top-3 left-3', categoryBadge(project.category)]">{{ project.category }}</span>
          </div>
          <!-- Content -->
          <div class="p-5">
            <p class="text-muted text-xs mb-1">{{ project.clientName }}</p>
            <h3 class="text-white font-semibold text-lg mb-2 group-hover:text-gold transition-colors">{{ project.title }}</h3>
            <p class="text-muted text-sm leading-relaxed line-clamp-2">{{ project.shortDesc }}</p>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="!loading && projects.length === 0" class="text-center py-20 text-muted">
        No projects in this category yet. Check back soon!
      </div>

      <div class="text-center mt-12" data-aos="fade-up">
        <router-link to="/portfolio" class="btn-outline">View All Projects</router-link>
      </div>
    </div>

    <!-- Project Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedProject" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="selectedProject = null">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="relative bg-navy-light border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <!-- Modal Header Image -->
            <div class="relative h-56 bg-navy-medium overflow-hidden rounded-t-2xl">
              <img v-if="selectedProject.thumbnailUrl" :src="selectedProject.thumbnailUrl" :alt="selectedProject.title" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-medium to-navy">
                <svg class="w-16 h-16 text-gold/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5"/></svg>
              </div>
              <button @click="selectedProject = null" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <span :class="['badge absolute bottom-4 left-4', categoryBadge(selectedProject.category)]">{{ selectedProject.category }}</span>
            </div>
            <!-- Modal Body -->
            <div class="p-6">
              <p class="text-gold text-sm font-medium mb-1">{{ selectedProject.clientName }}</p>
              <h2 class="font-display text-2xl font-semibold text-white mb-4">{{ selectedProject.title }}</h2>
              <p class="text-muted leading-relaxed mb-6">{{ selectedProject.fullDesc }}</p>
              <div v-if="selectedProject.liveUrl" class="flex gap-3">
                <a :href="selectedProject.liveUrl" target="_blank" rel="noopener" class="btn-gold text-sm px-5 py-2.5">
                  View Live Project
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const projects = ref([]);
const loading = ref(true);
const activeCategory = ref('ALL');
const selectedProject = ref(null);

const tabs = [
  { label: 'All Projects', value: 'ALL' },
  { label: 'Web Apps', value: 'WEB' },
  { label: 'Mobile Apps', value: 'MOBILE' },
  { label: 'Desktop', value: 'DESKTOP' },
];

const categoryBadge = (cat) => ({
  WEB: 'bg-blue-500/20 text-blue-300',
  MOBILE: 'bg-purple-500/20 text-purple-300',
  DESKTOP: 'bg-emerald-500/20 text-emerald-300',
}[cat] || 'bg-gray-500/20 text-gray-300');

const setCategory = async (cat) => {
  activeCategory.value = cat;
  await fetchProjects(cat);
};

const fetchProjects = async (cat) => {
  loading.value = true;
  try {
    const params = cat && cat !== 'ALL' ? { category: cat } : {};
    const { data } = await api.get('/projects/public', { params });
    projects.value = data;
  } catch { projects.value = []; }
  loading.value = false;
};

const openModal = (project) => { selectedProject.value = project; };

onMounted(() => fetchProjects('ALL'));
</script>

<style scoped>
.project-grid-enter-active, .project-grid-leave-active { transition: all 0.4s ease; }
.project-grid-enter-from, .project-grid-leave-to { opacity: 0; transform: scale(0.9); }
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
