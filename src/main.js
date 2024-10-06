import "./assets/main.css";
import "tailwindcss/tailwind.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { useAuthStore } from "./stores/auth";
import App from "./App.vue";
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "vue-toastification/dist/index.css";
// import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App);

// app.use(vue3GoogleLogin, {
//   clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
// });

const pinia = createPinia();
app.use(pinia);

const authStore = useAuthStore();
authStore.loadUserFromLocalStorage();

app.use(router);


app.mount("#app");
