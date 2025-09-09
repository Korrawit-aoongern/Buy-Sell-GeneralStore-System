import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cart = ref([])

  function addToCart(product) {
    const item = cart.value.find(i => i.id === product.productid)

    if (item) {
      if (product.stock && item.qty < product.stock) {
        item.qty++
        return true
      } else {
        return false
      }
    } else {
      cart.value.push({
        id: product.productid,
        name: product.nameproduct,
        price: product.baseprice,
        qty: 1,
        image: `Image/${product.imgurl}`,
        stock: product.stock || 0
      })
      return true
    }
  }

  function increase(item) {
    const cartItem = cart.value.find(i => i.id === item.id)
    if (cartItem) {
      if (cartItem.qty < cartItem.stock) {
        cartItem.qty++
        return true
      } else {
        return false
      }
    }
  }

  function decrease(item) {
    const cartItem = cart.value.find(i => i.id === item.id)
    if (cartItem && cartItem.qty > 1) {
      cartItem.qty--
    }
  }

  function removeItem(item) {
    cart.value = cart.value.filter(i => i.id !== item.id)
  }

  return {
    cart,
    addToCart,
    increase,
    decrease,
    removeItem
  }
})
