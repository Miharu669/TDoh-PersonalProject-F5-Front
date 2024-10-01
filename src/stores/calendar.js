import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "./auth";
export const useEventStore = defineStore("eventStore", () => {
  const events = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

  const axiosInstance = axios.create({
    baseURL: apiEndpoint,
    headers: {
      "Content-Type": "application/json",
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

  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.get("/events");
      events.value = response.data;
    } catch (err) {
      error.value = err?.response?.data?.message || "Failed to fetch events";
    } finally {
      loading.value = false;
    }
  };

  const addEvent = async (eventData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.post("/events", eventData);
      events.value.push(response.data);
    } catch (err) {
      error.value = err?.response?.data?.message || "Failed to add event";
    } finally {
      loading.value = false;
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
