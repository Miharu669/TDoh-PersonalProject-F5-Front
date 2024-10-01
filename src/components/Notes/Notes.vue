<script setup>
import { useAuthStore } from '@/stores/auth';
import { useNoteStore } from '@/stores/noteStore';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'; 
import NotesDisplay from './NotesDisplay.vue';
import AddNoteForm from './AddNoteForm.vue';

const noteStore = useNoteStore(); 
const { notes, loading, error, fetchNotes, createNote } = storeToRefs(noteStore); 

const isAddNoteFormVisible = ref(false);


const fetchUserNotes = async () => {
  loading.value = true; 
  error.value = null; 
  try {
    await noteStore.getNotes(); 
  } catch (err) {
    error.value = err.message; 
    console.error('Failed to fetch notes:', error.value);
  } finally {
    loading.value = false; 
  }
};

const addNote = async (newNote) => {
  loading.value = true; 
  error.value = null; 
  try {
    await noteStore.createNote(newNote); 
    toggleAddNoteForm(); 
  } catch (err) {
    error.value = err.message; 
    console.error('Failed to add note:', error.value);
  } finally {
    loading.value = false; 
  }
};

function toggleAddNoteForm() {
  isAddNoteFormVisible.value = !isAddNoteFormVisible.value;
}

onMounted(() => {
  fetchUserNotes(); 
});
</script>


<template>
  <div class="relative">
    <NotesDisplay 
      :notes="notes"  
      @add-note="toggleAddNoteForm" 
    />

    <AddNoteForm 
      v-if="isAddNoteFormVisible" 
      @submit="addNote" 
      @close="toggleAddNoteForm" 
    />

    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

