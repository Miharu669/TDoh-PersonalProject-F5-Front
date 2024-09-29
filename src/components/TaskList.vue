<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const tasks = ref([]);
const loading = ref(false);
const error = ref(null);

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

const axiosInstance = axios.create({
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
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
    task.isDone = !task.isDone; // Toggle the task's completion state
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

const addTask = async () => {
  const newTask = {
    title: "New Task",
    description: "Task description",
    isDone: false,
  };
  try {
    const response = await axiosInstance.post('/tasks', newTask);
    tasks.value.push(response.data);
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

onMounted(() => {
  fetchTasks();
});
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-4xl font-extrabold mb-8 text-center">Task Viewer</h1>

    <div v-if="loading" class="text-gray-500 text-center">Loading...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>

    <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded-md mb-6">
      Add New Task
    </button>

    <div v-if="tasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105"
      >
        <div class="p-6">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-semibold mb-2">
              {{ task.title }}
            </h2>
            <input
              type="checkbox"
              v-model="task.isDone"
              @change="markTaskComplete(task)"
              class="form-checkbox h-5 w-5"
            />
          </div>
          <p class="text-gray-700 mb-4">{{ task.description }}</p>

          <button @click="addSubtask(task)" class="bg-green-500 text-white px-3 py-1 rounded-md mb-2">
            Add Subtask
          </button>

          <div v-if="task.subTasks?.length > 0">
            <h3 class="font-semibold text-xl mb-2">Subtasks:</h3>
            <div v-for="subtask in task.subTasks" :key="subtask.id" class="bg-gray-50 p-4 mb-2 rounded-lg shadow-inner">
              <div class="flex justify-between items-center">
                <h4 class="font-medium text-lg">{{ subtask.title }}</h4>
                <input
                  type="checkbox"
                  v-model="subtask.isDone"
                  @change="markSubtaskComplete(subtask)"
                  class="form-checkbox h-5 w-5"
                />
              </div>
              <p class="text-gray-600">{{ subtask.description }}</p>

              <button @click="addMinitask(subtask)" class="bg-yellow-500 text-white px-3 py-1 rounded-md mt-2">
                Add Minitask
              </button>

              <div v-if="subtask.miniTasks?.length > 0" class="ml-4 mt-2">
                <h5 class="font-semibold text-md mb-1">Minitasks:</h5>
                <ul class="list-disc list-inside">
                  <li v-for="minitask in subtask.miniTasks" :key="minitask.id" class="flex justify-between">
                    <span>{{ minitask.title }}: {{ minitask.description }}</span>
                    <input
                      type="checkbox"
                      v-model="minitask.isDone"
                      @change="markMinitaskComplete(minitask)"
                      class="form-checkbox h-4 w-4"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


