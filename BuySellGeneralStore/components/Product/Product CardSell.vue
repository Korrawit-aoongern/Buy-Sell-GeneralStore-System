<template>

  <div class="product-card">
    <div class="product-image">
      <img src="~assets/images/Lan.jpg" alt="product" />
    </div>
    <div class="product-details">
      <h3 class="product-name">{{ name }}</h3>

      <!-- ราคาปกติ -->
      <p
        class="product-price-original"
        :class="{ 'no-discount': originalPrice <= price }"
      >
        {{ originalPrice.toFixed(2) }}
      </p>

      <!-- กล่องล่าง: ราคาลด + จำนวนสินค้า -->
      <div class="product-bottom-info">
        <p class="product-price-sale">
          {{ price.toFixed(2) }}
        </p>
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
    originalPrice: {
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
  border: 2px solid #d3b1f6;
  padding: 16px;
  background-color: white;
  text-align: center;
}

.product-name {
  font-weight: bold;
  margin: 0;
  text-align: left;
}

.product-details {
  text-align: left;
}

.product-price-original {
  text-decoration: line-through;
  color: #888888;
  margin: 4px 0;
  font-size: 14px;
}

.product-price-original.no-discount {
  text-decoration: none;
  color: #333333;
}

.product-bottom-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 14px;
}

.product-price-sale {
  color: #E73B3B;
  font-weight: bold;
  margin: 0;
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
}

.add-to-cart:hover {
  background-color: #52b27e;
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
</style>
