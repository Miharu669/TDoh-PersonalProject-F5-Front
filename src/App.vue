<script setup>
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import Navbar from "@/components/Navbar/Navbar.vue";
import Footer from "@/components/Footer/Footer.vue";

</script>

<template>
  <Navbar />
  <RouterView />
  <Footer />
</template>
