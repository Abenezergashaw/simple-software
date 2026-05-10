<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-display text-2xl font-semibold text-white">Contact Submissions</h1>
        <p class="text-muted text-sm mt-1">Messages from website visitors.</p>
      </div>
      <div class="flex gap-2">
        <button @click="unreadOnly = !unreadOnly; fetch()" :class="['text-sm px-4 py-2 rounded-lg border transition-all', unreadOnly ? 'border-gold text-gold bg-gold/10' : 'border-white/10 text-muted hover:text-white']">
          {{ unreadOnly ? 'Unread only' : 'All messages' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="skeleton h-20 rounded-xl"></div>
    </div>
    <div v-else-if="contacts.length === 0" class="text-center py-20 text-muted">
      <svg class="w-10 h-10 mx-auto mb-3 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      No messages.
    </div>
    <div v-else class="space-y-3">
      <div v-for="c in contacts" :key="c.id" :class="['card p-5 cursor-pointer', !c.isRead ? 'border-gold/20' : '']" @click="select(c)">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-navy-medium flex items-center justify-center text-gold font-semibold flex-shrink-0">{{ c.name.charAt(0).toUpperCase() }}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <p class="text-white font-medium">{{ c.name }}</p>
              <span v-if="!c.isRead" class="badge bg-gold/20 text-gold text-xs">New</span>
              <p class="text-muted text-xs ml-auto">{{ formatDate(c.createdAt) }}</p>
            </div>
            <p class="text-muted text-xs mb-1">{{ c.telegramUsername ? '@' + c.telegramUsername : '' }}{{ c.email ? (c.telegramUsername ? ' · ' : '') + c.email : '' }}</p>
            <p class="text-slate-400 text-sm truncate">{{ c.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selected" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="selected = null">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="relative bg-navy-light border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <div class="flex items-center justify-between mb-5">
              <h2 class="font-display text-xl font-semibold text-white">Message from {{ selected.name }}</h2>
              <button @click="selected = null" class="text-muted hover:text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div class="space-y-3 mb-5">
              <div v-if="selected.telegramUsername" class="flex gap-3 text-sm"><span class="text-muted w-20">Telegram:</span><a :href="'https://t.me/'+selected.telegramUsername" target="_blank" class="text-gold hover:underline">@{{ selected.telegramUsername }}</a></div>
              <div v-if="selected.email" class="flex gap-3 text-sm"><span class="text-muted w-20">Email:</span><a :href="'mailto:'+selected.email" class="text-gold hover:underline">{{ selected.email }}</a></div>
              <div class="flex gap-3 text-sm"><span class="text-muted w-20">Date:</span><span class="text-white">{{ formatDateFull(selected.createdAt) }}</span></div>
            </div>
            <div class="bg-navy rounded-xl p-4 mb-5">
              <p class="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{{ selected.message }}</p>
            </div>
            <div class="flex gap-3">
              <a v-if="selected.telegramUsername" :href="'https://t.me/'+selected.telegramUsername" target="_blank" class="btn-gold flex-1 justify-center text-sm py-2.5">Open on Telegram</a>
              <a v-else-if="selected.email" :href="'mailto:'+selected.email" class="btn-gold flex-1 justify-center text-sm py-2.5">Reply via Email</a>
              <button @click="remove(selected)" class="btn-outline text-red-400 border-red-400/30 hover:bg-red-400/10 flex-1 justify-center text-sm py-2.5">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const contacts = ref([]);
const loading = ref(true);
const selected = ref(null);
const unreadOnly = ref(false);

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const formatDateFull = (d) => new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const fetch = async () => { loading.value = true; const { data } = await api.get('/contacts', { params: unreadOnly.value ? { unread: 'true' } : {} }); contacts.value = data; loading.value = false; };

const select = async (c) => {
  selected.value = c;
  if (!c.isRead) { await api.put(`/contacts/${c.id}/read`); c.isRead = true; }
};

const remove = async (c) => {
  if (!confirm('Delete this message?')) return;
  await api.delete(`/contacts/${c.id}`);
  contacts.value = contacts.value.filter((x) => x.id !== c.id);
  selected.value = null;
};

onMounted(fetch);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
