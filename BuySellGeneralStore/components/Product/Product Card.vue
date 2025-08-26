<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="image" alt="product" />
    </div>
    <div class="product-details">
      <h3 class="product-name">{{ name }}</h3>
      <div class="product-meta">
        <span class="product-price">{{ price.toFixed(2) }}</span>
        <p class="product-qty">{{ qty }} Qty.</p>
      </div>
    </div>
    <button class="add-to-cart">เพิ่มลงตะกร้า</button>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
  name: { type: String, default: 'ชื่อสินค้า' },
  price: { type: Number, default: 0 },
  qty: { type: Number, default: 1 },
  image: { type: String, default: '' } // ✅ เพิ่ม prop สำหรับรูปภาพ
}
}
</script>

<style scoped>
.product-card {
  width: 200px;
  border-radius: 16px;
  border: 2px solid #d3b1f6;
  padding: 16px;
  background-color: white;
  text-align: center;
}

.product-image {
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
</style>
