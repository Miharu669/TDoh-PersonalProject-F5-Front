<script setup>
import { ref, computed } from 'vue';
import CalendarModal from './CalendarModal.vue'; 
import { useEventStore } from '@/stores/calendar'; 

const eventStore = useEventStore(); 
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const monthName = computed(() => monthNames[currentMonth.value]);

const daysInMonth = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value + 1, 0);
  return Array.from({ length: date.getDate() }, (_, i) => i + 1);
});

const blanks = computed(() => {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay();
  return Array.from({ length: firstDayOfMonth }, (_, i) => i);
});

const isToday = (day) => {
  return day === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
};

const isModalVisible = ref(false);
const selectedDate = ref(''); 

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  }
};

const openModal = (day) => {
  selectedDate.value = day.toString(); 
  isModalVisible.value = true; 
};

const closeModal = () => {
  isModalVisible.value = false; 
};

const addEvent = async (eventName) => {
  const dateKey = `${currentYear.value}-${currentMonth.value + 1}-${selectedDate.value}`; 
  
  await eventStore.addEvent({ name: eventName, date: dateKey }); 
  await eventStore.fetchEvents();
};

const getEventsForDate = (day) => {
  const dateKey = `${currentYear.value}-${currentMonth.value + 1}-${day}`;
  return eventStore.events.filter(event => event.date === dateKey);
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="w-10/12 p-6 bg-yellow-100 rounded-lg shadow-lg border border-yellow-300">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-3xl font-bold text-teal-400">{{ monthName }} {{ currentYear }}</h2>
        <div>
          <button @click="prevMonth" class="text-orange-500 hover:text-gray-700 transition duration-200">
            <i class="fas fa-chevron-left fa-lg"></i>
          </button>
          <button @click="nextMonth" class="text-orange-500 hover:text-gray-700 transition duration-200">
            <i class="fas fa-chevron-right fa-lg"></i>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-7 text-center text-amber-700 font-semibold">
        <div class="py-2 text-amber-950">Sun</div>
        <div class="py-2">Mon</div>
        <div class="py-2">Tue</div>
        <div class="py-2">Wed</div>
        <div class="py-2">Thu</div>
        <div class="py-2">Fri</div>
        <div class="py-2">Sat</div>
      </div>

      <div class="grid grid-cols-7">
        <div v-for="blank in blanks" :key="blank" class="h-20"></div>
        <div 
          v-for="day in daysInMonth" 
          :key="day" 
          class="flex flex-col items-center justify-center h-20 border border-amber-200 rounded-lg transition duration-300 cursor-pointer hover:bg-teal-200" 
          :class="{'bg-teal-500 text-white font-bold': isToday(day)}"
          @click="openModal(day)"
        >
          <span :class="{'text-teal-300': isToday(day)}">{{ day }}</span>
          <div class="text-sm text-gray-600 mt-1">
            <span v-for="event in getEventsForDate(day)" :key="event.name" class="block">{{ event.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <CalendarModal 
      :isVisible="isModalVisible" 
      :date="selectedDate" 
      :onClose="closeModal" 
      :onAddEvent="addEvent"
    />
  </div>
</template>
