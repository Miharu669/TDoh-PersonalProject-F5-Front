import { ref } from "vue";
import { defineStore } from "pinia";
import AuthService from "@/core/apis/spring/auth/AuthService";

export const useAuthStore = defineStore("auth", () => {
  const user = ref({
    id: "",
    username: "",
    email: "",
    isAuthenticated: false,
  });

  const token = ref(localStorage.getItem("auth_token") || "");
  const authMethod = ref(localStorage.getItem("auth_method") || "");

  const service = new AuthService();

  async function login(username, password) {
    try {
      const response = await service.login(username, password);

      if (response.username) {
        user.value = {
          id: response.id,
          username: response.username,
          email: response.email,
          isAuthenticated: true,
        };
        token.value = btoa(`${username}:${password}`);
        authMethod.value = "Basic";
        localStorage.setItem("auth_token", token.value);
        localStorage.setItem("auth_method", authMethod.value);
        return { message: "Logged", data: response };
      } else {
        return { message: "Error", data: response.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { message: "Error", data: "Login failed" };
    }
  }

  function logout() {
    user.value = {
      id: "",
      username: "",
      email: "",
      isAuthenticated: false,
    };
    token.value = "";
    authMethod.value = "";
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_method");
  }

  async function checkAuth() {
    if (authMethod.value === "Basic" && token.value) {
      try {
        const [username, password] = atob(token.value).split(":");
        const response = await service.login(username, password);
        if (response.username) {
          user.value = {
            id: response.id,
            username: response.username,
            email: response.email,
            isAuthenticated: true,
          };
          return true;
        } else {
          logout();
          return false;
        }
      } catch (error) {
        console.error("Auth check error:", error);
        logout();
        return false;
      }
    } else {
      return user.value.isAuthenticated;
    }
  }

  return {
    user,
    token,
    authMethod,
    login,
    logout,
    checkAuth,
  };
});
