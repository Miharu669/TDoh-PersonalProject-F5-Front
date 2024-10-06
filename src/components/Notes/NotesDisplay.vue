<script setup>
const props = defineProps({
  notes: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['add-note', 'edit-note', 'delete-note']);
</script>

<template>
    <div class="flex items-center justify-center  mb-10">

  <div class="bg-notepad bg-yellow-100 bg-cover p-6 rounded-2xl w-4/6 min-h-screen ">
    <button @click="$emit('add-note')"
      class="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 flex items-center justify-center">
      <img src="@/assets/icons/add.png" alt="Add Note" class="w-full h-full object-contain" />
    </button>

    <div class="mt-16 w-full flex justify-center">
      <div class="space-y-4 w-3/4 mb-5">
        <div v-for="note in notes" :key="note.id"
          class="bg-yellow-50 shadow-md p-4 rounded-lg border-b-4 border-amber-300">
          <h3 class="font-semibold">{{ note.title }}</h3>
          <p class="text-gray-700">{{ note.content }}</p>

          <div class="flex justify-end space-x-2 mt-1 ">
            <button @click="$emit('edit-note', note)" class="bg-transparent text-black px-1 py-1 rounded">
              <i class="fas fa-pencil-alt"></i>
            </button>

            <button @click="$emit('delete-note', note.id)" class="bg-transparent text-black px-1 py-1 rounded">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
    </div>
</template>

<style>
.bg-notepad {
  background-image: url('https://www.transparenttextures.com/patterns/notebook.png');
}
</style>
