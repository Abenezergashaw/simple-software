<template>
  <section id="home" class="hero-bg surface-grid min-h-screen flex items-center relative overflow-hidden">
    <div class="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-gold/10"></div>
    <div class="absolute top-32 -right-12 w-52 h-52 rounded-full border border-gold/5"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
      <div class="grid lg:grid-cols-[1.1fr_.9fr] gap-12 lg:gap-16 items-center">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/25 bg-gold/5 text-gold text-xs sm:text-sm font-semibold mb-7" data-aos="fade-down">
          <span class="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
          Custom software. Measurable business impact.
        </div>

        <h1 ref="headline" class="font-display text-4xl sm:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6" data-aos="fade-up" data-aos-delay="100">
          Software engineered to <span class="gradient-text">move business forward.</span>
        </h1>

        <p class="text-muted text-base sm:text-lg max-w-2xl mb-9 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
          We design and build reliable web, mobile, and desktop products that simplify operations, unlock growth, and stay maintainable long after launch.
        </p>

        <div class="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="300">
          <a href="/#portfolio" class="btn-gold text-sm sm:text-base px-8 py-4 gold-glow">
            Explore our work
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
          <a href="/#contact" class="btn-outline text-sm sm:text-base px-8 py-4">Discuss your project</a>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3 sm:gap-8 mt-14 pt-8 border-t border-white/10 max-w-xl" data-aos="fade-up" data-aos-delay="400">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="font-display text-2xl sm:text-3xl font-bold text-white">{{ stat.value }}</div>
            <div class="text-muted text-[11px] sm:text-sm mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <div class="hidden lg:block relative" data-aos="fade-left" data-aos-delay="200">
        <div class="brand-panel relative rounded-[2rem] p-8 xl:p-10 overflow-hidden aspect-square max-w-[500px] ml-auto flex items-center justify-center">
          <div class="absolute inset-0 surface-grid opacity-60"></div>
          <div class="absolute inset-8 rounded-full border border-gold/10"></div>
          <div class="absolute inset-16 rounded-full border border-gold/10"></div>
          <div class="relative w-64 h-64 rounded-[2rem] bg-navy/80 border border-gold/20 p-5 shadow-2xl animate-glow-pulse">
            <img src="/brand-icon.png" alt="Simple Software circuit S" class="w-full h-full rounded-2xl object-cover" />
          </div>
          <div class="absolute top-8 left-8 px-3 py-2 rounded-lg bg-navy/80 border border-white/10 text-[10px] font-mono text-gold tracking-widest">BUILD / SCALE / SUPPORT</div>
          <div class="absolute bottom-8 right-8 flex items-center gap-2 text-xs text-muted"><span class="w-2 h-2 bg-emerald-400 rounded-full"></span> Systems online</div>
        </div>
      </div>
      </div>
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
