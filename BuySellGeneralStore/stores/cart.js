import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cart = ref([])

  function addToCart(product) {
    const item = cart.value.find(i => i.id === product.id)
    if (item) {
      if (product.stock && item.qty < product.stock) {
        item.qty++
        return true
      } else {
        return false
      }
    } else {
      cart.value.push({
        id: product.id,
        name: product.name,
        price: product.saleprice ?? product.price,
        originalPrice: product.saleprice ? product.price : null,
        qty: 1,
        image: product.image,
        stock: product.stock || 0,
        promotype: product.promotype || 'normal'
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
    return false
  }

  function decrease(item) {
    const cartItem = cart.value.find(i => i.id === item.id)
    if (cartItem && cartItem.qty > 1) {
      cartItem.qty--
      return true
    }
    return false
  }

  function removeItem(item) {
    cart.value = cart.value.filter(i => i.id !== item.id)
  }

  const totalPrice = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  )

  const discount = computed(() =>
    cart.value.reduce((sum, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return sum + (item.originalPrice - item.price) * item.qty
      }
      return sum
    }, 0)
  )

  const customerInfo = ref({
    name: '',
    surname: '',
    address: '',
    phone: '',
    paymentMethod: ''
  })

  function setCustomerInfo(info) {
    customerInfo.value = { ...info }
  }

  function clearCart() {
    cart.value = []
    customerInfo.value = {
      name: '',
      surname: '',
      address: '',
      phone: '',
      paymentMethod: ''
    }
  }

  // ฟังก์ชันนี้ใช้ดึงจำนวนสินค้าที่อยู่ในตะกร้า ตาม product id
  function getQty(productId) {
    const item = cart.value.find(i => i.id === productId)
    return item ? item.qty : 0
  }

  return {
    cart,
    addToCart,
    increase,
    decrease,
    removeItem,
    getQty, 
    totalPrice,
    discount,
    customerInfo,
    setCustomerInfo,
    clearCart,
    getQty
  }
})
