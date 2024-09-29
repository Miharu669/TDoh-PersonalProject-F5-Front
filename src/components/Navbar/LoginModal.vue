<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useRoute, useRouter } from 'vue-router';

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const passwordAgain = ref('');
const textAlert = ref('');
const isLoading = ref(false);

const store = useAuthStore();
const route = useRoute();
const router = useRouter();

// Define emit for close-modal event
const emit = defineEmits(['close-modal']);

// Email validation function
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function handleLogin() {
  if (email.value != '' && password.value != '') {
    if (!isValidEmail(email.value)) {
      textAlert.value = "Invalid email format!";
      return;
    }

    try {
      const response = await store.login(email.value, password.value);

      if (response.id) {
        store.user.id = response.id;
        store.user.email = email.value;
        store.user.role = response.role;
        store.user.isAuthenticated = true;
        store.user.access_token = response.access_token;
        store.user.refresh_token = response.refresh_token;

        localStorage.setItem('id', response.id);
        localStorage.setItem('email', email.value);
        localStorage.setItem('role', response.role);
        localStorage.setItem('isAuthenticated', "true");
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);

        email.value = '';
        password.value = '';
        textAlert.value = '';

        emit('close-modal');  // Use emit instead of $emit

        if (response.role == "USER") {
          router.push('/');
        }
      } else {
        textAlert.value = "Incorrect email or password!";
      }
    } catch (error) {
      textAlert.value = "Error trying to login, please try again.";
    }
  } else {
    textAlert.value = "Email or Password cannot be empty!";
  }
}

async function handleRegister() {
  if (email.value !== '' && password.value !== '') {
    if (!isValidEmail(email.value)) {
      textAlert.value = "Invalid email format!";
      return;
    }

    if (password.value === passwordAgain.value) {
      try {
        const response = await store.register(email.value, password.value);

        if (response.id) {
          store.user.id = response.id;
          store.user.email = email.value;
          store.user.role = response.role;
          store.user.isAuthenticated = true;
          store.user.access_token = response.access_token;
          store.user.refresh_token = response.refresh_token;

          localStorage.setItem('id', response.id);
          localStorage.setItem('email', email.value);
          localStorage.setItem('role', response.role);
          localStorage.setItem('isAuthenticated', "true");
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);

          textAlert.value = '';
          password.value = '';
          passwordAgain.value = '';
          email.value = '';

          emit('close-modal');
        } else {
          textAlert.value = 'The email already exists!';
        }
      } catch (error) {
        textAlert.value = 'Error trying to register, please try again.';
      }
    } else {
      textAlert.value = 'Passwords do not match!';
    }
  } else {
    textAlert.value = 'Email, or password cannot be null!';
  }
}


function toggleView() {
  isLogin.value = !isLogin.value;
}

function signInWithGoogle() {
  const baseURL = import.meta.env.VITE_API_ENDPOINT.replace('/api/v1', '');
  window.location.href = `${baseURL}/oauth2/authorization/google`;
}

onMounted(async () => {
  if (route.query.code) {
    isLoading.value = true;
    try {
      const response = await store.googleLogin(route.query.code);
      if (response.message === "Logged") {
        router.push("/tasks");
        emit('close-modal');
      } else {
        textAlert.value = response.data || "Google login failed.";
        console.error("Google login failed:", response.data);
      }
    } catch (error) {
      console.error("Google login error:", error);
      textAlert.value = "Error during Google login, please try again.";
    } finally {
      isLoading.value = false;
    }
  }
});
</script>


<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div class="relative py-3 sm:max-w-xl sm:mx-auto">
        <div
          class="absolute inset-0 bg-gradient-to-br from-quinary to-quaternary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
        </div>
        <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div class="max-w-md mx-auto">
            <button @click="$emit('close-modal')" class="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              &times;
            </button>

            <h1 class="text-2xl font-semibold text-cyan-600 text-center mb-6">
              {{ isLogin ? 'Login' : 'Register' }}
            </h1>

            <form @submit.prevent="isLogin ? handleLogin() : handleRegister()" class="mt-4">
              <div class="relative">
                <input v-model="email" type="text"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  placeholder="Email" />
                <label for="email"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-sm">E-mail</label>
              </div>

              <div class="relative mt-6">
                <input v-model="password" type="password"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  placeholder="Password" />
                <label for="password"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-sm">Password</label>
              </div>

              <div v-if="!isLogin" class="relative mt-6">
                <input v-model="passwordAgain" type="password"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  placeholder="Confirm Password" />
                <label for="passwordAgain"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-sm">Confirm
                  Password</label>
              </div>

              <div class="relative mt-4">
                <button type="submit"
                  class="bg-cyan-500 w-full text-white rounded-md px-4 py-2 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50">
                  {{ isLogin ? 'Login' : 'Register' }}
                </button>
              </div>

              <div v-if="textAlert" class="text-red-500 mt-4 text-center">{{ textAlert }}</div>
            </form>

            <div class="w-full flex justify-center mt-6">
              <button @click="signInWithGoogle"
                class="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="48px" height="48px" viewBox="0 0 48 48">
                  <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Color-" transform="translate(-401.000000, -860.000000)">
                      <g id="Google" transform="translate(401.000000, 860.000000)">
                        <path
                          d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                          fill="#FBBC05"></path>
                        <path
                          d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                          fill="#EB4335"></path>
                        <path
                          d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                          fill="#34A853"></path>
                        <path
                          d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                          fill="#4285F4"></path>
                      </g>
                    </g>
                  </g>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div class="text-center mt-6">
              <p @click="toggleView" class="text-cyan-600 cursor-pointer hover:underline">
                {{ isLogin ? "Don't have an account? Register" : 'Already have an account? Login' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
