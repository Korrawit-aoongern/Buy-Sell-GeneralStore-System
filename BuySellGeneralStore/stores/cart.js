import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cart = ref([])

  const increase = (item) => {
    item.qty++
  }

  const decrease = (item) => {
    if (item.qty > 1) {
      item.qty--
    }
  }

  const removeItem = (item) => {
    const index = cart.value.findIndex(i => i.id === item.id)
    if (index !== -1) {
      cart.value.splice(index, 1)
    }
  }

  const discount = computed(() => {
    return cart.value.reduce((sum, item) => {
      if (item.oldPrice) {
        return sum + (item.oldPrice - item.price) * item.qty
      }
      return sum
    }, 0)
  })

  const totalPrice = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  )

  return {
    cart,
    increase,
    decrease,
    removeItem,
    totalPrice,
    discount
  }
})
