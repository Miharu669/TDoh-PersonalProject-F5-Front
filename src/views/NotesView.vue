<script setup>
import { ref } from 'vue';
import NotesDisplay from '@/components/Notes/NotesDisplay.vue';
import NoteForm from '@/components/Notes/NoteForm.vue';

// Sample data for the notes
const notes = ref([
  { id: 1, title: 'First Note', content: 'This is the first note' },
 
]);

// State to control the visibility of the Add Note form
const isAddNoteFormVisible = ref(false);

// Toggle visibility of the Add Note form
function toggleAddNoteForm() {
  isAddNoteFormVisible.value = !isAddNoteFormVisible.value;
}

// Function to add a new note
function addNote(newNote) {
  notes.value.push({
    id: notes.value.length + 1, // Increment the ID for each new note
    title: newNote.title,
    content: newNote.content,
  });
  toggleAddNoteForm(); // Close the form after adding the note
}
</script>

<template>
  <div class="relative">
    <!-- Notes Display Component (shows existing notes) -->
    <NotesDisplay :notes="notes" @add-note="toggleAddNoteForm" />

    <!-- Add Note Form (only visible when isAddNoteFormVisible is true) -->
    <NoteForm v-if="isAddNoteFormVisible" @submit="addNote" @close="toggleAddNoteForm" />
  </div>
</template>
