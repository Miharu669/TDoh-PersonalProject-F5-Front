import { ref } from "vue";
import { defineStore } from "pinia";
import AuthService from "@/core/apis/spring/auth/AuthService";
import Credentials from "@/core/models/Credentials";

export const useAuthStore = defineStore("auth", () => {
  const user = ref({
    id: "",
    username: "",
    email: "",
    isAuthenticated: false,
  });

  function login(username, password) {

    const credentials = new Credentials(username, password)
    const service = new AuthService(credentials)
    return service.login()

}
  return {
    user,
    login
  };
});
