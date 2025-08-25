<template>
  <div class="product-card">
    <div class="image-box">
      <img v-if="image" :src="image" alt="product image" />
      <div v-else class="placeholder"></div>
    </div>
    <div class="info">
      <h3 class="name">{{ name }}</h3>
      <div class="prices">
        <span class="old-price">฿{{ formatPrice(oldPrice) }}</span>
        <span class="new-price">฿{{ formatPrice(newPrice) }}</span>
      </div>
      <div class="qty">{{ qty }} Qty.</div>
    </div>
    <button class="add-btn" @click="$emit('add-to-cart')">เพิ่มลงตะกร้า</button>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
  image: String,
  oldPrice: Number,
  newPrice: Number,
  qty: Number
})

const formatPrice = (v) => Number(v).toFixed(2)
</script>

<style scoped>
.product-card {
  width: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.image-box {
  width: 100%;
  height: 150px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.image-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
.placeholder {
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(#ddd 0% 25%, transparent 0% 50%) 50% / 20px 20px;
}

/* SOLD OUT Overlay */
.soldout-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-20deg);
  font-size: 28px;
  font-weight: bold;
  color: red;
  opacity: 0.85;
  pointer-events: none;
  text-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

/* ทำให้ภาพจาง/เทาเวลา out of stock */
.product-card.out .image-box img {
  filter: grayscale(1);
  opacity: 0.6;
}

.info { display: flex; flex-direction: column; gap: 4px; }
.name { font-size: 14px; font-weight: bold; }

.prices {
  display: flex; justify-content: center; gap: 6px; align-items: center;
}
.old-price { font-size: 12px; text-decoration: line-through; color: #888; }
.new-price { font-size: 14px; color: red; font-weight: bold; }

.qty { font-size: 12px; color: #444; }
.qty.red { color: red; font-weight: bold; }

.add-btn {
  background: #4CAF50; color: white; border: none;
  padding: 6px; border-radius: 6px; cursor: pointer;
  font-size: 13px; transition: 0.2s;
}
.add-btn:hover { background: #43a047; }
.add-btn:disabled {
  background: #d1d5db; color: #6b7280;
  cursor: not-allowed; box-shadow: none;
}
</style>

