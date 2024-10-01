
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useEventStore = defineStore('eventStore', () => {
    const events = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_ENDPOINT,
        headers: {
          'Content-Type': 'application/json',
        }
      });

    const fetchEvents = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get('/events'); 
            events.value = response.data;
        } catch (err) {
            error.value = err.message || 'Failed to fetch events';
        } finally {
            loading.value = false;
        }
    };

    const addEvent = async (eventData) => {
        try {
            const response = await axiosInstance.post('/events', eventData);
            events.value.push(response.data);
        } catch (err) {
            error.value = err.message || 'Failed to add event';
        }
    };

    return {
        events,
        loading,
        error,
        fetchEvents,
        addEvent,
    };
});
