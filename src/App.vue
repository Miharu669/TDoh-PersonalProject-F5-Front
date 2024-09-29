<script setup>
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import Navbar from "@/components/Navbar/Navbar.vue";

</script>

<template>
  <Navbar />
  <RouterView />
</template>
