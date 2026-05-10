<template>
  <div class="scroll-progress" :style="{ width: scrollProgress + '%' }"></div>
  <RouterView />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AOS from 'aos';

const scrollProgress = ref(0);

const updateScroll = () => {
  const el = document.documentElement;
  scrollProgress.value = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
};

onMounted(() => {
  AOS.init({ duration: 700, once: true, offset: 80, easing: 'ease-out-cubic' });
  window.addEventListener('scroll', updateScroll);
});
onUnmounted(() => window.removeEventListener('scroll', updateScroll));
</script>
