<template>
  <div class="min-h-screen bg-gradient-to-r from-cyan-600 to-white py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="absolute inset-0 bg-gradient-to-br from-quinary to-quaternary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20  ">
        <div class="max-w-md mx-auto">
          <h1 class="text-2xl font-semibold text-cyan-600 text-center">Login</h1>
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <form class="mt-4" @submit.prevent="login">
                <div class="relative">
                  <input
                    v-model="username"
                    autocomplete="off"
                    type="text"
                    class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Username"
                  />
                  <label
                    for="username"
                    class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >Username</label
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
                    class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >Password</label
                  >
                </div>
                <div class="relative mt-4">
                  <button
                    type="submit"
                    class="bg-cyan-500 w-full text-white rounded-md px-4 py-2 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
                  >
                    Submit
                  </button>
                </div>
                <div v-if="textAlert" class="text-red-500 mt-4 text-center">
                  {{ textAlert }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  <script setup>
  import { ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/auth.js";
  
  const username = ref("");
  const password = ref("");
  const textAlert = ref("");
  
  const route = useRoute();
  const router = useRouter();
  
  const store = useAuthStore();
  
  async function login() {
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();
  
    if (usernameValue && passwordValue) {
      try {
        const response = await store.login(usernameValue, passwordValue);
  
        if (response.message === "Logged") {
          Object.assign(store.user, {
            id: response.id,
            isAuthenticated: true,
            username: response.username,
          });
  
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: response.id,
              username: response.username,
              isAuthenticated: true,
            })
          );
  
          localStorage.setItem(
            "token",
            btoa(`${usernameValue}:${passwordValue}`)
          );
  
          router.push(route.query.redirect || "/funsiona");
        } else {
          textAlert.value = "Incorrect username or password!";
        }
      } catch (error) {
        textAlert.value = "Error trying to login, please try again.";
      }
    } else {
      textAlert.value = "Username or Password cannot be empty!";
    }
  }
  </script>