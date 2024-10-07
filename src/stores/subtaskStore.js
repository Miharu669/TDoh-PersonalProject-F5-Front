import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from './auth';  

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT + '/subtasks';

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

export const useSubTasksStore = defineStore('subtasks', () => {
  const subtasks = ref([]);  
  const loading = ref(false);  
  const error = ref(null);  

  const fetchSubTasks = async (taskId) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();
      console.log('Authorization Headers:', headers);
      const response = await axiosInstance.get(`?taskId=${taskId}`, { headers });
      subtasks.value = response.data;
    } catch (err) {
      handleError(err, error);
    } finally {
      loading.value = false;
    }
  };
  

  const addSubTask = async (taskId, title, description) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();  
      const response = await axiosInstance.post('', { taskId, title, description, isDone: false }, { headers });  
      subtasks.value.push(response.data);  
    } catch (err) {
      handleError(err, error);  
      throw err;  
    } finally {
      loading.value = false;
    }
  };
  const updateSubTask = async (id, title, description) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();
      const response = await axiosInstance.put(`/${id}`, { title, description }, { headers });
      const index = subtasks.value.findIndex(subtask => subtask.id === id);
      if (index !== -1) {
        subtasks.value[index] = response.data; 
      }
    } catch (err) {
      handleError(err, error);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSubTaskStatus = async (id, isDone) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();  
      const response = await axiosInstance.put(`/${id}`, { isDone }, { headers });
      const index = subtasks.value.findIndex(subtask => subtask.id === id);
      if (index !== -1) {
        subtasks.value[index].isDone = response.data.isDone;  
      }
    } catch (err) {
      handleError(err, error);  
    } finally {
      loading.value = false;
    }
  };

  const deleteSubTask = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();
      await axiosInstance.delete(`/${id}`, { headers });
      subtasks.value = subtasks.value.filter(subtask => subtask.id !== id);
    } catch (err) {
      handleError(err, error);  
    } finally {
      loading.value = false;
    }
  };

  return {
    subtasks,
    loading,
    error,
    fetchSubTasks,
    addSubTask,
    updateSubTask,
    updateSubTaskStatus,
    deleteSubTask,
  };
});