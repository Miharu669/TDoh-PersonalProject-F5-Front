import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from './auth';  

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT + '/notes';
console.log('API Endpoint:', apiEndpoint);

const axiosInstance = axios.create({
  baseURL: apiEndpoint,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthHeader = () => {
  const authStore = useAuthStore();  
  const token = authStore.user?.access_token;  
  if (token) {
    return { 'Authorization': 'Bearer ' + token };  
  } else {
    console.log('No authorization token found in authStore.');
    return {};
  }
};

const handleError = (err) => {
  if (err.response) {
    error.value = err.response.data.message || 'An error occurred.';
    console.error('Error response from server:', err.response);
  } else if (err.request) {
    error.value = 'No response from server. Please try again later.';
    console.error('No response received:', err.request);
  } else {
    error.value = err.message || 'An unexpected error occurred.';
    console.error('Error setting up request:', err.message);
  }
};

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchNotes = async () => {
    console.log('fetchNotes called');
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();  
      const response = await axiosInstance.get('', { headers });  
      console.log('Fetched notes:', response.data);
      notes.value = response.data;
    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
      console.log('fetchNotes completed. Loading:', loading.value);
    }
  };

  const addNote = async (title, content) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.post('/', { title, content });
      notes.value.push(response.data);  
    } catch (err) {
      error.value = 'Failed to add note.';
      console.error('Error adding note:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateNote = async (id, title, content) => {
    console.log(`updateNote called for ID ${id} with title:`, title, 'content:', content);
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();  
      const response = await axiosInstance.put(`/${id}`, { title, content }, { headers });
      console.log('Note updated successfully:', response.data);
      const index = notes.value.findIndex(note => note.id === id);
      if (index !== -1) {
        notes.value[index] = response.data;
      }
    } catch (err) {
      handleError(err);
      console.error('Error updating note:', err);
    } finally {
      loading.value = false;
      console.log('updateNote completed. Loading:', loading.value);
    }
  };

  const deleteNote = async (id) => {
    console.log(`deleteNote called for ID ${id}`);
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader(); 
      await axiosInstance.delete(`/${id}`, { headers });
      console.log(`Note with ID ${id} deleted successfully.`);
      notes.value = notes.value.filter(note => note.id !== id);
    } catch (err) {
      handleError(err);
      console.error('Error deleting note:', err);
    } finally {
      loading.value = false;
      console.log('deleteNote completed. Loading:', loading.value);
    }
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
  };
});
