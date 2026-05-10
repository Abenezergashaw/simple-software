<template>
  <section id="services" class="py-24 bg-navy">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16" data-aos="fade-up">
        <p class="text-gold text-sm font-semibold tracking-widest uppercase mb-4">What We Do</p>
        <h2 class="section-title mb-4">Our <span class="gradient-text">Services</span></h2>
        <span class="gold-line"></span>
        <p class="section-subtitle">From idea to deployment, we handle everything — so you can focus on running your business.</p>
      </div>

      <!-- Service Cards -->
      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="(service, i) in displayServices"
          :key="service.id || i"
          class="card p-8 group cursor-default"
          :data-aos="'fade-up'"
          :data-aos-delay="i * 100"
        >
          <div class="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-gold/20 group-hover:scale-110">
            <component :is="getIcon(service.icon)" class="w-7 h-7 text-gold" />
          </div>
          <h3 class="font-display text-xl font-semibold text-white mb-3 group-hover:text-gold transition-colors">{{ service.title }}</h3>
          <p class="text-muted text-sm leading-relaxed">{{ service.description }}</p>
          <div class="mt-6 flex items-center gap-2 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Learn more</span>
            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-14" data-aos="fade-up">
        <p class="text-muted mb-4">Have a project in mind?</p>
        <a href="/#contact" class="btn-gold">Start a Conversation</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue';
import api from '@/api';

const services = ref([]);

const MonitorIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2', ry: '2', 'stroke-width': '2', 'stroke-linecap': 'round' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 21h8m-4-4v4' })]) });
const SmartphoneIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('rect', { x: '5', y: '2', width: '14', height: '20', rx: '2', ry: '2', 'stroke-width': '2' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01' })]) });
const LaptopIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 3H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-4M9 3v4m6-4v4M9 7h6' })]) });
const CodeIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' })]) });

const iconMap = { Monitor: MonitorIcon, Smartphone: SmartphoneIcon, Laptop: LaptopIcon };

const getIcon = (name) => iconMap[name] || CodeIcon;

const fallbackServices = [
  { id: 1, title: 'Web Applications', description: 'Powerful, cloud-based web systems tailored to your business — from inventory management and HR portals to e-commerce platforms and customer dashboards.', icon: 'Monitor' },
  { id: 2, title: 'Mobile Apps', description: 'Native and cross-platform mobile applications for Android and iOS. We build mobile experiences your team will love using every day.', icon: 'Smartphone' },
  { id: 3, title: 'Desktop Applications', description: 'Robust desktop software for Windows, Mac, and Linux. Perfect for high-performance tools that need to work offline.', icon: 'Laptop' },
];

const displayServices = computed(() => services.value.length ? services.value : fallbackServices);

onMounted(async () => {
  try {
    const { data } = await api.get('/services');
    services.value = data;
  } catch { /* use fallback */ }
});
</script>
