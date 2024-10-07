import { defineStore } from 'pinia';
import { ref, computed, watch, onUnmounted } from 'vue';

export const useTimerStore = defineStore('timer', () => {
  const workDuration = ref(25 * 60);
  const breakDuration = ref(5 * 60);

  const _isBreak = ref(JSON.parse(localStorage.getItem('isBreak')) || false);
  const _time = ref(JSON.parse(localStorage.getItem('time')) || workDuration.value);
  const _isRunning = ref(JSON.parse(localStorage.getItem('isRunning')) || false);
  const timer = ref(null);
  const notificationPermission = ref('default');

  const isBreak = computed(() => _isBreak.value);
  const time = computed(() => _time.value);
  const isRunning = computed(() => _isRunning.value);

  watch(_isBreak, (newVal) => localStorage.setItem('isBreak', JSON.stringify(newVal)));
  watch(_time, (newVal) => localStorage.setItem('time', JSON.stringify(newVal)));
  watch(_isRunning, (newVal) => localStorage.setItem('isRunning', JSON.stringify(newVal)));

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

  const sendNotification = async (title, options) => {
    if (Notification.permission === "granted") {
      try {
        await new Notification(title, options);
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    }
  };

  const startTimer = async () => {
    if (timer.value || time.value <= 0 || isRunning.value) {
      return;
    }
    _isRunning.value = true;

    const endTime = Date.now() + _time.value * 1000;

    timer.value = setInterval(() => {
      const remaining = Math.round((endTime - Date.now()) / 1000);
      if (remaining >= 0) {
        _time.value = remaining;
      } else {
        clearInterval(timer.value);
        timer.value = null;
        _isRunning.value = false;

        if (_isBreak.value) {
          _time.value = breakDuration.value;
          _isBreak.value = false;
          sendNotification("Break time is over!", {
            body: "Time to get back to work!",
          });
        } else {
          _time.value = workDuration.value;
          _isBreak.value = true;
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
    _isRunning.value = false;
  };

  const resetTimer = () => {
    clearInterval(timer.value);
    timer.value = null;
    _isRunning.value = false;
    _isBreak.value = false;
    _time.value = workDuration.value;
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
