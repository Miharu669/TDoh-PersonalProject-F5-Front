<script setup>
import { ref, computed } from 'vue';
import LoginButton from './LoginButton.vue';
import LoginModal from './LoginModal.vue';
import { useAuthStore } from '@/stores/auth.js'; 
import { logoutStore } from '@/stores/logout.js'; 

const isOpen = ref(false);
const showLoginModal = ref(false);

const store = useAuthStore();
const logout = logoutStore();

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const toggleLoginModal = () => {
  showLoginModal.value = !showLoginModal.value;
};


const isAuthenticated = computed(() => store.user.isAuthenticated);
</script>

<template>
  <nav class="bg-black p-4">
    <div class="container mx-auto flex items-center justify-between">
      <div class="text-white text-xl font-bold flex items-center space-x-2">
  <a href="/" class="flex items-center text-quinary text-2xl">
    <img src="@/assets/icons/tdoh.png" class="h-8 w-8 mr-2">
    <span class="ml-2">TDoH</span>
  </a>
</div>

      <div class="hidden md:flex space-x-4 items-center">
        <a href="/tasks" class="text-gray-300 hover:text-white">Tasks</a>
        <a href="/notes" class="text-gray-300 hover:text-white">Notes</a>
        <a href="/calendar" class="text-gray-300 hover:text-white">Calendar</a>

        

        <div v-if="!isAuthenticated">
          <LoginButton @open-modal="toggleLoginModal" />
        </div>

        <button
          v-if="isAuthenticated"
          @click="logout.logout"
          class="text-white bg-gradient-to-b from-quaternary to-quinary hover:from-quinary hover:to-quaternary px-4 py-2 rounded-full"
        >
          Logout
        </button>
      </div>

      <button @click="toggleMenu" class="md:hidden text-white focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <div v-if="isOpen" class="md:hidden mt-4 space-y-2">
      <a href="/tasks" class="text-gray-300 hover:text-white">Tasks</a>
        <a href="/notes" class="text-gray-300 hover:text-white">Notes</a>
        <a href="/calendar" class="text-gray-300 hover:text-white">Calendar</a>


      <div v-if="!isAuthenticated">
        <LoginButton @open-modal="toggleLoginModal" />
      </div>

      <button
        v-if="isAuthenticated"
        @click="logout.logout"
        class="text-white bg-gradient-to-b from-quaternary to-quinary hover:from-quinary hover:to-quaternary px-4 py-2 rounded-full"
      >
        Logout
      </button>
    </div>

    <LoginModal v-if="showLoginModal" @close-modal="toggleLoginModal" />

  
    
  </nav>
</template>
