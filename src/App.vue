<script setup>
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import Pomodoro from "./components/pomodoro.vue";
import Navbar from "@/components/Navbar/Navbar.vue";
import Footer from "@/components/Footer/Footer.vue";
</script>

<template>
  <html
    class="font-poppins bg-gradient-to-r from-orange-700 via-black to-cyan-700"
  >
    <Navbar />
      <RouterView />
    <Pomodoro />
    <Footer />
  </html>
</template>
