import { defineStore } from 'pinia';
import { ref, watch, onUnmounted } from 'vue';

export const useTimerStore = defineStore('timer', () => {
  const workDuration = ref(25 * 60); 
  const breakDuration = ref(5 * 60); 

  const isBreak = ref(JSON.parse(localStorage.getItem('isBreak')) || false);
  const time = ref(
    JSON.parse(localStorage.getItem('time')) || workDuration.value
  );
  const isRunning = ref(JSON.parse(localStorage.getItem('isRunning')) || false);
  const timer = ref(null);
  const notificationPermission = ref('default');

  watch(isBreak, (newVal) => localStorage.setItem('isBreak', JSON.stringify(newVal)));
  watch(time, (newVal) => localStorage.setItem('time', JSON.stringify(newVal)));
  watch(isRunning, (newVal) => localStorage.setItem('isRunning', JSON.stringify(newVal)));

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      notificationPermission.value = permission;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const sendNotification = (title, options) => {
    if (Notification.permission === "granted") {
      try {
        new Notification(title, options);
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    }
  };

  const startTimer = () => {
    if (timer.value || time.value <= 0 || isRunning.value) {
      return;
    }
    isRunning.value = true;

    const endTime = Date.now() + time.value * 1000;

    timer.value = setInterval(() => {
      const remaining = Math.round((endTime - Date.now()) / 1000);
      if (remaining >= 0) {
        time.value = remaining;
      } else {
        clearInterval(timer.value);
        timer.value = null;
        isRunning.value = false;

        if (isBreak.value) {
          time.value = breakDuration.value;
          isBreak.value = false;
          sendNotification("Break time is over!", {
            body: "Time to get back to work!",
          });
        } else {
          time.value = workDuration.value;
          isBreak.value = true;
          sendNotification("Work session completed!", {
            body: "Time for a break!",
          });
        }
      }
    }, 1000);
  };

  const pauseTimer = () => {
    if (!isRunning.value) {
      return;
    }
    clearInterval(timer.value);
    timer.value = null;
    isRunning.value = false;
  };

  const resetTimer = () => {
    clearInterval(timer.value);
    timer.value = null;
    isRunning.value = false;
    isBreak.value = false;
    time.value = workDuration.value; 
  };

  onUnmounted(() => {
    clearInterval(timer.value);
  });

  return {
    isBreak,
    time,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    requestNotificationPermission, 
  };
});