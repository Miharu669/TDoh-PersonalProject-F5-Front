<script setup>
import { ref, onMounted } from 'vue';
import { useNotesStore } from '@/stores/noteStore';  
import { storeToRefs } from 'pinia';
import NotesDisplay from '@/components/Notes/NotesDisplay.vue';
import NoteForm from '@/components/Notes/NoteForm.vue';

const notesStore = useNotesStore();
const { notes, loading, error } = storeToRefs(notesStore);  

const isAddNoteFormVisible = ref(false);

function toggleAddNoteForm() {
  isAddNoteFormVisible.value = !isAddNoteFormVisible.value;
}

async function addNote(newNote) {
  try {
    await notesStore.addNote(newNote.title, newNote.content); 
    console.log('Note added successfully');
    toggleAddNoteForm(); 
  } catch (err) {
    console.error('Failed to add note:', err);
  }
}

onMounted(() => {
  console.log('Fetching notes...');
  notesStore.fetchNotes();  
});
</script>

<template>
  <div class="relative">
    <NotesDisplay :notes="notes" @add-note="toggleAddNoteForm" />

    <NoteForm v-if="isAddNoteFormVisible" @submit="addNote" @close="toggleAddNoteForm" />

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
