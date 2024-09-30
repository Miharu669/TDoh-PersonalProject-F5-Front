import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import router from "@/router";

export const logoutStore = defineStore('logout', () => {

    const store = useAuthStore()
    function logout() {

        store.user.isAuthenticated = false
        store.user.id = ""
        store.user.email = ""
        store.user.role = ""
        store.user.access_token = ""
        store.user.refresh_token = ""

        localStorage.clear()

        const redirectPath = '/home'
        router.push(redirectPath)
    }

    return { logout };
});
