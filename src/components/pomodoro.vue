<template>
    <div class="flex flex-col items-center space-y-4 p-4">
      <div class="flex space-x-4">
        <svg
          @click="startTimer"
          :class="{ 'opacity-50 cursor-not-allowed': isRunning || isBreak, 'cursor-pointer hover:opacity-80': !isRunning && !isBreak }"
          width="24px"
          height="24px"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="30" fill="#4fd1d9"></circle>
          <path fill="#ffffff" d="M25 12l20 20l-20 20z"></path>
        </svg>
  
        <svg
          @click="pauseTimer"
          :class="{ 'opacity-50 cursor-not-allowed': !isRunning, 'cursor-pointer hover:opacity-80': isRunning }"
          width="24px"
          height="24px"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="30" fill="#4fd1d9"></circle>
          <g fill="#ffffff">
            <path d="M20 14h8v36h-8z"></path>
            <path d="M36 14h8v36h-8z"></path>
          </g>
        </svg>
  
        <svg
          @click="resetTimer"
          class="cursor-pointer hover:opacity-80 transition-opacity"
          width="24px"
          height="24px"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
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
  
      <div class="flex space-x-6">
        <div class="text-center">
          <div class="bg-terciary p-2 rounded-lg">
            <h3 class="text-white text-xl font-poppins">
              {{ formatMinutes(time) }}
            </h3>
          </div>
          <p class="text-gray-900 font-dekko mt-1">minutes</p>
        </div>
  
        <div class="text-center">
          <div class="bg-terciary p-2 rounded-lg">
            <h3 class="text-white text-xl font-poppins">
              {{ formatSeconds(time) }}
            </h3>
          </div>
          <p class="text-gray-900 font-dekko mt-1">seconds</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const workDuration = 30 * 60;
  const breakDuration = 5 * 60;
  
  const isBreak = ref(false);
  const time = ref(workDuration);
  const timer = ref(null);
  const isRunning = ref(false);
  const notificationPermission = ref('default'); // remove later
  
  const formatMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return String(minutes).padStart(2, '0');
  };
  
  const formatSeconds = (seconds) => {
    const secs = seconds % 60;
    return String(secs).padStart(2, '0');
  };
  
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }
  
    try {
      const permission = await Notification.requestPermission();
      notificationPermission.value = permission;
      console.log("Notification permission:", permission);
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };
  
  const sendNotification = (title, options) => {
    console.log("Attempting to send notification:", title, options);
    if (Notification.permission === "granted") {
      try {
        new Notification(title, options);
        console.log("Notification sent successfully");
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    } else {
      console.log("Notification permission not granted. Current status:", Notification.permission);
    }
  };
  
  const startTimer = () => {
    if (timer.value || time.value <= 0 || isRunning.value) return;
    isRunning.value = true;
    timer.value = setInterval(() => {
      time.value--;
      if (time.value <= 0) {
        clearInterval(timer.value);
        timer.value = null;
        isRunning.value = false;
        if (isBreak.value) {
          time.value = workDuration;
          isBreak.value = false;
          sendNotification("Break time is over!", {
            body: "Time to get back to work!",
          });
        } else {
          time.value = breakDuration;
          isBreak.value = true;
          sendNotification("Work session completed!", {
            body: "Time for a break!",
          });
        }
      }
    }, 1000);
  };
  
  const pauseTimer = () => {
    if (!isRunning.value) return;
    clearInterval(timer.value);
    timer.value = null;
    isRunning.value = false;
  };
  
  const resetTimer = () => {
    clearInterval(timer.value);
    timer.value = null;
    isRunning.value = false;
    isBreak.value = false;
    time.value = workDuration;
  };
  
  onMounted(() => {
    requestNotificationPermission();
  });
  
  onUnmounted(() => {
    clearInterval(timer.value);
  });
  </script>