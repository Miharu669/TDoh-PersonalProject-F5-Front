<script setup>
import { computed, watch, onMounted } from 'vue';
import { useTimerStore } from '@/stores/timer';
import { notify } from '@kyvg/vue3-notification';
import { storeToRefs } from 'pinia';

const timerStore = useTimerStore();

const { isBreak, time, isRunning } = storeToRefs(timerStore);
const { startTimer, pauseTimer, resetTimer, requestNotificationPermission } = timerStore;

const formatMinutes = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  return String(minutes).padStart(2, '0');
};

const formatSeconds = (seconds) => {
  const secs = seconds % 60;
  return String(secs).padStart(2, '0');
};

const formattedMinutesComputed = computed(() => formatMinutes(time.value));
const formattedSecondsComputed = computed(() => formatSeconds(time.value));

onMounted(() => {
  requestNotificationPermission();
});

const handleStart = () => {
  console.log("Start button clicked.");
  startTimer(); 
  notify({
    type: 'success',
    title: 'Timer Started',
    text: isBreak.value ? 'Break time!' : 'Work time!',
  });
};

const handlePause = () => {
  console.log("Pause button clicked.");
  pauseTimer(); 
  notify({
    type: 'info',
    title: 'Timer Paused',
    text: 'You have paused the timer.',
  });
};

const handleReset = () => {
  console.log("Reset button clicked.");
  resetTimer(); 
  notify({
    type: 'warning',
    title: 'Timer Reset',
    text: 'The timer has been reset.',
  });
};

watch(
  () => [time.value, isBreak.value],
  ([newTime, newIsBreak], [oldTime, oldIsBreak]) => {
    if (oldTime > 0 && newTime === 0) {
      if (newIsBreak) {
        notify({
          type: 'info',
          title: 'Break Over',
          text: 'Break time is over! Back to work.',
        });
      } else {
        notify({
          type: 'success',
          title: 'Work Session Complete',
          text: 'Work session completed! Time for a break.',
        });
      }
    }
  }
);

const formattedMinutes = formattedMinutesComputed;
const formattedSeconds = formattedSecondsComputed;
</script>

<template>
  <section class="bg-transparent">
    <div class="flex flex-col items-center space-y-4 p-4">
      <div class="flex space-x-6">
        <div class="text-center">
          <div class="bg-terciary p-2 rounded-lg">
            <h3 class="text-black font-bold text-xl font-poppins">
              {{ formattedMinutes }}
            </h3>
          </div>
          <p class="text-white font-dekko mt-1">minutes</p>
        </div>

        <div class="text-center">
          <div class="bg-terciary p-2 rounded-lg">
            <h3 class="text-black font-bold text-xl font-poppins">
              {{ formattedSeconds }}
            </h3>
          </div>
          <p class="text-white font-dekko mt-1">seconds</p>
        </div>
      </div>

      <div class="flex space-x-4">
        <svg @click="handleStart"
          :class="{ 'opacity-50 cursor-not-allowed': isRunning || isBreak, 'cursor-pointer hover:opacity-80': !isRunning && !isBreak }"
          width="24px" height="24px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#4fd1d9"></circle>
          <path fill="#ffffff" d="M25 12l20 20l-20 20z"></path>
        </svg>

        <svg @click="handlePause"
          :class="{ 'opacity-50 cursor-not-allowed': !isRunning, 'cursor-pointer hover:opacity-80': isRunning }"
          width="24px" height="24px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#4fd1d9"></circle>
          <g fill="#ffffff">
            <path d="M20 14h8v36h-8z"></path>
            <path d="M36 14h8v36h-8z"></path>
          </g>
        </svg>

        <svg @click="handleReset" class="cursor-pointer hover:opacity-80 transition-opacity" width="24px" height="24px"
          viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#4fd1d9"></circle>
          <g fill="#ffffff">
            <path
              d="M27.3 20.1c1.5-.7 3.2-1 4.9-1c6.6 0 11.9 5.1 11.9 12H52c0-10.8-8.9-19.8-19.8-19.8c-3.8 0-7.6 1.1-10.8 3.2L18 11v13.1h13.5l-4.2-4">
            </path>
            <path
              d="M36.5 42.6c-1.5.7-3.1 1-4.7 1c-6.6 0-12-5.3-12-12.6H12c0 11.4 8.9 20.8 19.8 20.8c3.7 0 7.2-1.1 10.3-3.1L46 53V38.2H32.6l3.9 4.4">
            </path>
          </g>
        </svg>
      </div>
    </div>
  </section>
</template>
