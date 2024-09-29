import { ref } from "vue";
import { defineStore } from "pinia";
import AuthService from "../core/apis/spring/auth/AuthService";
import Credentials from "@/core/models/Credentials";
import RegisterService from "@/core/apis/spring/auth/RegisterService";
import ChangePasswordService from "@/core/apis/spring/auth/ChangePasswordService";
import CredentialsChangePassword from "@/core/models/CredentialsChangePassword";
import GoogleAuthService from "@/core/apis/spring/auth/GoogleAuthService";

export const useAuthStore = defineStore('auth', () => {

    const user = ref(
        {
            id: '',
            email: '',
            role: '',
            isAuthenticated: false,
            access_token: '',
            refresh_token: '',
        }
    )

    function login(email, password) {

        const credentials = new Credentials(email, password)
        const service = new AuthService(credentials)
        return service.login()

    }


    function register(email, password) {

        const credentialsRegister = { email, password };
        const service = new RegisterService(credentialsRegister);
        return service.register();

    }

    function setNewPassword(currentPassword, newPassword, confirmationPassword, accessToken) {
        const credentialsChangePassword = new CredentialsChangePassword(currentPassword,  newPassword, confirmationPassword, accessToken)
        const service = new ChangePasswordService(credentialsChangePassword)
        return service.setNewPassword();

    }
    async function googleLogin(code) {
        const googleAuthService = new GoogleAuthService();
      const response = await googleAuthService.login(code); 
      return response; 
    }

    return { user, login, register, setNewPassword, googleLogin };
});