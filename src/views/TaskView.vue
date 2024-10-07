<script setup>
import { ref, onMounted } from "vue";
import { useTasksStore } from "@/stores/taskStore";
import { useSubTasksStore } from "@/stores/subtaskStore";
import { storeToRefs } from "pinia";
import TaskCard from "@/components/Task/TaskCard.vue";
import TaskModal from "@/components/Task/TaskModal.vue";
import SubtaskModal from "@/components/Task/SubtaskModal.vue";

const tasksStore = useTasksStore();
const subTasksStore = useSubTasksStore();
const { tasks, loading, error } = storeToRefs(tasksStore);

const isTaskModalVisible = ref(false);
const isEditMode = ref(false);
const currentTask = ref({
  id: null,
  title: "",
  description: "",
});

const isSubtaskModalVisible = ref(false);
const isSubtaskEditMode = ref(false);
const currentSubtask = ref({
  id: null,
  title: "",
  description: "",
  taskId: null,
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

function openAddSubtaskModal(task) {
  isSubtaskEditMode.value = false;
  currentSubtask.value = {
    id: null,
    title: "",
    description: "",
    taskId: task.id,
  };
  isSubtaskModalVisible.value = true;
}

function openEditSubtaskModal(subtask, task) {
  isSubtaskEditMode.value = true;
  currentSubtask.value = {
    id: subtask.id,
    title: subtask.title,
    description: subtask.description,
    taskId: task.id,
  };
  isSubtaskModalVisible.value = true;
}

async function submitSubtask(subtaskData) {
  try {
    if (isSubtaskEditMode.value && currentSubtask.value.id) {
      await subTasksStore.updateSubTask(
        currentSubtask.value.taskId,
        currentSubtask.value.id,
        subtaskData.title,
        subtaskData.description
      );
    } else {
      await subTasksStore.addSubTask(
        currentSubtask.value.taskId,
        subtaskData.title,
        subtaskData.description
      );
    }
    closeSubtaskModal();
  } catch (err) {
    console.error("Failed to save subtask:", err);
  }
}


function closeSubtaskModal() {
  isSubtaskModalVisible.value = false;
  isSubtaskEditMode.value = false;
  currentSubtask.value = { id: null, title: "", description: "", taskId: null };
}

async function toggleSubtaskStatus(subtask, taskId) {
  const originalStatus = subtask.isDone;
  subtask.isDone = !originalStatus;
  try {
    await tasksStore.updateSubtaskStatus(taskId, subtask.id, subtask.isDone);
  } catch (err) {
    console.error("Failed to update subtask status:", err);
    subtask.isDone = originalStatus;
  }
}

async function deleteSubtask(subtaskId, taskId) {
  try {
    await subTasksStore.deleteSubTask(subtaskId);
  } catch (err) {
    console.error("Failed to delete subtask:", err);
  }
}

onMounted(() => {
  tasksStore.fetchTasks();
});
</script>
<template>
  <div class="tasks-container px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">My Tasks</h1>
      <button
        @click="openAddTaskModal"
        class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full"
      >
        <i class="fas fa-plus"></i> Add Task
      </button>
    </div>

    <div
      v-if="tasks && tasks.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle-task-status="toggleTaskStatus"
        @edit-task="openEditTaskModal"
        @delete-task="deleteTask"
        @add-subtask="openAddSubtaskModal"
        @edit-subtask="openEditSubtaskModal"
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

    <SubtaskModal
      v-if="isSubtaskModalVisible"
      :initial-title="currentSubtask.title"
      :initial-description="currentSubtask.description"
      :is-edit-mode="isSubtaskEditMode"
      @submit="submitSubtask"
      @close="closeSubtaskModal"
    />
  </div>
</template>

<style scoped>
.tasks-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
