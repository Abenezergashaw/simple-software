import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api';

export const useProjectsStore = defineStore('projects', () => {
  const publicProjects = ref([]);
  const adminProjects = ref([]);
  const loading = ref(false);

  const fetchPublic = async (category = null) => {
    loading.value = true;
    const params = category && category !== 'ALL' ? { category } : {};
    const { data } = await api.get('/projects/public', { params });
    publicProjects.value = data;
    loading.value = false;
  };

  const fetchAdmin = async (filters = {}) => {
    loading.value = true;
    const { data } = await api.get('/projects', { params: filters });
    adminProjects.value = data;
    loading.value = false;
  };

  const createProject = async (formData) => {
    const { data } = await api.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data;
  };

  const updateProject = async (id, formData) => {
    const { data } = await api.put(`/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data;
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    adminProjects.value = adminProjects.value.filter((p) => p.id !== id);
  };

  return { publicProjects, adminProjects, loading, fetchPublic, fetchAdmin, createProject, updateProject, deleteProject };
});
