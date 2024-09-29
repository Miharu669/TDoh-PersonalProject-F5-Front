<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRoute, useRouter } from "vue-router";
import { googleSdkLoaded } from "vue3-google-login";
import GoogleLogin from "./GoogleLogin.vue";

const isLogin = ref(true);
const email = ref("");
const password = ref("");
const passwordAgain = ref("");
const textAlert = ref("");
const isLoading = ref(false);

const store = useAuthStore();
const route = useRoute();
const router = useRouter();

const emit = defineEmits(["close-modal"]);

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function handleLogin() {
  if (email.value != "" && password.value != "") {
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

        localStorage.setItem("id", response.id);
        localStorage.setItem("email", email.value);
        localStorage.setItem("role", response.role);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);

        email.value = "";
        password.value = "";
        textAlert.value = "";

        emit("close-modal");

        if (response.role == "USER") {
          router.push("/");
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
  if (email.value !== "" && password.value !== "") {
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

          localStorage.setItem("id", response.id);
          localStorage.setItem("email", email.value);
          localStorage.setItem("role", response.role);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("access_token", response.access_token);
          localStorage.setItem("refresh_token", response.refresh_token);

          textAlert.value = "";
          password.value = "";
          passwordAgain.value = "";
          email.value = "";

          emit("close-modal");
        } else {
          textAlert.value = "The email already exists!";
        }
      } catch (error) {
        textAlert.value = "Error trying to register, please try again.";
      }
    } else {
      textAlert.value = "Passwords do not match!";
    }
  } else {
    textAlert.value = "Email, or password cannot be null!";
  }
}

function toggleView() {
  isLogin.value = !isLogin.value;
}

onMounted(async () => {
  if (route.query.code) {
    isLoading.value = true;
    try {
      const response = await store.googleLogin(route.query.code);
      if (response.message === "Logged") {
        router.push("/tasks");
        emit("close-modal");
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
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
  >
    <div class="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div class="relative py-3 sm:max-w-xl sm:mx-auto">
        <div
          class="absolute inset-0 bg-gradient-to-br from-quinary to-quaternary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
        ></div>
        <div
          class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20"
        >
          <div class="max-w-md mx-auto">
            <button
              @click="$emit('close-modal')"
              class="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>

            <h1 class="text-2xl font-semibold text-cyan-600 text-center mb-6">
              {{ isLogin ? "Login" : "Register" }}
            </h1>

            <form
              @submit.prevent="isLogin ? handleLogin() : handleRegister()"
              class="mt-4"
            >
              <div class="relative">
                <input
                  v-model="email"
                  type="text"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  placeholder="Email"
                />
                <label
                  for="email"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-sm"
                  >E-mail</label
                >
              </div>

              <div class="relative mt-6">
                <input
                  v-model="password"
                  type="password"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  placeholder="Password"
                />
                <label
                  for="password"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-sm"
                  >Password</label
                >
              </div>

              <div v-if="!isLogin" class="relative mt-6">
                <input
                  v-model="passwordAgain"
                  type="password"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  placeholder="Confirm Password"
                />
                <label
                  for="passwordAgain"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-sm"
                  >Confirm Password</label
                >
              </div>

              <div class="relative mt-4">
                <button
                  type="submit"
                  class="bg-cyan-500 w-full text-white rounded-md px-4 py-2 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
                >
                  {{ isLogin ? "Login" : "Register" }}
                </button>
              </div>

              <div v-if="textAlert" class="text-red-500 mt-4 text-center">
                {{ textAlert }}
              </div>
            </form>

            <div class="w-full flex justify-center mt-6">
              <GoogleLogin />
            </div>

            <div class="text-center mt-6">
              <p
                @click="toggleView"
                class="text-cyan-600 cursor-pointer hover:underline"
              >
                {{
                  isLogin
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
