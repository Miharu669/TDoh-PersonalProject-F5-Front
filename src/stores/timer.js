// src/stores/timer.js

import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';
import { toast } from 'vue3-toastify'; // Import toast function

export const useTimerStore = defineStore('timer', () => {
  // Timer Durations in seconds
  const workDuration = 30 * 60; // 30 minutes
  const breakDuration = 5 * 60; // 5 minutes

  // Reactive States
  const isBreak = ref(false);
  const time = ref(workDuration);
  const timer = ref(null);
  const isRunning = ref(false);
  const notificationPermission = ref('default');

  // Formatting Functions
  const formatMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return String(minutes).padStart(2, '0');
  };

  const formatSeconds = (seconds) => {
    const secs = seconds % 60;
    return String(secs).padStart(2, '0');
  };

  // Notification Functions
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notifications.");
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
        console.log("Notification sent successfully.");
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    } else {
      console.log("Notification permission not granted. Current status:", Notification.permission);
    }
  };

  // Timer Control Functions
  const startTimer = () => {
    console.log("startTimer called");
    if (timer.value || time.value <= 0 || isRunning.value) {
      console.log("Cannot start timer. Either already running, time <= 0, or other condition.");
      toast.info("Timer is already running or cannot start.");
      return;
    }
    isRunning.value = true;
    toast.success("Timer started!");

    timer.value = setInterval(() => {
      time.value--;
      console.log("Time:", time.value);
      if (time.value <= 0) {
        clearInterval(timer.value);
        timer.value = null;
        isRunning.value = false;
        console.log("Session ended.");

        if (isBreak.value) {
          time.value = workDuration;
          isBreak.value = false;
          sendNotification("Break time is over!", {
            body: "Time to get back to work!",
          });
          toast.info("Break time is over! Back to work.");
        } else {
          time.value = breakDuration;
          isBreak.value = true;
          sendNotification("Work session completed!", {
            body: "Time for a break!",
          });
          toast.info("Work session completed! Time for a break.");
        }
      }
    }, 1000);
  };

  const pauseTimer = () => {
    console.log("pauseTimer called");
    if (!isRunning.value) {
      console.log("Timer is not running.");
      toast.info("Timer is not running.");
      return;
    }
    clearInterval(timer.value);
    timer.value = null;
    isRunning.value = false;
    toast.info("Timer paused.");
  };

  const resetTimer = () => {
    console.log("resetTimer called");
    clearInterval(timer.value);
    timer.value = null;
    isRunning.value = false;
    isBreak.value = false;
    time.value = workDuration;
    toast.info("Timer reset.");
  };

  // Lifecycle Hooks
  onMounted(() => {
    requestNotificationPermission();
  });

  onUnmounted(() => {
    clearInterval(timer.value);
  });

  return {
    isBreak,
    time,
    isRunning,
    formatMinutes,
    formatSeconds,
    startTimer,
    pauseTimer,
    resetTimer,
  };
});
