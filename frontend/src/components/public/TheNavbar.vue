<template>
  <nav
    :class="['fixed top-0 left-0 right-0 z-40 transition-all duration-500', scrolled ? 'bg-navy/90 backdrop-blur-xl border-b border-gold/10 shadow-2xl' : 'bg-transparent']"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-20 gap-4">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-3 group flex-shrink-0" aria-label="Simple Software home">
          <img src="/brand-icon.png" alt="" class="w-10 h-10 rounded-xl object-cover transition-transform group-hover:scale-105" />
          <span class="hidden sm:block font-display font-bold text-white text-base leading-tight tracking-tight">
            SIMPLE <span class="text-gold">SOFTWARE</span>
            <small class="block text-[9px] tracking-[.22em] font-sans font-semibold text-muted mt-0.5">DEVELOPMENT</small>
          </span>
        </a>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center gap-1">
          <a v-for="link in navLinks" :key="link.href" :href="link.href"
            class="px-4 py-2 text-sm font-medium text-muted hover:text-white transition-colors relative group"
          >
            {{ link.label }}
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full rounded-full"></span>
          </a>
        </div>

        <div class="hidden lg:flex items-center gap-3">
          <a href="/#contact" class="btn-gold text-sm px-5 py-2.5">Get in Touch</a>
        </div>

        <!-- Mobile menu button -->
        <button @click="menuOpen = !menuOpen" class="lg:hidden p-2 text-muted hover:text-white transition-colors" aria-label="Toggle navigation">
          <span class="block w-6 h-0.5 bg-current mb-1.5 transition-all" :class="menuOpen ? 'rotate-45 translate-y-2' : ''"></span>
          <span class="block w-6 h-0.5 bg-current mb-1.5 transition-all" :class="menuOpen ? 'opacity-0' : ''"></span>
          <span class="block w-6 h-0.5 bg-current transition-all" :class="menuOpen ? '-rotate-45 -translate-y-2' : ''"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div v-if="menuOpen" class="lg:hidden bg-navy-light/98 backdrop-blur-xl border-t border-white/5 px-4 py-4 flex flex-col gap-2 shadow-2xl">
        <a v-for="link in navLinks" :key="link.href" :href="link.href" @click="menuOpen = false"
          class="px-4 py-3 text-muted hover:text-white hover:bg-navy-medium rounded-lg transition-all text-sm font-medium"
        >{{ link.label }}</a>
        <a href="/#contact" @click="menuOpen = false" class="btn-gold text-center text-sm mt-2">Get in Touch</a>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const scrolled = ref(false);
const menuOpen = ref(false);

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Portfolio', href: '/#portfolio' },
  { label: 'Contact', href: '/#contact' },
];

const onScroll = () => { scrolled.value = window.scrollY > 50; };
onMounted(() => window.addEventListener('scroll', onScroll));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped>
.mobile-menu-enter-active, .mobile-menu-leave-active { transition: all 0.3s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
