<script setup>
import { ref } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  onAddSubtask: {
    type: Function,
    required: true,
  },
});

const newSubtask = ref({
  title: '',
  description: '',
});

const submitForm = () => {
  // Llamar a la función onAddSubtask con los datos de la nueva subtarea
  props.onAddSubtask(newSubtask.value);
  
  // Limpiar el formulario después de agregar la subtarea
  newSubtask.value = { title: '', description: '' };
  closeModal(); // Cerrar el modal después de enviar el formulario
};

const closeModal = () => {
  props.onClose();
};

const handleBackdropClick = (event) => {
  if (event.target.classList.contains('backdrop')) {
    closeModal();
  }
};
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center z-50 backdrop" @click="handleBackdropClick">
    <!-- Fondo oscuro detrás del modal -->
    <div class="fixed inset-0 bg-black opacity-50"></div>
    
    <!-- Contenedor del modal -->
    <div class="bg-yellow-200 rounded-lg shadow-lg p-6 max-w-md w-full z-10" @click.stop>
      <h2 class="text-2xl font-bold mb-4">Add New Subtask</h2>
      
      <!-- Formulario para agregar la subtarea -->
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" id="title" v-model="newSubtask.title" required
            class="mt-1 block w-full bg-yellow-100 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
        </div>

        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" v-model="newSubtask.description" required rows="3"
            class="mt-1 block w-full bg-yellow-100 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"></textarea>
        </div>

        <div class="flex justify-end">
          <button type="button" @click="closeModal" class="mr-2 text-gray-500 hover:text-gray-700">Cancel</button>
          <button type="submit" class="bg-teal-400 text-white px-4 py-2 rounded-md hover:bg-teal-300">Add Subtask</button>
        </div>
      </form>
    </div>
  </div>
</template>
