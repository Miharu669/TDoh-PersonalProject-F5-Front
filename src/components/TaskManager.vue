<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Task Manager</h1>

    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

    <div v-if="loading" class="flex justify-center items-center">
      <span>Loading...</span>
    </div>

    <div v-else>
      <div v-for="task in tasks" :key="task.id" class="p-4 mb-2 border rounded shadow">
        <h2 class="text-xl font-semibold">{{ task.title }}</h2>
        <p>{{ task.description }}</p>
        <div class="mt-2">
          <button class="bg-blue-500 text-white px-4 py-2 rounded mr-2" @click="viewSubtasks(task.id)">
            View Subtasks
          </button>
          <button class="bg-green-500 text-white px-4 py-2 rounded" @click="toggleAddSubtask(task.id)">
            Add Subtask
          </button>
        </div>

        <div v-if="task.id === activeTaskId">
          <div v-for="subtask in subtasks" :key="subtask.id" class="p-2 mt-2 border rounded shadow-sm">
            <h3 class="text-lg font-medium">{{ subtask.title }}</h3>
            <p>{{ subtask.description }}</p>
            <div class="mt-2">
              <button class="bg-blue-400 text-white px-4 py-1 rounded mr-2" @click="viewMinitasks(subtask.id)">
                View MiniTasks
              </button>
              <button class="bg-green-400 text-white px-4 py-1 rounded" @click="toggleAddMinitask(subtask.id)">
                Add MiniTask
              </button>
            </div>

            <div v-if="subtask.id === activeSubtaskId">
              <div v-for="minitask in minitasks" :key="minitask.id" class="p-2 mt-1 border rounded shadow-sm">
                <h4 class="text-md font-medium">{{ minitask.title }}</h4>
                <p>{{ minitask.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showAddSubtask && task.id === activeTaskId" class="mt-4">
          <input
            type="text"
            v-model="newSubtask.title"
            placeholder="Subtask title"
            class="border p-2 rounded mb-2 w-full"
          />
          <textarea
            v-model="newSubtask.description"
            placeholder="Subtask description"
            class="border p-2 rounded mb-2 w-full"
          ></textarea>
          <button class="bg-green-500 text-white px-4 py-2 rounded" @click="addSubtask(task.id)">
            Add Subtask
          </button>
        </div>
      </div>

      <div class="mt-4">
        <h2 class="text-xl font-semibold mb-2">Add New Task</h2>
        <input
          type="text"
          v-model="newTask.title"
          placeholder="Task title"
          class="border p-2 rounded mb-2 w-full"
        />
        <textarea
          v-model="newTask.description"
          placeholder="Task description"
          class="border p-2 rounded mb-2 w-full"
        ></textarea>
        <button class="bg-green-500 text-white px-4 py-2 rounded" @click="addTask">
          Add Task
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useTaskStore } from './../stores/taskStore'; 

export default {
  name: 'TaskManager',
  setup() {
    const taskStore = useTaskStore();

    const newTask = ref({ title: '', description: '' });
    const newSubtask = ref({ title: '', description: '' });
    const activeTaskId = ref(null);
    const activeSubtaskId = ref(null);
    const showAddSubtask = ref(false);

    const {
      tasks,
      loading,
      error,
      subtasks,
      minitasks,
      getTasks,
      getSubtasksByTaskId,
      getMinitasksBySubtaskId,
      createTask,
      createSubtask,
    } = taskStore;

    const fetchTasks = async () => {
      await getTasks();
    };

    const addTask = async () => {
      if (!newTask.value.title || !newTask.value.description) return;
      await createTask(newTask.value);
      newTask.value = { title: '', description: '' };
    };

    const viewSubtasks = async (taskId) => {
      activeTaskId.value = taskId;
      await getSubtasksByTaskId(taskId);
    };

    const addSubtask = async (taskId) => {
      if (!newSubtask.value.title || !newSubtask.value.description) return;
      await createSubtask(taskId, newSubtask.value);
      newSubtask.value = { title: '', description: '' };
      showAddSubtask.value = false;
      await getSubtasksByTaskId(taskId);
    };

    const toggleAddSubtask = (taskId) => {
      activeTaskId.value = taskId;
      showAddSubtask.value = !showAddSubtask.value;
    };

    const viewMinitasks = async (subtaskId) => {
      activeSubtaskId.value = subtaskId;
      await getMinitasksBySubtaskId(subtaskId);
    };

    const toggleAddMinitask = (subtaskId) => {
      activeSubtaskId.value = subtaskId;
    };

    fetchTasks();

    return {
      tasks,
      loading,
      error,
      subtasks,
      minitasks,
      newTask,
      newSubtask,
      activeTaskId,
      activeSubtaskId,
      showAddSubtask,
      addTask,
      viewSubtasks,
      addSubtask,
      toggleAddSubtask,
      viewMinitasks,
      toggleAddMinitask,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
