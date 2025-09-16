import { computed } from 'vue'
import { useCartStore } from '~/stores/cart'

export function useCart() {
  const cartStore = useCartStore()

  const cartCount = computed(() =>
    cartStore.cart.reduce((sum, item) => sum + item.qty, 0)
  )

  function addToCart(product) {
    const item = cartStore.cart.find(i => i.id === product.id)
    if (item) {
      cartStore.increase(item)
    } else {
      cartStore.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        image: product.image,
        ...(product.originalPrice && { oldPrice: product.originalPrice })
      })
    }
  }


  function resetCart() {
    cartStore.cart = []
  }

  function removeFromCart(product) {
    const item = cartStore.cart.find(i => i.id === product.id)
    if (item) {
      cartStore.removeItem(item)
    }
  }

  return {
    cartCount,
    addToCart,
    resetCart,
    removeFromCart, // เพิ่มฟังก์ชันนี้
  }
}
