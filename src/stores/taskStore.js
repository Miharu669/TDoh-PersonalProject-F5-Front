import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/core/apis/axiosConfig';

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref([]);
  const task = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const subtasks = ref([]);
  const subtask = ref(null);

  const minitasks = ref([]);
  const minitask = ref(null);

  const getTasks = async () => {
    loading.value = true;
    error.value = null;
    try {
      console.log('Making request to /tasks without auth');
      const response = await apiClient.get('/tasks', {
        headers: {
          Authorization: ''  // Clear auth header
        }
      });
      tasks.value = response.data;
    } catch (err) {
      error.value = err.message || 'Error fetching tasks';
    } finally {
      loading.value = false;
    }
  };
  

  const getTask = async (taskId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(`/tasks/${taskId}`);
      task.value = response.data;
    } catch (err) {
      error.value = err.message || 'Error fetching task';
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (taskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post('/tasks', taskData);
      tasks.value.push(response.data);
    } catch (err) {
      error.value = err.message || 'Error creating task';
    } finally {
      loading.value = false;
    }
  };

  const updateTask = async (taskId, taskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, taskData);
      const index = tasks.value.findIndex((task) => task.id === taskId);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }
    } catch (err) {
      error.value = err.message || 'Error updating task';
    } finally {
      loading.value = false;
    }
  };

  const deleteTask = async (taskId) => {
    loading.value = true;
    error.value = null;
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      tasks.value = tasks.value.filter((task) => task.id !== taskId);
    } catch (err) {
      error.value = err.message || 'Error deleting task';
    } finally {
      loading.value = false;
    }
  };

  const getSubtasksByTaskId = async (taskId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(`/tasks/${taskId}/subtasks`);
      subtasks.value = response.data;
    } catch (err) {
      error.value = err.message || 'Error fetching subtasks';
    } finally {
      loading.value = false;
    }
  };

  const createSubtask = async (taskId, subtaskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post(`/tasks/${taskId}/subtasks`, subtaskData);
      subtasks.value.push(response.data);
    } catch (err) {
      error.value = err.message || 'Error creating subtask';
    } finally {
      loading.value = false;
    }
  };

  const updateSubtask = async (subtaskId, subtaskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.put(`/subtasks/${subtaskId}`, subtaskData);
      const index = subtasks.value.findIndex((subtask) => subtask.id === subtaskId);
      if (index !== -1) {
        subtasks.value[index] = response.data;
      }
    } catch (err) {
      error.value = err.message || 'Error updating subtask';
    } finally {
      loading.value = false;
    }
  };

  const deleteSubtask = async (subtaskId) => {
    loading.value = true;
    error.value = null;
    try {
      await apiClient.delete(`/subtasks/${subtaskId}`);
      subtasks.value = subtasks.value.filter((subtask) => subtask.id !== subtaskId);
    } catch (err) {
      error.value = err.message || 'Error deleting subtask';
    } finally {
      loading.value = false;
    }
  };

  const getMinitasksBySubtaskId = async (subtaskId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(`/subtasks/${subtaskId}/minitasks`);
      minitasks.value = response.data;
    } catch (err) {
      error.value = err.message || 'Error fetching mini tasks';
    } finally {
      loading.value = false;
    }
  };

  const createMinitask = async (subtaskId, minitaskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post(`/subtasks/${subtaskId}/minitasks`, minitaskData);
      minitasks.value.push(response.data);
    } catch (err) {
      error.value = err.message || 'Error creating mini task';
    } finally {
      loading.value = false;
    }
  };

  const updateMinitask = async (minitaskId, minitaskData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.put(`/minitasks/${minitaskId}`, minitaskData);
      const index = minitasks.value.findIndex((minitask) => minitask.id === minitaskId);
      if (index !== -1) {
        minitasks.value[index] = response.data;
      }
    } catch (err) {
      error.value = err.message || 'Error updating mini task';
    } finally {
      loading.value = false;
    }
  };

  const deleteMinitask = async (minitaskId) => {
    loading.value = true;
    error.value = null;
    try {
      await apiClient.delete(`/minitasks/${minitaskId}`);
      minitasks.value = minitasks.value.filter((minitask) => minitask.id !== minitaskId);
    } catch (err) {
      error.value = err.message || 'Error deleting mini task';
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
