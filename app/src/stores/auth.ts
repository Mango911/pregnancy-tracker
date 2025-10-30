import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as authApi from '@/api/auth';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authApi.login(email, password);
      user.value = response.user;
      token.value = response.token;
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return true;
    } catch (e: any) {
      error.value = e.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string, name?: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authApi.register(email, password, name);
      user.value = response.user;
      token.value = response.token;
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return true;
    } catch (e: any) {
      error.value = e.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  function restoreSession() {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('auth_token');

    if (savedUser && savedToken) {
      try {
        user.value = JSON.parse(savedUser);
        token.value = savedToken;
      } catch {
        logout();
      }
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    restoreSession,
  };
});
