<template>
  <footer class="bg-navy-light border-t border-white/5 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-10 mb-12 text-center md:text-left">
        <!-- Brand -->
        <div class="md:col-span-2 flex flex-col items-center md:items-start">
          <div class="flex items-center justify-center md:justify-start gap-3 mb-4">
            <img src="/brand-icon.png" alt="" class="w-10 h-10 rounded-xl object-cover" />
            <span class="font-display font-bold text-white text-lg tracking-tight">SIMPLE <span class="text-gold">SOFTWARE</span></span>
          </div>
          <p class="text-muted text-sm leading-relaxed max-w-xs">
            Building digital solutions that transform business operations. From web to mobile to desktop — we cover it all.
          </p>
        </div>
        <!-- Links -->
        <div>
          <h4 class="text-white font-semibold text-sm mb-4">Quick Links</h4>
          <ul class="space-y-2 flex flex-col items-center md:items-start">
            <li v-for="link in links" :key="link.href">
              <a :href="link.href" class="text-muted text-sm hover:text-gold transition-colors">{{ link.label }}</a>
            </li>
          </ul>
        </div>
        <!-- Services -->
        <div>
          <h4 class="text-white font-semibold text-sm mb-4">Services</h4>
          <ul class="space-y-2 flex flex-col items-center md:items-start">
            <li v-for="s in servicesList" :key="s">
              <span class="text-muted text-sm">{{ s }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-muted text-sm text-center sm:text-left">&copy; {{ new Date().getFullYear() }} Simple Software Development. All rights reserved.</p>
        <a href="/admin/login" class="text-muted/40 text-xs hover:text-muted transition-colors">Admin</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
const links = [
  { label: 'Home', href: '/#home' },
  { label: 'About Us', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Portfolio', href: '/#portfolio' },
  { label: 'Contact', href: '/#contact' },
];
const servicesList = ['Web Applications', 'Mobile Apps', 'Desktop Software', 'Maintenance & Support'];
</script>
