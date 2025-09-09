<template>
  <transition name="fade">
    <div v-if="toastVisible" class="toast-container">
      {{ toastMessage }}
    </div>
  </transition>
</template>

<script setup>
import { useToast } from '~/composables/useToast'

const { toastMessage, toastVisible } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  z-index: 9999;
  user-select: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
