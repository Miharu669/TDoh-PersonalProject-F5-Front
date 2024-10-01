import { ref } from "vue";
import { defineStore } from "pinia";
import AuthService from "../core/apis/spring/auth/AuthService";
import Credentials from "@/core/models/Credentials";
import RegisterService from "@/core/apis/spring/auth/RegisterService";
import ChangePasswordService from "@/core/apis/spring/auth/ChangePasswordService";
import CredentialsChangePassword from "@/core/models/CredentialsChangePassword";
// import GoogleAuthService from "@/core/apis/spring/auth/GoogleAuthService";

export const useAuthStore = defineStore('auth', () => {
    const user = ref({
        id: '',
        email: '',
        role: '',
        isAuthenticated: false,
        access_token: '',
        refresh_token: '',
    });

    function login(username, password) {
        const credentials = new Credentials(username, password);
        const service = new AuthService(credentials);
        return service.login().then(response => {
            if (response) {
                user.value.id = response.id;
                user.value.email = username;
                user.value.role = response.role;
                user.value.isAuthenticated = true;
                user.value.access_token = response.access_token;
                user.value.refresh_token = response.refresh_token;

                localStorage.setItem('id', response.id);
                localStorage.setItem('email', username);
                localStorage.setItem('role', response.role);
                localStorage.setItem('isAuthenticated', "true");
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
            }
            return response; 
        });
    }

    function register(email, password) {
        const credentialsRegister = { email, password };
        const service = new RegisterService(credentialsRegister);
        return service.register();
    }

    function setNewPassword(currentPassword, newPassword, confirmationPassword, accessToken) {
        const credentialsChangePassword = new CredentialsChangePassword(currentPassword, newPassword, confirmationPassword, accessToken);
        const service = new ChangePasswordService(credentialsChangePassword);
        return service.setNewPassword();
    }

    function loadUserFromLocalStorage() {
        const id = localStorage.getItem('id');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
        const isAuthenticated = localStorage.getItem('isAuthenticated') === "true";
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');

        if (id && email && isAuthenticated) {
            user.value.id = id;
            user.value.email = email;
            user.value.role = role;
            user.value.isAuthenticated = isAuthenticated;
            user.value.access_token = access_token;
            user.value.refresh_token = refresh_token;
        }
    }

    // async function googleLogin(code) {
    //     const googleAuthService = new GoogleAuthService();
    //     const response = await googleAuthService.login(code);
    //     return response;
    // }

    return { user, login, register, setNewPassword, loadUserFromLocalStorage };
});
