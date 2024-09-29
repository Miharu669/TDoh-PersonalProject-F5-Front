import { defineStore } from 'pinia';
import axios from 'axios';

export const useNoteStore = defineStore('noteStore', {
  state: () => ({
    notes: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchNotes() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/api/v1/notes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        this.notes = response.data;
      } catch (error) {
        this.error = 'Failed to load notes.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async addNote(newNote) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/api/v1/notes', newNote, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        this.notes.push(response.data);
      } catch (error) {
        this.error = 'Failed to add note.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async deleteNote(noteId) {
      this.loading = true;
      this.error = null;

      try {
        await axios.delete(`/api/v1/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        this.notes = this.notes.filter((note) => note.id !== noteId);
      } catch (error) {
        this.error = 'Failed to delete note.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
