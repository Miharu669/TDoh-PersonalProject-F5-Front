<template>
  <div class="tasks-container px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">My Tasks</h1>
      <button @click="openAddTaskModal" class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full">
        <i class="fas fa-plus"></i> Add Task
      </button>
    </div>

    <div v-if="tasks && tasks.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle-task-status="toggleTaskStatus"
        @edit-task="openEditTaskModal"
        @delete-task="deleteTask"
        @add-subtask="openAddSubtaskModal"
        @toggle-subtask-status="toggleSubtaskStatus"
        @delete-subtask="deleteSubtask"
      />
    </div>
    <p v-else class="text-center text-gray-600">No tasks found.</p>

    <TaskModal
      v-if="isTaskModalVisible"
      :initial-title="currentTask.title"
      :initial-description="currentTask.description"
      :is-edit-mode="isEditMode"
      @submit="submitTask"
      @close="closeTaskModal"
    />

    <div
      v-if="loading"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40"
    >
      <div class="bg-white p-4 rounded shadow">
        <p class="text-center text-lg font-semibold">Loading...</p>
      </div>
    </div>

    <div
      v-if="error"
      class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow z-50"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTasksStore } from "@/stores/taskStore";
import { storeToRefs } from "pinia";
import TaskCard from "@/components/Task/TaskCard.vue";
import TaskModal from "@/components/Task/TaskModal.vue";

const tasksStore = useTasksStore();
const { tasks, loading, error } = storeToRefs(tasksStore);

const isTaskModalVisible = ref(false);
const isEditMode = ref(false);
const currentTask = ref({
  id: null,
  title: "",
  description: "",
});

function openAddTaskModal() {
  isEditMode.value = false;
  currentTask.value = { id: null, title: "", description: "" };
  isTaskModalVisible.value = true;
}

function openEditTaskModal(task) {
  isEditMode.value = true;
  currentTask.value = { ...task };
  isTaskModalVisible.value = true;
}

async function submitTask(taskData) {
  try {
    if (isEditMode.value && currentTask.value.id) {
      await tasksStore.updateTask(
        currentTask.value.id,
        taskData.title,
        taskData.description
      );
    } else {
      await tasksStore.addTask(taskData.title, taskData.description);
    }
    closeTaskModal();
  } catch (err) {
    console.error("Failed to save task:", err);
  }
}

async function toggleTaskStatus(task) {
  const originalStatus = task.isDone;
  task.isDone = !originalStatus; 
  try {
    await tasksStore.updateTaskStatus(task.id, task.isDone);
  } catch (err) {
    console.error("Failed to update task status:", err);
    task.isDone = originalStatus; 
    alert("Unable to update task status. Please try again.");
  }
}




async function deleteTask(taskId) {
  try {
    await tasksStore.deleteTask(taskId);
  } catch (err) {
    console.error("Failed to delete task:", err);
  }
}

function openAddSubtaskModal(taskId) {
  // Implement subtask modal logic here
}

async function toggleSubtaskStatus(subtask) {
  try {
    // Implement subtask status update logic
  } catch (err) {
    console.error("Failed to update subtask status:", err);
  }
}

async function deleteSubtask(subtaskId) {
  try {
    // Implement subtask deletion logic
  } catch (err) {
    console.error("Failed to delete subtask:", err);
  }
}

function closeTaskModal() {
  isTaskModalVisible.value = false;
  isEditMode.value = false;
  currentTask.value = { id: null, title: "", description: "" };
}

onMounted(() => {
  tasksStore.fetchTasks();
});
</script>

<style scoped>
.tasks-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
