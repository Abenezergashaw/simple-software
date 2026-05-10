<template>
  <div>
    <TheNavbar />
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <PortfolioSection />
    <ContactSection />
    <TheFooter />
  </div>
</template>

<script setup>
import TheNavbar from '@/components/public/TheNavbar.vue';
import HeroSection from '@/components/public/HeroSection.vue';
import AboutSection from '@/components/public/AboutSection.vue';
import ServicesSection from '@/components/public/ServicesSection.vue';
import PortfolioSection from '@/components/public/PortfolioSection.vue';
import ContactSection from '@/components/public/ContactSection.vue';
import TheFooter from '@/components/public/TheFooter.vue';
</script>
