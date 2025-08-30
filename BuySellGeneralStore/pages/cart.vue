<script setup>
import Navbar from "~/components/UI/Navbar.vue";
</script>
<template>
  <div>
    <!-- Navbar -->
    <div>
      <Navbar />
      <router-view />
    </div>
  </div>
</template>
<style>
body {
  margin: 0;
  padding: 0;
  background-color: #FAFAF5;
  font-family: "Prompt", sans-serif;
  min-height: 100vh;
}
</style>