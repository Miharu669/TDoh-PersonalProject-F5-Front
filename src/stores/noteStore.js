import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "./auth";

export const useNoteStore = defineStore("noteStore", () => {
  const notes = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

  const axiosInstance = axios.create({
    baseURL: apiEndpoint,
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      const accessToken = authStore.user.access_token;
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleError = (err, defaultMsg) => {
    error.value = err?.response?.data?.message || defaultMsg;
    console.error(error.value);
  };

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

  const createNote = async (newNote) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.post("/notes", newNote);
      notes.value.push(response.data); 
    } catch (err) {
      handleError(err, "Error creating note");
    } finally {
      loading.value = false;
    }
  };

  const updateNote = async (noteId, updatedNote) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.put(`/notes/${noteId}`, updatedNote);
      const index = notes.value.findIndex((note) => note.id === noteId);
      if (index !== -1) {
        notes.value[index] = response.data; 
      }
    } catch (err) {
      handleError(err, "Error updating note");
    } finally {
      loading.value = false;
    }
  };

  const deleteNote = async (noteId) => {
    loading.value = true;
    error.value = null;
    try {
      await axiosInstance.delete(`/notes/${noteId}`);
      notes.value = notes.value.filter((note) => note.id !== noteId); 
    } catch (err) {
      handleError(err, "Error deleting note");
    } finally {
      loading.value = false;
    }
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
});
