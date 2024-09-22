import { ref } from 'vue';
import { defineStore } from 'pinia';
import AuthService from '@/core/apis/spring/auth/AuthService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    id: '',
    username: '',
    email: '',
    isAuthenticated: false,
  });

  function login(username, password) {
    const credentials = { username, password };
    const service = new AuthService();
    return service.login(credentials).then((response) => {
      user.value = response.data;
      user.value.isAuthenticated = true;
    });
  }

  function googleLogin(googleIdToken) {
    const service = new AuthService();
    return service.googleLogin(googleIdToken).then((response) => {
      user.value = response.data;
      user.value.isAuthenticated = true;
    });
  }

  function checkAuth() {
    const token = localStorage.getItem('auth_token');
    user.value.isAuthenticated = !!token;
    return user.value.isAuthenticated;
  }

  return {
    user,
    login,
    googleLogin,
    checkAuth, 
  };
});
