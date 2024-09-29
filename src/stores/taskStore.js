import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

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
    },
  });

  const getTasks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.get('/tasks');
      tasks.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching tasks';
    } finally {
      loading.value = false;
    }
  };

  const getTask = async (taskId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.get(`/tasks/${taskId}`);
      task.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching task';
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (taskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.post('/tasks', taskData);
      tasks.value.push(response.data);
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creating task';
    } finally {
      loading.value = false;
    }
  };

  const updateTask = async (taskId, taskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
      const index = tasks.value.findIndex((task) => task.id === taskId);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error updating task';
    } finally {
      loading.value = false;
    }
  };

  const deleteTask = async (taskId) => {
    loading.value = true;
    error.value = null;
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      tasks.value = tasks.value.filter((task) => task.id !== taskId);
    } catch (err) {
      error.value = err.response?.data?.message || 'Error deleting task';
    } finally {
      loading.value = false;
    }
  };

  const getSubtasksByTaskId = async (taskId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.get(`/tasks/${taskId}/subtasks`);
      subtasks.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching subtasks';
    } finally {
      loading.value = false;
    }
  };

  const createSubtask = async (taskId, subtaskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.post(`/tasks/${taskId}/subtasks`, subtaskData);
      subtasks.value.push(response.data);
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creating subtask';
    } finally {
      loading.value = false;
    }
  };

  const updateSubtask = async (subtaskId, subtaskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.put(`/subtasks/${subtaskId}`, subtaskData);
      const index = subtasks.value.findIndex((subtask) => subtask.id === subtaskId);
      if (index !== -1) {
        subtasks.value[index] = response.data;
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error updating subtask';
    } finally {
      loading.value = false;
    }
  };

  const deleteSubtask = async (subtaskId) => {
    loading.value = true;
    error.value = null;
    try {
      await axiosInstance.delete(`/subtasks/${subtaskId}`);
      subtasks.value = subtasks.value.filter((subtask) => subtask.id !== subtaskId);
    } catch (err) {
      error.value = err.response?.data?.message || 'Error deleting subtask';
    } finally {
      loading.value = false;
    }
  };

  const getMinitasksBySubtaskId = async (subtaskId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.get(`/subtasks/${subtaskId}/minitasks`);
      minitasks.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching mini tasks';
    } finally {
      loading.value = false;
    }
  };

  const createMinitask = async (subtaskId, minitaskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.post(`/subtasks/${subtaskId}/minitasks`, minitaskData);
      minitasks.value.push(response.data);
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creating mini task';
    } finally {
      loading.value = false;
    }
  };

  const updateMinitask = async (minitaskId, minitaskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.put(`/minitasks/${minitaskId}`, minitaskData);
      const index = minitasks.value.findIndex((minitask) => minitask.id === minitaskId);
      if (index !== -1) {
        minitasks.value[index] = response.data;
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error updating mini task';
    } finally {
      loading.value = false;
    }
  };

  const deleteMinitask = async (minitaskId) => {
    loading.value = true;
    error.value = null;
    try {
      await axiosInstance.delete(`/minitasks/${minitaskId}`);
      minitasks.value = minitasks.value.filter((minitask) => minitask.id !== minitaskId);
    } catch (err) {
      error.value = err.response?.data?.message || 'Error deleting mini task';
    } finally {
      loading.value = false;
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
