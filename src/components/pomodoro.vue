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
      <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
        <div class="text-center">
          <div class="bg-terciary p-4 rounded-lg">
            <h3 class="text-black font-bold text-3xl font-poppins">
              {{ formattedMinutes }}
            </h3>
          </div>
          <p class="text-white font-dekko mt-1">Minutes</p>
        </div>

        <div class="text-center">
          <div class="bg-terciary p-4 rounded-lg">
            <h3 class="text-black font-bold text-3xl font-poppins">
              {{ formattedSeconds }}
            </h3>
          </div>
          <p class="text-white font-dekko mt-1">Seconds</p>
        </div>
      </div>

      <div class="flex space-x-4">
        <button
          @click="handleStart"
          :disabled="isRunning"
          class="p-2 bg-green-500 text-white rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-300"
          aria-label="Start Timer"
        >
          Start
        </button>

        <button
          @click="handlePause"
          :disabled="!isRunning"
          class="p-2 bg-yellow-500 text-white rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          aria-label="Pause Timer"
        >
          Pause
        </button>

        <button
          @click="handleReset"
          class="p-2 bg-red-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          aria-label="Reset Timer"
        >
          Reset
        </button>
      </div>
    </div>
  </section>
</template>
