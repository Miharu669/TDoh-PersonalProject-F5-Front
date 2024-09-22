<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Task Viewer</h1>
      
      <div v-if="loading" class="text-gray-500">Loading...</div>
      <div v-if="error" class="text-red-500">{{ error }}</div>
  
      <div v-if="tasks.length > 0" class="mt-4">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="border border-gray-300 rounded-md p-4 mb-4"
        >
          <h2 class="text-lg font-semibold">
            Task: {{ task.title }}
          </h2>
          <p>{{ task.description }}</p>
          
          <div v-if="task.subTasks?.length > 0" class="ml-4 mt-2">
            <h3 class="font-semibold">Subtasks:</h3>
            <div
              v-for="subtask in task.subTasks"
              :key="subtask.id"
              class="border border-gray-200 rounded-md p-3 my-2"
            >
              <h4>{{ subtask.title }}</h4>
              <p>{{ subtask.description }}</p>
              
              <div v-if="subtask.miniTasks?.length > 0" class="ml-4 mt-2">
                <h5 class="font-semibold">Minitasks:</h5>
                <ul>
                  <li
                    v-for="minitask in subtask.miniTasks"
                    :key="minitask.id"
                    class="ml-4 my-1"
                  >
                    - {{ minitask.title }}: {{ minitask.description }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import apiClient from '@/core/apis/axiosConfig'; 
  
  const tasks = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  const fetchTasks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/tasks');
      tasks.value = response.data; // Assign fetched data to tasks
      console.log("Fetched tasks:", tasks.value); 
    } catch (err) {
      error.value = err.message || 'Error fetching tasks';
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(() => {
    fetchTasks();
  });
  </script>
  
  <style scoped>
  </style>
  