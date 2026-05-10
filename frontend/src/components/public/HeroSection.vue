<template>
  <section id="home" class="hero-bg min-h-screen flex items-center relative overflow-hidden">
    <!-- Decorative circles -->
    <div class="absolute top-20 right-10 w-64 h-64 rounded-full border border-gold/10 animate-pulse"></div>
    <div class="absolute bottom-20 left-5 w-40 h-40 rounded-full border border-gold/5"></div>
    <div class="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-gold/40"></div>
    <div class="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-gold/30"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
      <div class="max-w-4xl">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 text-gold text-sm font-medium mb-8" data-aos="fade-down">
          <span class="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
          Transforming Businesses Through Technology
        </div>

        <h1 ref="headline" class="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6" data-aos="fade-up" data-aos-delay="100">
          We Build Systems <br />
          <span class="gradient-text">That Work For You</span>
        </h1>

        <p class="text-muted text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
          Custom web applications, mobile apps, and desktop software designed to eliminate manual work and help your business grow faster, smarter, and more reliably.
        </p>

        <div class="flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="300">
          <a href="/#portfolio" class="btn-gold text-base px-8 py-4 gold-glow">
            See Our Work
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
          <a href="/#contact" class="btn-outline text-base px-8 py-4">Get a Free Consultation</a>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/5 max-w-lg" data-aos="fade-up" data-aos-delay="400">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="font-display text-3xl font-bold text-gold">{{ stat.value }}</div>
            <div class="text-muted text-sm mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted text-xs animate-bounce">
      <span>Scroll</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
    </div>
  </section>
</template>

<script setup>
const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '30+', label: 'Happy Clients' },
  { value: '5yrs', label: 'Experience' },
];
</script>
