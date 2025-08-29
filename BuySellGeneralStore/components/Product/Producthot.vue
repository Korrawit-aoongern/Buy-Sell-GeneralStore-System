<template>
  <div class="product-card">
    <div class="badge">ขายดี</div>

    <div class="product-image">
      <img src="/Image/pen.jpg" alt="product" />
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
  position: relative;
  width: 200px;
  border-radius: 16px;
  border: 2px solid #d3b1f6;
  padding: 16px;
  background-color: white;
  text-align: center;
}

/* แบนเนอร์ขายดี */
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e63946;
  color: white;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  user-select: none;
  pointer-events: none;
  z-index: 10;
}

.product-image {
  position: relative; /* ต้องมีเพื่อ overlay */
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

/* ข้อความ SOLD OUT */
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
  white-space: nowrap;
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

/* สีแดงเมื่อสินค้าหมด */
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

/* สถานะปุ่ม disable */
.add-to-cart:disabled {
  background-color: #f5bebe;
  cursor: not-allowed;
  color: #f0a1a1;
}
</style>
