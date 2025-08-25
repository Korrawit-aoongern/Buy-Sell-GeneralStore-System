<script setup>
import { ref } from 'vue'
import ProductCard from '~/components/Product/Product Card.vue'
import ProductCardSell from '~/components/Product/Product CardSell.vue'
import SoldoutCard from '~/components/Product/Sold out Card.vue'
import Producthot from '~/components/Product/Producthot.vue'

const activePage = ref('Home')

const setActive = (page) => {
  activePage.value = page
}
</script>

<template>
  <!-- Navbar -->
  <nav class="navbar">
    <div class="spacer"></div>
    <ul class="nav-links">
      <li :class="{ active: activePage === 'Home' }" @click="setActive('Home')">Home</li>
      <li :class="{ active: activePage === 'Product' }" @click="setActive('Product')">Product</li>
      <li :class="{ active: activePage === 'Order' }" @click="setActive('Order')">Order</li>
    </ul>
    <div class="cart-icon">
      <i class="fas fa-shopping-cart"></i>
    </div>
  </nav>
  
 <!-- ไอคอนรถเข็นแบบ SVG ลอยมุมขวาบน -->
  <div class="cart">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
         viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
         class="w-6 h-6">
       <path stroke-linecap="round" stroke-linejoin="round"
            d="M2.25 3h1.5l1.5 13.5h12.75l1.5-9H6.75M16.5 21a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  </div>

  <!-- ขายดี -->
  <div class="text-block">
    <h2 class="title">สินค้าขายดี</h2>
  </div>
  <!--  ProductHot -->
  <div class="product-list">
    <Producthot :name="'ปากกา'" :price="12" :qty="101" />
    <Producthot :name="'ปากกา'" :price="12" :qty="101" />
  </div>
  <!-- สินค้าลดราคา -->
  <div class="text-block1">
    <h2 class="title">สินค้าลดราคา</h2>
  </div>
  <!-- ProductCardSell -->
  <div class="product-list">
    <ProductCardSell :name="'ปากกา'" :originalPrice="13" :price="12" :qty="101" />
    <ProductCardSell :name="'ปากกา'" :originalPrice="13" :price="12" :qty="101" />
    <ProductCardSell :name="'ปากกา'" :originalPrice="13" :price="12" :qty="101" />
  </div>
    <!-- สินค้าปกติ -->
  <div class="text-block1">
    <h2 class="title">สินค้าปกติ</h2>
  </div>
  <!--  ProductCard -->
  <div class="product-list">
    <ProductCard :name="'ปากกา'" :price="12" :qty="101" />
    <ProductCard :name="'ปากกา'" :price="12" :qty="101" />
    <SoldoutCard :name="'ปากกา'" :price="12" :qty="0" />
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fdfdf7;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ccc;
}
.text-block1{
   padding: 1rem;
}
.spacer {
  width: 100px;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 3rem;
  margin: 0 auto;
  padding: 0;
}

.nav-links li {
  cursor: pointer;
  color: #3cb371;
  font-weight: normal;
  transition: font-weight 0.3s;
}

.nav-links li.active {
  font-weight: bold;
}

.cart-icon {
  font-size: 24px;
  color: #000;
  width: 100px;
  display: flex;
  justify-content: flex-end;
}

.title {
  font-size: 1.8rem;
  color: #000000;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.1rem;
  color: #333;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 2rem;
}
.cart {
  position: fixed;
  bottom: 20px;   /* เปลี่ยนจาก top เป็น bottom */
  right: 20px;
  top: auto;      /* ป้องกัน top ทับซ้อน */
  background-color: white;
  padding: 8px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 1000;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3cb371;
  transition: background-color 0.2s ease;
}

.cart:hover {
  background-color: #d3f5e0;
}

.cart svg {
  width: 24px;
  height: 24px;
}

</style>
