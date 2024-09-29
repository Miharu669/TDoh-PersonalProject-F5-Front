import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import router from "@/router";

export const logoutStore = defineStore('logout', () => {
    const store = useAuthStore();

    async function logout() {
        store.user.isAuthenticated = false;
        store.user.id = "";
        store.user.email = "";
        store.user.role = "";
        store.user.access_token = "";
        store.user.refresh_token = "";

        localStorage.clear();

        if (store.authMethod === "OAuth") {
            await googleLogout();
        }

        const redirectPath = '/home';
        router.push(redirectPath);
    }

    async function googleLogout() {
        try {
            if (window.gapi && window.gapi.auth2) {
                const authInstance = window.gapi.auth2.getAuthInstance();
                if (authInstance) {
                    await authInstance.signOut();
                    await authInstance.disconnect();
                    console.log("Google logout successful");
                }
            }
        } catch (error) {
            console.error("Google logout error:", error);
        }
    }

    return { logout };
});
