<template>
  <section id="about" class="py-24 bg-navy-light">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left: Text -->
        <div data-aos="fade-right">
          <p class="text-gold text-sm font-semibold tracking-widest uppercase mb-4">About Us</p>
          <h2 class="section-title mb-4">Your Trusted <br /><span class="gradient-text">Technology Partner</span></h2>
          <span class="block w-16 h-1 bg-gold rounded-full mb-8"></span>

          <p class="text-slate-300 text-lg leading-relaxed mb-6" v-if="about">{{ about.companyDescription }}</p>
          <p v-else class="text-slate-300 text-lg leading-relaxed mb-6">
            Simple Software Development is a passionate team of developers dedicated to building custom software solutions for businesses. We specialize in web applications, mobile apps, and desktop systems that replace slow manual workflows with fast, reliable digital tools.
          </p>

          <div class="grid grid-cols-2 gap-6 mb-8">
            <div v-for="item in highlights" :key="item.title" class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <component :is="item.icon" class="w-4 h-4 text-gold" />
              </div>
              <div>
                <p class="text-white font-medium text-sm">{{ item.title }}</p>
                <p class="text-muted text-xs mt-0.5">{{ item.desc }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-8" v-if="about">
            <div class="text-center">
              <p class="font-display text-3xl font-bold text-gold">{{ new Date().getFullYear() - about.foundedYear }}+</p>
              <p class="text-muted text-xs mt-1">Years Active</p>
            </div>
            <div class="text-center">
              <p class="font-display text-3xl font-bold text-gold">{{ about.teamSize }}</p>
              <p class="text-muted text-xs mt-1">Team Members</p>
            </div>
          </div>
        </div>

        <!-- Right: Visual -->
        <div data-aos="fade-left" class="relative">
          <div class="rounded-2xl bg-navy border border-white/5 p-8 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h3 class="font-display text-xl font-semibold text-white mb-2">Our Mission</h3>
            <p class="text-muted leading-relaxed mb-6" v-if="about">{{ about.mission }}</p>
            <p class="text-muted leading-relaxed mb-6" v-else>To empower businesses by transforming their manual processes into seamless digital systems that save time, reduce errors, and drive growth.</p>
            <div class="border-t border-white/5 pt-6">
              <h3 class="font-display text-xl font-semibold text-white mb-2">Our Vision</h3>
              <p class="text-muted leading-relaxed" v-if="about">{{ about.vision }}</p>
              <p class="text-muted leading-relaxed" v-else>To be the most trusted technology partner for businesses across all industries.</p>
            </div>
          </div>
          <!-- Floating badge -->
          <div class="absolute -bottom-4 -left-4 card px-5 py-3 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <p class="text-white text-sm font-medium">Ongoing Maintenance</p>
              <p class="text-muted text-xs">We stay with you after launch</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, defineComponent, h } from 'vue';
import api from '@/api';

const about = ref(null);

const CheckIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 13l4 4L19 7' })]) });
const ClockIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })]) });
const UsersIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' })]) });
const ShieldIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })]) });

const highlights = [
  { title: 'Custom-Built Solutions', desc: 'No templates — built for your exact needs', icon: CheckIcon },
  { title: 'Fast Delivery', desc: 'Agile development with regular updates', icon: ClockIcon },
  { title: 'Dedicated Team', desc: 'One team from start to finish', icon: UsersIcon },
  { title: 'Post-Launch Support', desc: 'Maintenance & upgrades included', icon: ShieldIcon },
];

onMounted(async () => {
  try {
    const { data } = await api.get('/about');
    about.value = data;
  } catch { /* use fallback */ }
});
</script>
