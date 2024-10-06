import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from './auth';  

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT + '/notes';

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
    return {};
  }
};

const handleError = (err, errorRef) => {
  if (err.response) {
    errorRef.value = err.response.data.message || 'An error occurred.';
    console.error('Error response from server:', err.response);
  } else if (err.request) {
    errorRef.value = 'No response from server. Please try again later.';
    console.error('No response received:', err.request);
  } else {
    errorRef.value = err.message || 'An unexpected error occurred.';
    console.error('Error setting up request:', err.message);
  }
};

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([]);  
  const loading = ref(false);  
  const error = ref(null);  
  
  const fetchNotes = async () => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();  
      const response = await axiosInstance.get('', { headers }); 
      notes.value = response.data;
    } catch (err) {
      handleError(err, error); 
    } finally {
      loading.value = false;
    }
  };

  const addNote = async (title, content) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();  
      const response = await axiosInstance.post('', { title, content }, { headers });  
      notes.value.push(response.data);  
    } catch (err) {
      handleError(err, error);  
      throw err;  
    } finally {
      loading.value = false;
    }
  };


  const updateNote = async (id, title, content) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader();  
      const response = await axiosInstance.put(`/${id}`, { title, content }, { headers });
      const index = notes.value.findIndex(note => note.id === id);
      if (index !== -1) {
        notes.value[index] = response.data;  
      }
    } catch (err) {
      handleError(err, error);  
    } finally {
      loading.value = false;
    }
  };

  const deleteNote = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const headers = setAuthHeader(); 
      await axiosInstance.delete(`/${id}`, { headers }); 
      notes.value = notes.value.filter(note => note.id !== id); 
    } catch (err) {
      handleError(err, error);  
    } finally {
      loading.value = false;
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
