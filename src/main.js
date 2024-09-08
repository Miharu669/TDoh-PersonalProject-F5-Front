import './assets/main.css'
import 'tailwindcss/tailwind.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { GoogleLogin } from 'vue3-google-login';
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(GoogleLogin, {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ,
    prompt: 'consent',
  });

app.use(createPinia())
app.use(router)

app.mount('#app')
