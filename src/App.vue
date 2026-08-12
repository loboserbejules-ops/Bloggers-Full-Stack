<template>
  <Navbar />
  <div class="container my-4">
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>