<template>
  <div class="product-card">
    <div class="badge">ขายดี</div>
    <div class="product-image">
      <img src="~assets/images/pen.jpg" alt="product" />
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
