<template>
  <section id="contact" class="py-24 bg-navy">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 items-start">
        <!-- Left -->
        <div data-aos="fade-right">
          <p class="text-gold text-sm font-semibold tracking-widest uppercase mb-4">Get In Touch</p>
          <h2 class="section-title mb-4">Ready to <span class="gradient-text">Get Started?</span></h2>
          <span class="block w-16 h-1 bg-gold rounded-full mb-8"></span>
          <p class="text-muted text-lg leading-relaxed mb-10">
            Tell us about your business challenge and we'll show you how we can solve it with technology. No jargon, no pressure — just a friendly conversation.
          </p>
          <div class="space-y-5">
            <div v-for="item in contactItems" :key="item.label" class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                <component :is="item.icon" class="w-5 h-5 text-gold" />
              </div>
              <div>
                <p class="text-muted text-xs">{{ item.label }}</p>
                <p class="text-white text-sm font-medium">{{ item.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div data-aos="fade-left">
          <div class="card p-8">
            <Transition name="form-success" mode="out-in">
              <div v-if="submitted" class="text-center py-12">
                <div class="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 class="font-display text-2xl font-semibold text-white mb-2">Message Received!</h3>
                <p class="text-muted">Thank you, {{ sentName }}. We'll reach out to you shortly.</p>
                <button @click="submitted = false" class="btn-outline text-sm px-5 py-2.5 mt-6">Send Another Message</button>
              </div>

              <form v-else @submit.prevent="sendMessage" class="space-y-5">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="label">Full Name *</label>
                    <input v-model="form.name" type="text" placeholder="Abebe Girma" class="input-field" required />
                  </div>
                  <div>
                    <label class="label">
                      Telegram Username *
                      <span class="text-muted font-normal normal-case text-xs ml-1">so we can reach you</span>
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm select-none">@</span>
                      <input v-model="form.telegramUsername" type="text" placeholder="yourusername" class="input-field pl-7" required />
                    </div>
                  </div>
                </div>
                <div>
                  <label class="label">Email Address <span class="text-muted font-normal normal-case text-xs">(optional)</span></label>
                  <input v-model="form.email" type="email" placeholder="abebe@company.com" class="input-field" />
                </div>
                <div>
                  <label class="label">Tell Us About Your Project *</label>
                  <textarea v-model="form.message" rows="5" placeholder="We are a retail company with 5 branches and we need a system to manage our inventory..." class="input-field resize-none" required></textarea>
                </div>
                <button type="submit" :disabled="sending" class="btn-gold w-full justify-center py-4 text-base">
                  <span v-if="sending" class="flex items-center gap-2">
                    <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="30 10"/></svg>
                    Sending...
                  </span>
                  <span v-else>Send Message</span>
                </button>
                <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>
              </form>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, defineComponent, h, onMounted, computed } from 'vue';
import api from '@/api';

const form = ref({ name: '', telegramUsername: '', email: '', message: '' });
const sending = ref(false);
const submitted = ref(false);
const sentName = ref('');
const error = ref('');
const aboutData = ref(null);

const EmailIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })]) });
const PhoneIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' })]) });
const MapIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z' })]) });

const contactItems = computed(() => [
  { label: 'Email', value: aboutData.value?.contactEmail || 'hello@simplesoftware.com', icon: EmailIcon },
  { label: 'Phone', value: aboutData.value?.contactPhone || '+251 91 000 0000', icon: PhoneIcon },
  { label: 'Location', value: aboutData.value?.location || 'Gondar, Ethiopia', icon: MapIcon },
]);

onMounted(async () => {
  try { const { data } = await api.get('/about'); aboutData.value = data; } catch {}
});

const sendMessage = async () => {
  sending.value = true;
  error.value = '';
  try {
    await api.post('/contacts', form.value);
    sentName.value = form.value.name;
    submitted.value = true;
    form.value = { name: '', telegramUsername: '', email: '', message: '' };
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to send. Please try again.';
  }
  sending.value = false;
};
</script>

<style scoped>
.form-success-enter-active, .form-success-leave-active { transition: all 0.4s ease; }
.form-success-enter-from, .form-success-leave-to { opacity: 0; transform: translateY(20px); }
</style>
