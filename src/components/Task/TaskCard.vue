<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  markTaskComplete: {
    type: Function,
    required: true,
  },
  addSubtask: {
    type: Function,
    required: true,
  },
  markSubtaskComplete: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <div
    class="bg-quinary shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-105">
    <div class="p-6">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold mb-2 text-gray-800 cursor-pointer"
            :class="{ 'line-through text-gray-400': task.isDone }" 
            @click="() => markTaskComplete(task)">
          {{ task.title }}
          <i v-if="task.isDone" class="fas fa-check-circle text-green-500"></i>
        </h2>
      </div>
      <p class="text-gray-700 mb-4 cursor-pointer" 
         :class="{ 'line-through text-gray-400': task.isDone }"
         @click="() => markTaskComplete(task)">
        {{ task.description }}
      </p>

      <button @click="() => addSubtask(task.id)" class="bg-transparent text-black px-4 py-2 rounded-md hover:bg-teal-300">
        <i class="fas fa-plus-circle"></i> Add Subtask
      </button>

      <div v-if="task.subTasks?.length > 0" class="mt-4">
        <h3 class="font-semibold text-2xl mb-2">
          <i class="fas fa-list"></i> Subtasks:
        </h3>
        <div v-for="subtask in task.subTasks" :key="subtask.id"
            class="bg-yellow-200 p-4 mb-2 rounded-lg shadow-md">
          <div class="flex justify-between items-center">
            <h4 class="font-medium text-lg text-gray-800 cursor-pointer"
                :class="{ 'line-through text-gray-400': subtask.isDone }"
                @click="() => markSubtaskComplete(subtask)">
              {{ subtask.title }}
            </h4>
          </div>
          <p class="text-gray-600 cursor-pointer" 
             :class="{ 'line-through text-gray-400': subtask.isDone }"
             @click="() => markSubtaskComplete(subtask)">
            {{ subtask.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
