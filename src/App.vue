<script setup>
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import Pomodoro from "./components/pomodoro.vue";
import Navbar from "@/components/Navbar/Navbar.vue";
import Footer from "@/components/Footer/Footer.vue";
</script>

<template>
  <div
    class="font-poppins bg-gradient-to-r from-orange-700 via-black to-cyan-700 min-h-screen flex flex-col"
  >
    <Navbar />
    <main >
    <Pomodoro />
      <RouterView />
    </main>
    <Footer />
    <notifications />
  </div>
</template>
<style scoped>
main {
  width: 100% ;
  margin: 0 auto;
  min-height: calc(100vh - 132px);
}
</style>
