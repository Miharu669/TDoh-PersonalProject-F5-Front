<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  initialTitle: {
    type: String,
    default: ''
  },
  initialContent: {
    type: String,
    default: ''
  },
});

const title = ref(props.initialTitle);
const content = ref(props.initialContent);

const emit = defineEmits(['submit', 'close']);

watch(props, (newProps) => {
  title.value = newProps.initialTitle;
  content.value = newProps.initialContent;
});

function submitNote() {
  if (title.value.trim() && content.value.trim()) {
    emit('submit', { title: title.value.trim(), content: content.value.trim() });
    title.value = '';
    content.value = '';
  }
}

function closeForm() {
  emit('close');
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-yellow-100 rounded-lg shadow-lg p-8 max-w-md w-full relative">
      <button @click="closeForm"
        class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl">&times;</button>

      <h2 class="text-2xl font-semibold text-cyan-600 text-center mb-6">{{ initialTitle ? 'Edit Note' : 'Add New Note'
        }}</h2>

      <form @submit.prevent="submitNote">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title</label>
          <input v-model="title" type="text" id="title"
            class="w-full bg-yellow-50 px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-cyan-500"
            placeholder="Enter note title" required />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="content">Content</label>
          <textarea v-model="content" id="content"
            class="w-full px-3 bg-yellow-50 py-2 border rounded shadow-sm focus:outline-none focus:border-cyan-500" rows="4"
            placeholder="Enter note content" required></textarea>
        </div>

        <div class="flex justify-center space-x-4">
          <button type="submit" class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full">{{ initialTitle
            ? 'Update Note' : 'Add Note' }}</button>
          <button type="button" @click="closeForm"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full">Close</button>
        </div>
      </form>
    </div>
  </div>
</template>
