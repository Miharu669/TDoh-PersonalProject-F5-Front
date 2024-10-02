<script setup>
import { useNoteStore } from '@/stores/noteStore';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import NotesDisplay from './NotesDisplay.vue';
import AddNoteForm from './AddNoteForm.vue';

const noteStore = useNoteStore(); 
const { notes, loading, error,  addNote } = storeToRefs(noteStore); 

const isAddNoteFormVisible = ref(false);
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

const axiosInstance = axios.create({
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  },
});

const fetchNotes = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.get("/notes");
      notes.value = response.data; 
    } catch (err) {
      handleError(err, "Error fetching notes");
    } finally {
      loading.value = false;
    }
  };

const handleAddNote = async (newNote) => {
  const accessToken = localStorage.getItem('access_token');
  await addNote(newNote, accessToken);
  toggleAddNoteForm();
};

function toggleAddNoteForm() {
  isAddNoteFormVisible.value = !isAddNoteFormVisible.value;
}

onMounted(() => {
  fetchNotes(); 
});
</script>

<template>
  <div class="relative">
    <NotesDisplay :notes="notes" @add-note="toggleAddNoteForm" />

    <AddNoteForm v-if="isAddNoteFormVisible" @submit="handleAddNote" @close="toggleAddNoteForm" />

    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>
