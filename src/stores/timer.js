import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';

export const useTimerStore = defineStore('timer', () => {
  const workDuration = 30 * 60;
  const breakDuration = 5 * 60;

  const isBreak = ref(false);
  const time = ref(workDuration);
  const timer = ref(null);
  const isRunning = ref(false);
  const notificationPermission = ref('default');

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
