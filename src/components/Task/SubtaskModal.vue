<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  initialTitle: {
    type: String,
    default: "",
  },
  initialDescription: {
    type: String,
    default: "",
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit", "close"]);

const title = ref(props.initialTitle);
const description = ref(props.initialDescription);

function submitSubtask() {
  if (title.value.trim() && description.value.trim()) {
    const subtaskData = {
      title: title.value.trim(),
      description: description.value.trim(),
    };
    emit("submit", subtaskData);
    resetForm();
  }
}

function closeModal() {
  resetForm();
  emit("close");
}

function resetForm() {
  title.value = "";
  description.value = "";
}

watch(
  () => [props.initialTitle, props.initialDescription],
  ([newTitle, newDescription]) => {
    title.value = newTitle;
    description.value = newDescription;
  }
);

onMounted(() => {
  document.querySelector(".bg-white").focus();
});
</script>
<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-75"
      @click.self="closeModal"
    ></div>

    <div
      class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
      @keydown.esc="closeModal"
      tabindex="0"
    >
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl focus:outline-none"
      >
        &times;
      </button>

      <h2 class="text-2xl font-semibold text-cyan-600 text-center mb-6">
        {{ isEditMode ? "Edit Subtask" : "Add New Subtask" }}
      </h2>

      <form @submit.prevent="submitSubtask">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
            Title
          </label>
          <input
            v-model="title"
            type="text"
            id="title"
            class="w-full bg-gray-100 px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-cyan-500"
            placeholder="Enter subtask title"
            required
          />
        </div>

        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="description"
          >
            Description
          </label>
          <textarea
            v-model="description"
            id="description"
            class="w-full px-3 bg-gray-100 py-2 border rounded shadow-sm focus:outline-none focus:border-cyan-500"
            rows="4"
            placeholder="Enter subtask description"
            required
          ></textarea>
        </div>

        <div class="flex justify-center space-x-4">
          <button
            type="submit"
            class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full focus:outline-none"
          >
            {{ isEditMode ? "Update Subtask" : "Add Subtask" }}
          </button>
          <button
            type="button"
            @click="closeModal"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full focus:outline-none"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
