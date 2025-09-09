import { ref } from 'vue'

const toastMessage = ref('')
const toastVisible = ref(false)

function showToast(message, duration = 3000) {
  toastMessage.value = message
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, duration)
}

export function useToast() {
  return {
    toastMessage,
    toastVisible,
    showToast
  }
}
