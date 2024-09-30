<script setup>
import { ref, onMounted } from 'vue';
import { useNoteStore } from '@/stores/noteStore'; 
import NotesDisplay from './NotesDisplay.vue';
import AddNoteForm from './AddNoteForm.vue';

const noteStore = useNoteStore();

const isAddNoteFormVisible = ref(false);

onMounted(() => {
  noteStore.fetchNotes(); 
});

function toggleAddNoteForm() {
  isAddNoteFormVisible.value = !isAddNoteFormVisible.value;
}

function addNote(newNote) {
  noteStore.addNote(newNote); 
  toggleAddNoteForm(); 
}
</script>

<template>
  <div class="relative">
    <NotesDisplay :notes="noteStore.notes" @add-note="toggleAddNoteForm" />

    <AddNoteForm v-if="isAddNoteFormVisible" @submit="addNote" @close="toggleAddNoteForm" />

    <div v-if="noteStore.loading">Loading...</div>
    <div v-if="noteStore.error">{{ noteStore.error }}</div>
  </div>
</template>
