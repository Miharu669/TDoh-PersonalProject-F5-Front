<script setup>
import { ref, onMounted } from 'vue';
import { useNoteStore } from '@/stores/noteStore'; // Import the note store
import NotesDisplay from './NotesDisplay.vue';
import AddNoteForm from './AddNoteForm.vue';

// Use Pinia store for notes
const noteStore = useNoteStore();

// State to control the visibility of the Add Note form
const isAddNoteFormVisible = ref(false);

// Fetch notes when component is mounted
onMounted(() => {
  noteStore.fetchNotes(); // Fetch notes from the backend
});

// Toggle the Add Note form visibility
function toggleAddNoteForm() {
  isAddNoteFormVisible.value = !isAddNoteFormVisible.value;
}

// Function to handle adding a new note
function addNote(newNote) {
  noteStore.addNote(newNote); // Use the store to add a new note
  toggleAddNoteForm(); // Close the form after adding the note
}
</script>

<template>
  <div class="relative">
    <!-- Notes Display (showing notes from the Pinia store) -->
    <NotesDisplay :notes="noteStore.notes" @add-note="toggleAddNoteForm" />

    <!-- Add Note Form (visible when the form is toggled) -->
    <AddNoteForm v-if="isAddNoteFormVisible" @submit="addNote" @close="toggleAddNoteForm" />

    <!-- Loading and Error states -->
    <div v-if="noteStore.loading">Loading...</div>
    <div v-if="noteStore.error">{{ noteStore.error }}</div>
  </div>
</template>
