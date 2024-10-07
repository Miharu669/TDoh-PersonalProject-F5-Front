import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from './auth';  

export const useCalendarStore = defineStore('calendar', () => {
  const events = ref([]);         
  const loading = ref(false);     
  const error = ref(null);        

  const authStore = useAuthStore();  

  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT + '/events';

  const axiosInstance = axios.create({
    baseURL: apiEndpoint,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = authStore.user?.access_token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.log('No authorization token found in authStore.');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleError = (err) => {
    if (err.response) {
      error.value = err.response.data.message || 'An error occurred.';
    } else if (err.request) {
      error.value = 'No response from server. Please try again later.';
    } else {
      error.value = err.message || 'An unexpected error occurred.';
    }
  };


  const getAllEvents = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.get('');  
      events.value = response.data;
    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
    }
  };

 
  const getEventsByDate = async (date) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.get(`/date/${date}`);  
      events.value = response.data;
    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
    }
  };

 
  const addEvent = async (event) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.post('', { name: event.name, date: event.date });  
      events.value.push(response.data);  
    } catch (err) {
      handleError(err);
      throw err;  
    } finally {
      loading.value = false;
    }
  };

  
  const deleteEvent = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await axiosInstance.delete(`/${id}`); 
      events.value = events.value.filter(event => event.id !== id); 
    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
    }
  };

  
  const deleteEventsByDate = async (date) => {
    loading.value = true;
    error.value = null;
    try {
      await axiosInstance.delete(`/date/${date}`);  
      await getEventsByDate(date);
    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    events,
    loading,
    error,
    getAllEvents,
    getEventsByDate,
    addEvent,
    deleteEvent,
    deleteEventsByDate,  
  };
});
