import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from './auth';  

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT + '/tasks';

const axiosInstance = axios.create({
  baseURL: apiEndpoint,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthHeader = () => {
  const authStore = useAuthStore();  
  const token = authStore.user?.access_token;  
  if (token) {
    return { 'Authorization': 'Bearer ' + token }; 
  } else {
    return {};
  }
};

const handleError = (err, errorRef) => {
  if (err.response) {
    errorRef.value = err.response.data.message || 'An error occurred.';
    console.error('Error response from server:', err.response);
  } else if (err.request) {
    errorRef.value = 'No response from server. Please try again later.';
    console.error('No response received:', err.request);
  } else {
    errorRef.value = err.message || 'An unexpected error occurred.';
    console.error('Error setting up request:', err.message);
  }
};

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([]);  
  const loading = ref(false);  
  const error = ref(null);  

  const fetchTasks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();  
      const response = await axiosInstance.get('', { headers }); 
      tasks.value = response.data;
    } catch (err) {
      handleError(err, error); 
    } finally {
      loading.value = false;
    }
  };

  const addTask = async (title, description) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();  
      const response = await axiosInstance.post('', { title, description, isDone: false }, { headers });  
      tasks.value.push(response.data);  
    } catch (err) {
      handleError(err, error);  
      throw err;  
    } finally {
      loading.value = false;
    }
  };
  
  const updateTask = async (id, title, description) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();
      const response = await axiosInstance.put(`/${id}`, { title, description }, { headers });
      const index = tasks.value.findIndex(task => task.id === id);
      if (index !== -1) {
        tasks.value[index].title = response.data.title;
        tasks.value[index].description = response.data.description;
      }
    } catch (err) {
      handleError(err, error);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateTaskStatus = async (id, isDone) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();
  
      await axiosInstance.patch(
        `/${id}/status`,
        { isDone },
        { headers }
      );
  
      const index = tasks.value.findIndex(task => task.id === id);
      if (index !== -1) {
        tasks.value[index].isDone = isDone;
      }
    } catch (err) {
      handleError(err, error);
    } finally {
      loading.value = false;
    }
  };
  
  
  
  const deleteTask = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader(); 
      await axiosInstance.delete(`/${id}`, { headers }); 
      tasks.value = tasks.value.filter(task => task.id !== id); 
    } catch (err) {
      handleError(err, error);  
    } finally {
      loading.value = false;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  };
});
