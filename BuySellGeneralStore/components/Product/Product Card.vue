<template>
  <div class="product-card">
    <!-- Hot badge -->
    <img 
      v-if="promotype === 'hot'" 
      class="badge" 
      src="/Image/Best-Seller-Badge.svg" 
      alt="Best-Seller-Badge"
    />

    <div class="product-wrapper">
      <!-- Product Image -->
      <div class="product-image">
        <img :src="image" alt="product" />
        <div v-if="saleprice === null" class="sold-out-overlay">
          <Icon
            name="material-symbols:error"
            style="color: red; width: 45px; height: 45px"
          />
          <span style="margin: 1em; font-weight: 700;">Error : ราคาผิดพลาด</span>
        </div>
        <div v-if="availableStock <= 0" class="sold-out-overlay">
          <span class="sold-out-text">SOLD OUT</span>
        </div>
      </div>

      <!-- Product Details -->
      <div class="product-details">
        <h3 class="product-name" :title="name">{{ shortName }}</h3>

        <div v-if="isSale">
          <p
            class="product-price-original"
            :class="{ 'no-discount': originalprice <= saleprice }"
          >
            {{ originalprice.toFixed(2) }} บาท
          </p>
          <div class="product-bottom-info">
            <span class="product-price-sale">{{ saleprice.toFixed(2) }} บาท</span>
            <p class="product-qty" :class="{ 'zero-qty': availableStock <= 0 }">
              {{ availableStock }} Qty.
            </p>
          </div>
        </div>

        <div v-else>
          <div class="product-meta">
            <span class="product-price">{{ price.toFixed(2) }} บาท</span>
            <p class="product-qty" :class="{ 'zero-qty': availableStock <= 0 }">
              {{ availableStock }} Qty.
            </p>
          </div>
        </div>
      </div>

      <button 
        class="add-to-cart" 
        :disabled="availableStock <= 0 || saleprice === null"
        @click="handleAddToCart"
      >
        เพิ่มลงตะกร้า
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from "~/stores/cart";

const props = defineProps({
  id: { type: Number, required: true },
  name: { type: String, default: 'ชื่อสินค้า' },
  price: { type: Number, default: 0 }, // ราคาปกติ
  qty: { type: Number, default: 1 },  // qty ที่ backend ส่งมา (อาจไม่ใช้ในนี้)
  image: { type: String, default: null },
  promotype: { type: String, default: 'normal' },
  saleprice: { type: Number, default: null }, // ราคาขายลด
  originalprice: { type: Number, default: null }, // ราคาต้นฉบับ
  stock: { type: Number, default: 0 } // จำนวนสต็อกทั้งหมด
})

const emit = defineEmits(['update-qty'])

const cartStore = useCartStore()

// คำนวณจำนวนสินค้าที่เหลือโดยลบจำนวนในตะกร้าออก
const availableStock = computed(() => {
  return props.stock - cartStore.getQty(props.id)
})

const isSale = computed(() => 
  props.saleprice !== null 
  && props.originalprice !== null 
  && props.saleprice !== props.originalprice
  && props.promotype === 'sale'
)

// ตัดชื่อถ้ายาวเกิน 23 ตัวอักษร
const shortName = computed(() => {
  const maxLength = 23
  if (props.name.length > maxLength) {
    return props.name.slice(0, maxLength - 3) + '...'
  }
  return props.name
})

function handleAddToCart() {
  if (availableStock.value > 0) {
    const success = cartStore.addToCart({
      id: props.id,
      name: props.name,
      price: props.price,
      saleprice: props.saleprice,
      originalprice: props.originalprice,
      image: props.image,
      promotype: props.promotype,
      stock: props.stock
    })
    if (!success) {
      alert('ไม่สามารถเพิ่มสินค้าได้ เนื่องจากสินค้าหมดสต็อก')
    } else {
      // อัพเดต qty ใน component ถ้าจำเป็น (ถ้าใช้ props.qty ต้อง emit event แจ้ง parent)
      emit('update-qty', availableStock.value - 1)
    }
  }
}
</script>



<style scoped>
.product-card {
  position: relative;
  width: 266px;
  height: 326px;
  border-radius: 20px;
  padding: 16px;
  background-color: white;
  text-align: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.product-wrapper {
  height: inherit;
  justify-content: center;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.product-image {
  position: relative;
  height: 169px;
  width: 225px;
  border-radius: 20px;
  overflow: hidden;
  align-self: center;
}
.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.sold-out-overlay {
  background-color: rgba(255, 255, 255, 0.5);
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
}
.sold-out-text {
  position: absolute;
  top: 50%;
  left: 50%;
  color: red;
  font-weight: normal;
  font-size: 36px;
  transform: translate(-50%, -50%) rotate(-45deg);
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  z-index: 1000;
  text-shadow: 0px 0px 2px rgba(100, 100, 100, 100);
}
.product-name {
  font-size: 20px;
  font-weight: bold;
  color: #111827;
  padding: 0 16px;
  margin: 0;
  text-align: left;

  /* CSS สำหรับ multiline ellipsis */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  line-height: 1.4em;
  max-height: 2.8em;
  max-width: 255px;

  word-break: break-word;
  white-space: normal;
}
.product-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 255px;
  height: 70px;
}
.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.product-price {
  font-weight: 600;
  padding-left: 16px;
  color: #111827;
}
.product-price-original {
  text-decoration: line-through;
  color: #111827;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  padding-left: 16px;
  margin: 0;
}
.product-price-original.no-discount {
  text-decoration: none;
  color: #111827;
}
.product-bottom-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.product-price-sale {
  color: #E73B3B;
  font-weight: 600;
  font-size: 16px;
  padding-left: 16px;
  margin: 0;
}
.product-qty {
  font-weight: 600;
  padding-right: 10px;
  margin: 0;
}
.product-qty.zero-qty {
  color: red;
  font-weight: bold;
}
.add-to-cart {
  font-family: prompt, sans-serif;
  font-weight: 700;
  background-color: #6ACC91;
  color: #EFF1F3;
  border: none;
  margin: 0 16px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.add-to-cart:hover {
  background-color: #55C581; 
}
.add-to-cart:active {
  background-color: #3CAF6A;
}
.add-to-cart:disabled {
  background-color: #E73B3B;
  text-decoration: line-through;
  opacity: 50%;
  cursor: not-allowed;
  color: #EFF1F3;
}
.badge {
  z-index: 10;
  width: 77px;
  position: absolute;
  right: -25px;
  top: -20px;
}
</style>
