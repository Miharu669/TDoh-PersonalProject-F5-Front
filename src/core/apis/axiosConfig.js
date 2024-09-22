import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// Log the base URL to check the environment variable
console.log('API Base URL:', import.meta.env.VITE_API_ENDPOINT);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT, // This should log correctly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log each request to verify if it's correct
apiClient.interceptors.request.use((config) => {
  console.log('Making request to:', config.url, 'with config:', config); // Log request URL and config
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
