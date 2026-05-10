<template>
  <div class="min-h-screen hero-bg flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-xl bg-gold flex items-center justify-center text-navy font-display font-bold text-2xl mx-auto mb-4">S</div>
        <h1 class="font-display text-2xl font-semibold text-white">Simple Software</h1>
        <p class="text-muted text-sm mt-1">Admin Dashboard</p>
      </div>

      <div class="card p-8">
        <h2 class="font-display text-xl font-semibold text-white mb-1">Sign In</h2>
        <p class="text-muted text-sm mb-6">Enter your credentials to access the dashboard.</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="label">Email</label>
            <input v-model="form.email" type="email" placeholder="admin@simplesoftware.com" class="input-field" required autofocus />
          </div>
          <div>
            <label class="label">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPwd ? 'text' : 'password'" placeholder="••••••••" class="input-field pr-10" required />
              <button type="button" @click="showPwd = !showPwd" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="showPwd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <p v-if="error" class="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{{ error }}</p>
          <button type="submit" :disabled="loading" class="btn-gold w-full justify-center py-3.5">
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="30 10"/></svg>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>
      </div>

      <p class="text-center text-muted text-sm mt-6">
        <a href="/" class="hover:text-gold transition-colors">← Back to website</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();
const form = ref({ email: '', password: '' });
const loading = ref(false);
const error = ref('');
const showPwd = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await auth.login(form.value.email, form.value.password);
    router.push('/admin/dashboard');
  } catch (e) {
    error.value = e.response?.data?.message || 'Login failed. Please check your credentials.';
  }
  loading.value = false;
};
</script>
