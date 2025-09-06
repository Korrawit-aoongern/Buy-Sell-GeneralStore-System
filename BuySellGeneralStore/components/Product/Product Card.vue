<template>
  <div class="product-card">
    <img 
      v-if="type === 'hot'" 
      class="badge" 
      src="/Image/Best-Seller-Badge.svg" 
      alt="Best-Seller-Badge"
    />
    <div class="product-wrapper">
      <div class="product-image">
        <img :src="image" alt="product" />
        <div v-if="localQty === 0" class="sold-out-overlay">
          <span class="sold-out-text">SOLD OUT</span>
        </div>
      </div>

      <div class="product-details">
        <h3 class="product-name">{{ name }}</h3>
        <div class="product-meta">
          <span class="product-price">{{ price.toFixed(2) }} บาท</span>
          <p class="product-qty" :class="{ 'zero-qty': localQty === 0 }">
            {{ localQty }} Qty.
          </p>
        </div>
      </div>

      <button 
        class="add-to-cart" 
        :disabled="localQty === 0" 
        @click="handleAddToCart"
      >
        เพิ่มลงตะกร้า
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  id: Number,
  name: String,
  price: Number,
  qty: Number,
  image: String,
  type: String,
  originalPrice: Number
})

const emit = defineEmits(['update-qty', 'add-to-cart'])

const localQty = ref(props.qty)

watch(() => props.qty, (newQty) => {
  localQty.value = newQty
})

function handleAddToCart() {
  if (localQty.value > 0) {
    localQty.value -= 1
    emit('update-qty', localQty.value)

    // ✅ ส่งข้อมูลสินค้าไปยัง parent
    emit('add-to-cart', {
      id: props.id,
      name: props.name,
      price: props.price,
      image: props.image,
      type: props.type,
      originalPrice: props.originalPrice ?? null
    })
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
  position: relative; /* ต้องมี เพื่อให้ overlay ทำงาน */
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
  padding-left: 16px;
  margin: 0;
  text-align: left;
  width: 255px;
}

.product-details {
  display: 700;
  flex-direction: column;
  gap: 8px;
  width: 255px;
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
