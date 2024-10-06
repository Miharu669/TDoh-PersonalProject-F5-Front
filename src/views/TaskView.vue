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

function closeTaskModal() {
  isTaskModalVisible.value = false;
  isEditMode.value = false;
  currentTask.value = { id: null, title: "", description: "" };
}

onMounted(() => {
  tasksStore.fetchTasks();
});
</script>

<template>
  <div class="tasks-container">
    <button @click="openAddTaskModal" class="mb-4">
      <i class="fas fa-plus"></i> Add Task
    </button>

    <div v-if="tasks && tasks.length">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit-task="openEditTaskModal"
      />
    </div>
    <p v-else>No tasks found.</p>

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
