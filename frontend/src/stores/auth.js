import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const isLoggedIn = computed(() => !!user.value);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    user.value = data.user;
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    user.value = null;
  };

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/auth/me');
      user.value = data;
      localStorage.setItem('user', JSON.stringify(data));
    } catch {
      logout();
    }
  };

  return { user, isLoggedIn, login, logout, fetchMe };
});
