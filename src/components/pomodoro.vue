<!-- src/components/Timer.vue -->

<template>
  <section class="bg-transparent">
    <div class="flex flex-col items-center space-y-4 p-4">
      <!-- Timer Controls -->
      <div class="flex space-x-4">
        <!-- Start Button -->
        <svg
          @click="startTimer"
          :class="{
            'opacity-50 cursor-not-allowed': isRunning || isBreak,
            'cursor-pointer hover:opacity-80': !isRunning && !isBreak,
          }"
          width="40px"
          height="40px"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          title="Start Timer"
        >
          <circle cx="32" cy="32" r="30" fill="#4fd1d9"></circle>
          <path fill="#ffffff" d="M25 12l20 20l-20 20z"></path>
        </svg>

        <!-- Pause Button -->
        <svg
          @click="pauseTimer"
          :class="{
            'opacity-50 cursor-not-allowed': !isRunning,
            'cursor-pointer hover:opacity-80': isRunning,
          }"
          width="40px"
          height="40px"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          title="Pause Timer"
        >
          <circle cx="32" cy="32" r="30" fill="#4fd1d9"></circle>
          <g fill="#ffffff">
            <path d="M20 14h8v36h-8z"></path>
            <path d="M36 14h8v36h-8z"></path>
          </g>
        </svg>

        <!-- Reset Button -->
        <svg
          @click="resetTimer"
          :class="resetButtonClasses"
          width="40px"
          height="40px"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          title="Reset Timer"
        >
          <circle cx="32" cy="32" r="30" fill="#4fd1d9"></circle>
          <g fill="#ffffff">
            <path
              d="M27.3 20.1c1.5-.7 3.2-1 4.9-1c6.6 0 11.9 5.1 11.9 12H52c0-10.8-8.9-19.8-19.8-19.8c-3.8 0-7.6 1.1-10.8 3.2L18 11v13.1h13.5l-4.2-4"
            ></path>
            <path
              d="M36.5 42.6c-1.5.7-3.1 1-4.7 1c-6.6 0-12-5.3-12-12.6H12c0 11.4 8.9 20.8 19.8 20.8c3.7 0 7.2-1.1 10.3-3.1L46 53V38.2H32.6l3.9 4.4"
            ></path>
          </g>
        </svg>
      </div>

      <!-- Timer Display -->
      <div class="flex space-x-6">
        <div class="text-center">
          <div class="bg-terciary p-4 rounded-lg">
            <h3 class="text-black font-bold text-3xl font-poppins">
              {{ formatMinutes(time) }}
            </h3>
          </div>
          <p class="text-white font-dekko mt-1">Minutes</p>
        </div>

        <div class="text-center">
          <div class="bg-terciary p-4 rounded-lg">
            <h3 class="text-black font-bold text-3xl font-poppins">
              {{ formatSeconds(time) }}
            </h3>
          </div>
          <p class="text-white font-dekko mt-1">Seconds</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useTimerStore } from '@/stores/timer'; // Adjust the path if necessary

// Initialize the timer store
const timerStore = useTimerStore();

// Destructure state and actions from the store
const { 
  isBreak, 
  time, 
  isRunning, 
  formatMinutes, 
  formatSeconds, 
  startTimer, 
  pauseTimer, 
  resetTimer 
} = timerStore;

// Dynamic classes for the reset button
const resetButtonClasses = computed(() => ({
  'opacity-50 cursor-not-allowed': isRunning,
  'cursor-pointer hover:opacity-80': !isRunning,
}));
</script>

<style scoped>
/* Adjust SVG sizes for better visibility */
svg {
  width: 40px;
  height: 40px;
}

/* Style for the reset button */
.opacity-50 {
  opacity: 0.5;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:opacity-80:hover {
  opacity: 0.8;
}

.bg-terciary {
  background-color: #f6ad55; /* Example color for the timer display */
}
</style>
