import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios"; // Import axios
import AuthRepository from "./../core/AuthRepository"; // Corrected import

const authRepository = new AuthRepository(); // Instantiate AuthRepository

export const useAuthStore = defineStore("auth", () => {
  const user = ref({
    id: "",
    username: "",
    email: "",
    isAuthenticated: false,
  });

  const baseURL = "http://localhost:8080/api/v1";

  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  async function login(username, password) {
    try {
      const data = await authRepository.login({ username, password }); // Pass credentials as an object
      updateUserState(data);
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async function register(username, email, password) {
    try {
      const data = await authRepository.register({ username, email, password }); // Pass credentials as an object
      updateUserState(data);
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  function initiateGoogleLogin() {
    window.location.href = `${import.meta.env.GOOGLE_ENDPOINT}`;
  }

  async function handleGoogleCallback(code) {
    try {
      const data = await authRepository.googleLogin(code);
      updateUserState(data);
      return data;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  }

  async function logout() {
    user.value = {
      id: "",
      username: "",
      email: "",
      isAuthenticated: false,
    };
    await api.post("/logout");
  }

  function updateUserState(userData) {
    user.value = {
      ...userData,
      isAuthenticated: true,
    };
  }

  return {
    user,
    login,
    register,
    initiateGoogleLogin,
    handleGoogleCallback,
    logout,
  };
});
