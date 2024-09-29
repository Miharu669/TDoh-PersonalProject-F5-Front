<script setup>
import { ref } from 'vue';
import NotesDisplay from './NotesDisplay.vue';
import AddNoteForm from './AddNoteForm.vue';

const notes = ref([
  { id: 1, title: 'First Note', content: 'This is the first note' },
]);

const isAddNoteFormVisible = ref(false);

function toggleAddNoteForm() {
  isAddNoteFormVisible.value = !isAddNoteFormVisible.value;
}

function addNote(newNote) {
  notes.value.push({
    id: notes.value.length + 1,
    title: newNote.title,
    content: newNote.content,
  });
  toggleAddNoteForm();
}
</script>

<template>
  <div class="relative">
    <NotesDisplay :notes="notes" @add-note="toggleAddNoteForm" />
    <AddNoteForm v-if="isAddNoteFormVisible" @submit="addNote" @close="toggleAddNoteForm" />
  </div>
</template>
