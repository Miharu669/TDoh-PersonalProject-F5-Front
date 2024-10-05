<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="w-10/12 p-6 bg-yellow-100 rounded-lg shadow-lg border border-yellow-300">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-3xl font-bold text-teal-400">{{ monthName }} {{ currentYear }}</h2>
        <div>
          <button @click="prevMonth" class="text-orange-500 hover:text-gray-700 transition duration-200 mr-2" title="Previous Month">
            <i class="fas fa-chevron-left fa-lg"></i>
          </button>
          <button @click="nextMonth" class="text-orange-500 hover:text-gray-700 transition duration-200" title="Next Month">
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
            <span 
              v-if="getEventsForDate(day).length > 0" 
              v-for="event in getEventsForDate(day)" 
              :key="event.id" 
              class="block">
              {{ event.name }}
            </span>
            <span v-else class="text-xs text-gray-400">No Events</span>
          </div>

          <button 
            v-if="getEventsForDate(day).length > 0" 
            @click.stop="deleteEventsForDate(formatDate(currentYear, currentMonth + 1, day))" 
            class="mt-1 text-red-500 hover:text-red-700 text-xs flex items-center"
            title="Delete all events on this day"
          >
            <i class="fas fa-trash-alt mr-1"></i> Delete All
          </button>
        </div>
      </div>

      <div v-if="calendarStore.error" class="mt-4 p-4 bg-red-100 text-red-700 rounded">
        {{ calendarStore.error }}
      </div>

      <div class="mt-6 flex justify-center">
        <button 
          @click="fetchAllEvents" 
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        >
          <i class="fas fa-calendar-alt mr-2"></i> Fetch All Events
        </button>
      </div>

      <div v-if="calendarStore.events.length > 0" class="mt-6">
        <h3 class="text-2xl font-semibold text-teal-400 mb-4">All Events</h3>
        <ul class="space-y-2">
          <li 
            v-for="event in calendarStore.events" 
            :key="event.id" 
            class="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h4 class="font-bold text-lg">{{ event.name }}</h4>
              <p class="text-gray-600">{{ event.date }}</p>
            </div>
            <button 
              @click="deleteEvent(event.id)" 
              class="text-red-500 hover:text-red-700"
              title="Delete Event"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <CalendarModal 
      :isVisible="isModalVisible" 
      :date="selectedDate" 
      @close="closeModal" 
      @add-event="addEvent"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import CalendarModal from './CalendarModal.vue'; 
import { useCalendarStore } from '@/stores/calendar'; 
import { useAuthStore } from '@/stores/auth';  

const calendarStore = useCalendarStore(); 
const authStore = useAuthStore(); 

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

const formatDate = (year, month, day) => {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

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
  fetchEventsForCurrentMonth();
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  fetchEventsForCurrentMonth();
};

const openModal = (day) => {
  selectedDate.value = formatDate(currentYear.value, currentMonth.value + 1, day);
  isModalVisible.value = true; 
};

const closeModal = () => {
  isModalVisible.value = false; 
};

const addEvent = async (eventName) => {
  const dateKey = selectedDate.value;  
  try {
    await calendarStore.addEvent({ name: eventName, date: dateKey }); 
    await calendarStore.getEventsByDate(dateKey);  
    console.log('Event added successfully');
  } catch (err) {
    console.error('Failed to add event:', err);
    alert(calendarStore.error);
  }
};

const fetchAllEvents = async () => {
  try {
    await calendarStore.getAllEvents();
    console.log('All events fetched successfully');
  } catch (err) {
    console.error('Failed to fetch all events:', err);
    alert(calendarStore.error);
  }
};

const fetchEventsForCurrentMonth = async () => {
  const firstDate = formatDate(currentYear.value, currentMonth.value + 1, 1);
  try {
    await calendarStore.getEventsByDate(firstDate);
  } catch (err) {
    console.error('Failed to fetch events for the current month:', err);
  }
};

const getEventsForDate = (day) => {
  const dateKey = formatDate(currentYear.value, currentMonth.value + 1, day);

  if (!calendarStore.events || !Array.isArray(calendarStore.events)) {
    console.warn('Events data is undefined or not an array:', calendarStore.events);
    return [];
  }

  return calendarStore.events.filter(event => event.date === dateKey);
};

const deleteEventsForDate = async (date) => {
  if (confirm(`Are you sure you want to delete all events on ${date}?`)) {
    try {
      await calendarStore.deleteEventsByDate(date);
      console.log(`All events on ${date} have been deleted.`);
      await calendarStore.getEventsByDate(date);
    } catch (err) {
      console.error('Failed to delete events by date:', err);
      alert(calendarStore.error);
    }
  }
};

const deleteEvent = async (id) => {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      await calendarStore.deleteEvent(id);
      console.log(`Event with ID ${id} has been deleted.`);
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert(calendarStore.error);
    }
  }
};

onMounted(() => {
  const defaultDate = formatDate(currentYear.value, currentMonth.value + 1, today.getDate());
  console.log('Fetching events for date:', defaultDate);
  if (authStore.user && authStore.user.access_token) {
    calendarStore.getEventsByDate(defaultDate);
    console.log('getEventsByDate called.');
  } else {
    console.error('Cannot fetch events. User not authenticated.');
  }
});
</script>


