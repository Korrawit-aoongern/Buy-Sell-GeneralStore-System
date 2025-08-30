<template>
  <div class="product-card">
    <div class="product-image">
      <img src="/Image/R.jpg" alt="product" />
      <div v-if="qty === 0" class="sold-out-overlay">SOLD OUT</div>
    </div>
    <div class="product-details">
      <h3 class="product-name">{{ name }}</h3>
      <div class="product-meta">
        <span class="product-price">{{ price.toFixed(2) }}</span>
        <p class="product-qty" :class="{ 'zero-qty': qty === 0 }">{{ qty }} Qty.</p>
      </div>
    </div>
    <button class="add-to-cart" :disabled="qty === 0">เพิ่มลงตะกร้า</button>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    name: {
      type: String,
      default: 'ชื่อสินค้า'
    },
    price: {
      type: Number,
      default: 0
    },
    qty: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style scoped>
.product-card {
  width: 200px;
  border-radius: 16px;
  padding: 16px;
  background-color: white;
  text-align: center;
}

.product-image {
  position: relative; /* เพิ่มตรงนี้ */
  height: 175px;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sold-out-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  color: red;
  font-weight: bold;
  font-size: 32px;
  transform: translate(-50%, -50%) rotate(-45deg);
  pointer-events: none;
  user-select: none;
  white-space: nowrap; /* กันข้อความขึ้นบรรทัดใหม่ */
}
.product-name {
  font-weight: bold;
  margin: 0;
  text-align: left;
}

.product-details {
  text-align: left;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px; 
}

.product-price {
  font-weight: bold;
  color: #333;
}

.product-qty {
  margin: 0;
}

.product-qty.zero-qty {
  color: red;
  font-weight: bold;
}

.add-to-cart {
  margin-top: 8px;
  background-color: #6ACC91;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-to-cart:hover {
  background-color: #52b27e; 
}

.add-to-cart:disabled {
  background-color: #f5bebe;
  cursor: not-allowed;
  color: #f0a1a1;
}
</style>
