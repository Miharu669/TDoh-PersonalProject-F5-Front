import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth'; 

export const useSubtaskStore = defineStore('subtaskStore', () => {
  const subtasks = ref([]);
  const subtask = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const taskId = ref(null); 

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    }
  });

  const setAuthHeader = () => {
    const authStore = useAuthStore(); 
    const accessToken = authStore.user.access_token; 
    return  { 'Authorization': 'Bearer ' + accessToken };
  };
  
  const handleError = (err, defaultMsg) => {
    error.value = err?.response?.data?.message || defaultMsg;
    console.error(error.value); 
  };
  
  const fetchData = async (url) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();
      const response = await axiosInstance.get(url, { headers });
      return response.data;
    } catch (err) {
      handleError(err, 'Error fetching data');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const postData = async (url, data) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();
      const response = await axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (err) {
      handleError(err, 'Error creating data');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const putData = async (url, data) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();
      const response = await axiosInstance.put(url, data, { headers });
      return response.data;
    } catch (err) {
      handleError(err, 'Error updating data');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteData = async (url) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();
      await axiosInstance.delete(url, { headers });
    } catch (err) {
      handleError(err, 'Error deleting data');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getSubtasks = async (taskIdValue) => {
    taskId.value = taskIdValue; 
    try {
      subtasks.value = await fetchData(`/tasks/${taskId.value}/subtasks`);
    } catch (error) {
      console.error('Failed to get subtasks:', error);
    }
  };

  const getSubtaskById = async (subtaskIdValue) => {
    try {
      subtask.value = await fetchData(`/tasks/${taskId.value}/subtasks/${subtaskIdValue}`);
    } catch (error) {
      console.error('Failed to get subtask:', error);
    }
  };

  const createSubtask = async (subtaskData) => {
    try {
      const newSubtask = await postData(`/tasks/${taskId.value}/subtasks`, subtaskData);
      subtasks.value.push(newSubtask);
    } catch (error) {
      console.error('Failed to create subtask:', error);
    }
  };

  const updateSubtask = async (subtaskIdValue, subtaskData) => {
    try {
      const updatedSubtask = await putData(`/tasks/${taskId.value}/subtasks/${subtaskIdValue}`, subtaskData);
      const index = subtasks.value.findIndex((subtask) => subtask.id === subtaskIdValue);
      if (index !== -1) {
        subtasks.value[index] = updatedSubtask;
      }
    } catch (error) {
      console.error('Failed to update subtask:', error);
    }
  };

  const deleteSubtask = async (subtaskIdValue) => {
    try {
      await deleteData(`/tasks/${taskId.value}/subtasks/${subtaskIdValue}`);
      subtasks.value = subtasks.value.filter((subtask) => subtask.id !== subtaskIdValue);
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  };

  return {
    loading,
    error,
    subtasks,
    subtask,
    getSubtasks,
    getSubtaskById,
    createSubtask,
    updateSubtask,
    deleteSubtask,
  };
});
