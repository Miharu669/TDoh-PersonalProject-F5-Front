<script setup>
import { ref } from "vue";
import { defineProps } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  onAddEvent: {
    type: Function,
    required: true,
  },
});

const eventName = ref("");

const submitForm = () => {
  if (eventName.value) {
    props.onAddEvent(eventName.value);
    eventName.value = "";
    props.onClose();
  }
};

const closeModal = () => {
  props.onClose();
};
</script>
<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <div class="fixed inset-0 bg-black opacity-50"></div>
    <div class="bg-yellow-50 rounded-lg shadow-lg p-6 max-w-md w-full z-10">
      <h2 class="text-2xl font-bold mb-4">Add Event</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="eventName" class="block text-sm font-medium text-gray-700"
            >Event:</label
          >
          <input
            type="text"
            id="eventName"
            v-model="eventName"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            @click="closeModal"
            class="mr-2 text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-teal-400 text-white px-4 py-2 rounded-md hover:bg-teal-300"
          >
            Add Event
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
