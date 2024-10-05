<script setup>
import { ref, onMounted } from 'vue';
import { useNotesStore } from '@/stores/noteStore';
import { useAuthStore } from '@/stores/auth';  
import { storeToRefs } from 'pinia';
import NotesDisplay from './NotesDisplay.vue';
import AddNoteForm from './AddNoteForm.vue';

const notesStore = useNotesStore();
const authStore = useAuthStore(); 

const { notes, loading, error } = storeToRefs(notesStore); 
const isAddNoteFormVisible = ref(false);



function toggleAddNoteForm() {
  isAddNoteFormVisible.value = !isAddNoteFormVisible.value;
}

const handleAddNote = async (newNote) => {
  try {
    await notesStore.addNote(newNote.title, newNote.content);
    toggleAddNoteForm(); 
  } catch (err) {
    console.error('Failed to add note:', err);
  }
};

onMounted(() => {
  if (authStore.user && authStore.user.access_token) {
    notesStore.fetchNotes();
  } else {
    console.error('Cannot fetch notes. User not authenticated.');
  }
});

</script>

<template>
  <div class="relative">
    <NotesDisplay :notes="notes" @add-note="toggleAddNoteForm" />

    <AddNoteForm v-if="isAddNoteFormVisible" @submit="handleAddNote" @close="toggleAddNoteForm" />

    <div v-if="loading" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40">
      <div class="bg-white p-4 rounded shadow">
        <p class="text-center text-lg font-semibold">Loading...</p>
      </div>
    </div>

    <div v-if="error" class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow z-50">
      {{ error }}
    </div>
  </div>
</template>
