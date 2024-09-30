import './assets/main.css'; 
import 'tailwindcss/tailwind.css'; 

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
// import vue3GoogleLogin from 'vue3-google-login';

import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);


// app.use(vue3GoogleLogin, {
//   clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
// });

app.use(createPinia());
app.use(router);

app.mount('#app');

