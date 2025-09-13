import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
          price: product.saleprice ?? product.baseprice, // use sale price if exists
          originalPrice: product.saleprice ? product.baseprice : null, // for display strike-through
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

  // คำนวณราคาทั้งหมด
  const totalPrice = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  })

  // คำนวณส่วนลดรวม
  const discount = computed(() => {
    return cart.value.reduce((sum, item) => {
      if (item.originalprice && item.originalprice > item.price) {
        return sum + (item.originalprice - item.price) * item.qty
      }
      return sum
    }, 0)
  })

  // ข้อมูลลูกค้า
  const customerInfo = ref({
    name: "",
    surname: "",
    address: "",
    phone: "",
    paymentMethod: ""
  })

  function setCustomerInfo(info) {
    customerInfo.value = { ...info } // copy เพื่อความปลอดภัย
  }

  // ล้างตะกร้าและข้อมูลลูกค้า
  function clearCart() {
    cart.value = []
    customerInfo.value = {
      name: "",
      surname: "",
      address: "",
      phone: "",
      paymentMethod: ""
    }
  }

  return {
    cart,
    addToCart,
    increase,
    decrease,
    removeItem,
    totalPrice,
    discount,
    customerInfo,
    setCustomerInfo,
    clearCart
  }
})
