import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth'; 

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref([]);
  const task = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const subtasks = ref([]);
  const subtask = ref(null);

  const minitasks = ref([]);
  const minitask = ref(null);

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const setAuthHeader = () => {
    const authStore = useAuthStore(); 
    const accessToken = authStore.user.access_token; 
    return  {'Authorization': 'Bearer ' + accessToken}
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

  const getTasks = async () => {
    try {
      tasks.value = await fetchData('/tasks');
    } catch (error) {
      console.error('Failed to get tasks:', error);
    }
  };

  const getTask = async (taskId) => {
    try {
      task.value = await fetchData(`/tasks/${taskId}`);
    } catch (error) {
      console.error('Failed to get task:', error);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await postData('/tasks', taskData);
      tasks.value.push(newTask);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await putData(`/tasks/${taskId}`, taskData);
      const index = tasks.value.findIndex((task) => task.id === taskId);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteData(`/tasks/${taskId}`);
      tasks.value = tasks.value.filter((task) => task.id !== taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Subtask-related methods

  const getSubtasksByTaskId = async (taskId) => {
    try {
      subtasks.value = await fetchData(`/tasks/${taskId}/subtasks`);
    } catch (error) {
      console.error('Failed to fetch subtasks:', error);
    }
  };

  const createSubtask = async (taskId, subtaskData) => {
    try {
      const newSubtask = await postData(`/tasks/${taskId}/subtasks`, subtaskData);
      subtasks.value.push(newSubtask);
    } catch (error) {
      console.error('Failed to create subtask:', error);
    }
  };

  const updateSubtask = async (subtaskId, subtaskData) => {
    try {
      const updatedSubtask = await putData(`/subtasks/${subtaskId}`, subtaskData);
      const index = subtasks.value.findIndex((subtask) => subtask.id === subtaskId);
      if (index !== -1) {
        subtasks.value[index] = updatedSubtask;
      }
    } catch (error) {
      console.error('Failed to update subtask:', error);
    }
  };

  const deleteSubtask = async (subtaskId) => {
    try {
      await deleteData(`/subtasks/${subtaskId}`);
      subtasks.value = subtasks.value.filter((subtask) => subtask.id !== subtaskId);
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  };


  const getMinitasksBySubtaskId = async (subtaskId) => {
    try {
      minitasks.value = await fetchData(`/subtasks/${subtaskId}/minitasks`);
    } catch (error) {
      console.error('Failed to fetch minitasks:', error);
    }
  };

  const createMinitask = async (subtaskId, minitaskData) => {
    try {
      const newMinitask = await postData(`/subtasks/${subtaskId}/minitasks`, minitaskData);
      minitasks.value.push(newMinitask);
    } catch (error) {
      console.error('Failed to create minitask:', error);
    }
  };

  const updateMinitask = async (minitaskId, minitaskData) => {
    try {
      const updatedMinitask = await putData(`/minitasks/${minitaskId}`, minitaskData);
      const index = minitasks.value.findIndex((minitask) => minitask.id === minitaskId);
      if (index !== -1) {
        minitasks.value[index] = updatedMinitask;
      }
    } catch (error) {
      console.error('Failed to update minitask:', error);
    }
  };

  const deleteMinitask = async (minitaskId) => {
    try {
      await deleteData(`/minitasks/${minitaskId}`);
      minitasks.value = minitasks.value.filter((minitask) => minitask.id !== minitaskId);
    } catch (error) {
      console.error('Failed to delete minitask:', error);
    }
  };

  return {
    tasks,
    task,
    loading,
    error,
    subtasks,
    subtask,
    minitasks,
    minitask,
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getSubtasksByTaskId,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    getMinitasksBySubtaskId,
    createMinitask,
    updateMinitask,
    deleteMinitask,
  };
});
