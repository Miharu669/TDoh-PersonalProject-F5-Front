<script setup>
import { ref, onMounted } from "vue";
import { useNotesStore } from "@/stores/noteStore";
import { storeToRefs } from "pinia";
import NotesDisplay from "@/components/Notes/NotesDisplay.vue";
import NoteForm from "@/components/Notes/NoteForm.vue";

const notesStore = useNotesStore();
const { notes, loading, error } = storeToRefs(notesStore);

const isAddNoteFormVisible = ref(false);
const isEditMode = ref(false);
const currentNote = ref({ id: null, title: "", content: "" });

function toggleAddNoteForm() {
  isAddNoteFormVisible.value = !isAddNoteFormVisible.value;
}

function editNote(note) {
  isEditMode.value = true;
  currentNote.value = { ...note };
  isAddNoteFormVisible.value = true;
}

async function addNote(newNote) {
  try {
    if (isEditMode.value) {
      await notesStore.updateNote(
        currentNote.value.id,
        newNote.title,
        newNote.content
      );
      console.log("Note updated successfully");
    } else {
      await notesStore.addNote(newNote.title, newNote.content);
      console.log("Note added successfully");
    }
    toggleAddNoteForm();
  } catch (err) {
    console.error("Failed to add or update note:", err);
  } finally {
    isEditMode.value = false;
  }
}

async function deleteNote(noteId) {
  try {
    await notesStore.deleteNote(noteId);
    console.log("Note deleted successfully");
  } catch (err) {
    console.error("Failed to delete note:", err);
  }
}

onMounted(() => {
  notesStore.fetchNotes();
});
</script>

<template>
  <div class="relative">
    <NotesDisplay
      :notes="notes"
      @add-note="toggleAddNoteForm"
      @edit-note="editNote"
      @delete-note="deleteNote"
    />

    <NoteForm
      v-if="isAddNoteFormVisible"
      :initial-title="currentNote.title"
      :initial-content="currentNote.content"
      @submit="addNote"
      @close="toggleAddNoteForm"
    />

    <div
      v-if="loading"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40"
    >
      <div class="bg-white p-4 rounded shadow">
        <p class="text-center text-lg font-semibold">Loading...</p>
      </div>
    </div>

    <div
      v-if="error"
      class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow z-50"
    >
      {{ error }}
    </div>
  </div>
</template>
