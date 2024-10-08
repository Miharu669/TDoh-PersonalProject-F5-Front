<script setup>
import {  computed, defineEmits, onMounted } from "vue";
import { useSubTasksStore } from "@/stores/subtaskStore";
import { storeToRefs } from "pinia";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "toggle-task-status",
  "edit-task",
  "delete-task",
  "add-subtask",
  "edit-subtask",
  "toggle-subtask-status",
  "delete-subtask",
]);

const subtaskStore = useSubTasksStore();
const { subtasks } = storeToRefs(subtaskStore);

const taskSubtasks = computed(() => {
  return subtasks.value.filter(subtask => subtask.taskId === props.task.id);
});



const toggleTaskStatus = () => {
  emit("toggle-task-status", props.task);
};

const openAddSubtaskModal = () => {
  emit("add-subtask", props.task);
};

const editSubtask = (subtask) => {
  emit("edit-subtask", subtask, props.task);
};

const toggleSubtaskStatus = (subtask) => {
  emit("toggle-subtask-status", subtask, props.task.id);
};

const editTask = () => {
  emit("edit-task", props.task);
};

const deleteTask = () => {
  emit("delete-task", props.task.id);
};

const deleteSubtask = (subtaskId) => {
  emit("delete-subtask", subtaskId, props.task.id);
};

onMounted(() => {
  subtaskStore.fetchSubTasks(props.task.id);
});
</script>
<template>
  <div
    class="bg-yellow-200 shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:shadow-xl"
  >
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2
          class="text-xl font-semibold text-gray-800 cursor-pointer"
          :class="{ 'line-through text-gray-400': task.isDone }"
          @click="toggleTaskStatus"
        >
          {{ task.title }}
        </h2>

        <div class="flex space-x-2">
          <button @click="editTask" class="text-blue-500 hover:text-blue-700">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="deleteTask" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <p
        class="text-gray-700 mb-4 cursor-pointer"
        :class="{ 'line-through text-gray-400': task.isDone }"
        @click="toggleTaskStatus"
      >
        {{ task.description }}
      </p>

      <button
        @click="openAddSubtaskModal"
        class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full"
      >
        <i class="fas fa-plus-circle"></i> Add Subtask
      </button>

      <div v-if="task.subTasks?.length > 0" class="mt-6">
        <h3 class="font-semibold text-lg mb-2">
          <i class="fas fa-list"></i> Subtasks
        </h3>
        <div
          v-for="subtask in task.subTasks"
          :key="subtask.id"
          class="bg-yellow-100 p-4 mb-2 rounded-lg"
        >
          <div class="flex justify-between items-center">
            <h4
              class="font-medium text-gray-800 cursor-pointer"
              :class="{ 'line-through text-gray-400': subtask.isDone }"
              @click="toggleSubtaskStatus(subtask)"
            >
              {{ subtask.title }}
            </h4>
            <div class="flex space-x-2">
              <button
                @click="editSubtask(subtask)"
                class="text-blue-500 hover:text-blue-700"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteSubtask(subtask.id)"
                class="text-red-500 hover:text-red-700"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <p
            class="text-gray-600 cursor-pointer mt-1"
            :class="{ 'line-through text-gray-400': subtask.isDone }"
            @click="toggleSubtaskStatus(subtask)"
          >
            {{ subtask.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
