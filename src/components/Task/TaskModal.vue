<script setup>
import { ref } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  onAddTask: {
    type: Function,
    required: true,
  },
});

const newTask = ref({
  title: '',
  description: '',
});

const submitForm = () => {
  props.onAddTask(newTask.value);
  newTask.value = { title: '', description: '' };
};

const closeModal = () => {
  props.onClose();
};
</script>
<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="fixed inset-0 bg-black opacity-50"></div>
    <div class="bg-yellow-200 rounded-lg shadow-lg p-6 max-w-md w-full z-10">
      <h2 class="text-2xl font-bold mb-4">Add New Task</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" id="title" v-model="newTask.title" required
            class="mt-1 block w-full bg-yellow-100 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" v-model="newTask.description" required rows="3"
            class="mt-1 block w-full bg-yellow-100 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"></textarea>
        </div>
        <div class="flex justify-end">
          <button type="button" @click="closeModal" class="mr-2 text-gray-500 hover:text-gray-700">Cancel</button>
          <button type="submit" class="bg-teal-400 text-white px-4 py-2 rounded-md hover:bg-teal-300">Add Task</button>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped></style>
