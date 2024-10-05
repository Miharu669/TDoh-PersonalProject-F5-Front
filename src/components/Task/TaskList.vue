<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TaskCard from './TaskCard.vue';
import TaskModal from './TaskModal.vue';
import SubtaskModal from './SubtaskModal.vue';

const tasks = ref([]);
const loading = ref(false);
const error = ref(null);

const isTaskModalVisible = ref(false);
const isSubtaskModalVisible = ref(false);

const selectedTaskId = ref(null);

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

const addTask = async (newTask) => {
  try {
    const response = await axiosInstance.post('/tasks', newTask);
    tasks.value.push(response.data);
    closeTaskModal();
  } catch (err) {
    console.error("Error creating task:", err);
  }
};

const addSubtask = async (newSubtask) => {
  try {
    const response = await axiosInstance.post(`/subtasks`, { ...newSubtask, taskId: selectedTaskId.value });
    
    const task = tasks.value.find(task => task.id === selectedTaskId.value);
    if (task) {
      task.subTasks.push(response.data);
    }

    closeSubtaskModal();
  } catch (err) {
    console.error("Error creating subtask:", err);
  }
};

const openTaskModal = () => {
  isTaskModalVisible.value = true;
};

const closeTaskModal = () => {
  isTaskModalVisible.value = false;
};

const openSubtaskModal = (taskId) => {
  selectedTaskId.value = taskId;  
  isSubtaskModalVisible.value = true;
};

const closeSubtaskModal = () => {
  isSubtaskModalVisible.value = false;
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
      <button @click="openTaskModal" class="bg-teal-400 text-black px-4 py-2 rounded-full hover:bg-teal-300">
        <i class="fas fa-plus"></i> Add Task
      </button>
    </div>

    <TaskModal :isVisible="isTaskModalVisible" :onClose="closeTaskModal" :onAddTask="addTask" />

    <SubtaskModal :isVisible="isSubtaskModalVisible" :onClose="closeSubtaskModal" :onAddSubtask="addSubtask" />

    <div v-if="tasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :markTaskComplete="markTaskComplete"
        :addSubtask="openSubtaskModal" 
        :markSubtaskComplete="markSubtaskComplete"
      />
    </div>
    
    <div v-else class="text-center text-gray-500">No tasks available.</div>
  </div>
</template>
