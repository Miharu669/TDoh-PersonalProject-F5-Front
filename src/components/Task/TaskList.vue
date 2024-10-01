<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TaskCard from './TaskCard.vue';
import TaskModal from './TaskModal.vue';

const tasks = ref([]);
const loading = ref(false);
const error = ref(null);
const isModalVisible = ref(false);


const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

const axiosInstance = axios.create({
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  },
});

const fetchTasks = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axiosInstance.get('/tasks');
    tasks.value = response.data;
  } catch (err) {
    error.value = err.message || 'Error fetching tasks';
  } finally {
    loading.value = false;
  }
};

const markTaskComplete = async (task) => {
  try {
    await axiosInstance.put(`/tasks/${task.id}`, { ...task, isDone: !task.isDone });
    task.isDone = !task.isDone;
  } catch (err) {
    console.error("Error updating task:", err);
  }
};

const markSubtaskComplete = async (subtask) => {
  try {
    await axiosInstance.put(`/subtasks/${subtask.id}`, { ...subtask, isDone: !subtask.isDone });
    subtask.isDone = !subtask.isDone;
  } catch (err) {
    console.error("Error updating subtask:", err);
  }
};

const markMinitaskComplete = async (minitask) => {
  try {
    await axiosInstance.put(`/minitasks/${minitask.id}`, { ...minitask, isDone: !minitask.isDone });
    minitask.isDone = !minitask.isDone;
  } catch (err) {
    console.error("Error updating minitask:", err);
  }
};

const addTask = async (newTask) => {
  try {
    const response = await axiosInstance.post('/tasks', newTask);
    tasks.value.push(response.data);
    closeModal();
  } catch (err) {
    console.error("Error creating task:", err);
  }
};

const addSubtask = async (task) => {
  const newSubtask = {
    title: "New Subtask",
    description: "Subtask description",
    isDone: false,
  };
  try {
    const response = await axiosInstance.post(`/tasks/${task.id}/subtasks`, newSubtask);
    task.subTasks.push(response.data);
  } catch (err) {
    console.error("Error creating subtask:", err);
  }
};

const addMinitask = async (subtask) => {
  const newMinitask = {
    title: "New Minitask",
    description: "Minitask description",
    isDone: false,
  };
  try {
    const response = await axiosInstance.post(`/subtasks/${subtask.id}/minitasks`, newMinitask);
    subtask.miniTasks.push(response.data);
  } catch (err) {
    console.error("Error creating minitask:", err);
  }
};

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

onMounted(() => {
  fetchTasks();
});
</script>

<template>
  <div class="p-6 bg-gradient-to-r from-orange-700 via-black to-cyan-700 min-h-screen">
    <h1 class="text-5xl font-extrabold mb-10 text-center text-yellow-600">
      <i class="fas fa-tasks"></i> Task Viewer
    </h1>

    <div v-if="loading" class="text-gray-500 text-center text-xl">
      <i class="fas fa-spinner fa-spin"></i> Loading...
    </div>
    <div v-if="error" class="text-red-500 text-center text-xl font-semibold">
      <i class="fas fa-exclamation-circle"></i> {{ error }}
    </div>

    <div class="text-center mb-6">
      <button @click="openModal" class="bg-teal-400 text-black px-4 py-2 rounded-full hover:bg-teal-300">
        <i class="fas fa-plus"></i>
      </button>
    </div>
    <TaskModal :isVisible="isModalVisible" :onClose="closeModal" :onAddTask="addTask" />
    <div v-if="tasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" :markTaskComplete="markTaskComplete"
        :addSubtask="addSubtask" :addMinitask="addMinitask" :markSubtaskComplete="markSubtaskComplete"
        :markMinitaskComplete="markMinitaskComplete" />
    </div>
    <div v-else class="text-center text-gray-500">No tasks available.</div>
  </div>
</template>
