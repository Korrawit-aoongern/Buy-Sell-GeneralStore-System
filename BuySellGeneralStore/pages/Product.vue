<script setup>
import { ref } from 'vue'
import ProductCard from '~/components/Product/Product Card.vue'
import ProductCardSell from '~/components/Product/Product CardSell.vue'
import SoldoutCard from '~/components/Product/Sold out Card.vue'
import Producthot from '~/components/Product/Producthot.vue'
const selectedSort = ref('az') // ค่าเริ่มต้น
const activePage = ref('Home')

const setActive = (page) => {
  activePage.value = page
}

const showFilterTab = ref(false)

const toggleFilterTab = () => {
  showFilterTab.value = !showFilterTab.value
}

const productList = ref([
  
  { name: 'ปากกา 1', price: 12, qty: 101, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 2', price: 15, qty: 95, image: new URL('~/assets/images/Lan.jpg', import.meta.url).href },
  { name: 'ปากกา 3', price: 10, qty: 88, image: new URL('~/assets/images/R.jpg', import.meta.url).href },
  { name: 'ปากกา 4', price: 13, qty: 99, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 5', price: 11, qty: 50, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 6', price: 14, qty: 75, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 7', price: 12, qty: 100, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 8', price: 16, qty: 80, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 9', price: 10, qty: 110, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 10', price: 15, qty: 92, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 11', price: 13, qty: 105, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 12', price: 14, qty: 90, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 13', price: 11, qty: 60, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 14', price: 12, qty: 120, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },
  { name: 'ปากกา 15', price: 13, qty: 70, image: new URL('~/assets/images/pen.jpg', import.meta.url).href },

])

// ✅ จัดเรียงตามที่เลือก
const sortedProducts = computed(() => {
  const products = [...productList.value] // clone ก่อน
  switch (selectedSort.value) {
    case 'az':
      return products.sort((a, b) => a.name.localeCompare(b.name, 'th'))
    case 'za':
      return products.sort((a, b) => b.name.localeCompare(a.name, 'th'))
    case 'priceLowHigh':
      return products.sort((a, b) => a.price - b.price)
    case 'priceHighLow':
      return products.sort((a, b) => b.price - a.price)
    default:
      return products
  }
})
</script>

<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar">
      <div class="spacer"></div>
      <ul class="nav-links">
        <li><router-link to="/" active-class="active">Home</router-link></li>
        <li><router-link to="/Product" active-class="active">Product</router-link></li>
        <li><router-link to="/order" active-class="active">Order</router-link></li>
      </ul>
      <div class="cart-icon">
        <i class="fas fa-shopping-cart"></i>
      </div>
    </nav>

    <!-- Search bar -->
    <div class="search-bar">
      <input type="text" placeholder="ค้นหา..." />
    </div>

    <!-- Sort dropdown -->
    <div class="sort-dropdown">
      <label class="sort-label">จัดเรียงโดย</label>
      <div class="select-wrapper">
        <select v-model="selectedSort">
          <option value="az">ก-ฮ A-Z</option>
          <option value="za">ฮ-ก Z-A</option>
          <option value="priceLowHigh">ราคาต่ำไปสูง</option>
          <option value="priceHighLow">ราคาสูงไปต่ำ</option>
        </select>
        <span class="arrow">&#x25BC;</span>
      </div>
    </div>

    <!-- Floating cart icon -->
    <div class="cart">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
           viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
           class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.25 3h1.5l1.5 13.5h12.75l1.5-9H6.75M16.5 21a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    </div>

    <!-- Product list -->
    <div class="product-list">
      <ProductCard
        v-for="(product, index) in sortedProducts"
        :key="index"
        :name="product.name"
        :price="product.price"
        :qty="product.qty"
        :image="product.image"
      />
    </div>

    <!-- Filter toggle button -->
    <button class="filter-toggle" @click="toggleFilterTab" v-if="!showFilterTab">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
           stroke-width="2" viewBox="0 0 24 24" width="24" height="24">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    </button>

    <!-- Filter tab popup -->
    <div v-if="showFilterTab" class="filter-tab">
      <button class="close-btn" @click="toggleFilterTab">✕</button>

      <h3>สินค้า</h3>
      <ul class="filter-list">
        <li>อาหาร</li>
        <li>ของใช้ในครัว</li>
        <li>ของใช้ในห้องน้ำ</li>
        <li>ของตกแต่งบ้าน</li>
        <li>ของใช้ส่วนตัว</li>
        <li>ของใช้เล็กกรอบกิ๊กส์</li>
        <li>ของใช้กลางแจ้ง</li>
        <li>ของใช้บ้านทั่วไป</li>
      </ul>

      <h3>ราคา</h3>
      <ul class="filter-list">
        <li><input type="radio" id="price-all" name="price" checked /> <label for="price-all">ไม่จำกัด</label></li>
        <li><input type="radio" id="price-0-100" name="price" /> <label for="price-0-100">0.00 - 100.00</label></li>
        <li><input type="radio" id="price-100-500" name="price" /> <label for="price-100-500">100.00 - 500.00</label></li>
        <li><input type="radio" id="price-500-1000" name="price" /> <label for="price-500-1000">500.00 - 1,000.00</label></li>
        <li><input type="radio" id="price-over-1000" name="price" /> <label for="price-over-1000">มากกว่า 1,000.00</label></li>
      </ul>

      <h3>ประเภทสินค้า</h3>
      <ul class="filter-list">
        <li><input type="radio" id="type-all" name="type" checked /> <label for="type-all">ไม่จำกัด</label></li>
        <li><input type="radio" id="type-discount" name="type" /> <label for="type-discount">สินค้าลดราคา</label></li>
        <li><input type="radio" id="type-hot" name="type" /> <label for="type-hot">สินค้าขายดี</label></li>
        <li><input type="radio" id="type-normal" name="type" /> <label for="type-normal">สินค้าปกติ</label></li>
      </ul>
    </div>
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

.filter-tab {
  position: fixed;  /* ติดกับ viewport */
  top: 0;           /* อยู่บนสุด */
  left: 0;          /* อยู่ซ้ายสุด */
  width: 280px;
  height: 100vh;    /* ความสูงเต็มหน้าจอแนวตั้ง */
  background: white;
  border-right: 2px solid #3cb371;
  padding: 16px 20px;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  font-family: 'Kanit', sans-serif;
  color: #333;
  overflow-y: auto; /* เลื่อนแท็บด้านในได้ ถ้ามีเนื้อหาเยอะ */
  z-index: 1100;
}

/* ปุ่มเปิด/ปิด อยู่ติดกับแท็บเลย */
.filter-toggle {
  position: fixed;
  top: 10px;
  left: 10px; /* เลื่อนขวาออกจากแท็บ */
  background-color: #3cb371;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1101;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  float: right;
  cursor: pointer;
  color: #3cb371;
  font-weight: bold;
}

h3 {
  margin-top: 0;
  border-bottom: 1px solid #3cb371;
  padding-bottom: 6px;
  color: #3cb371;
}

.filter-list {
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 1rem;
}

.filter-tab ul li {
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.filter-tab ul li:hover {
  background-color: #3cb371;  /* สีเขียว */
  color: white;                /* เปลี่ยนสีตัวหนังสือเป็นขาว */
}

.filter-list input[type="radio"] {
  margin-right: 6px;
  accent-color: #3cb371;
}
/* ช่องค้นหา */
.search-bar {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  max-width: 400px;
  width: 100%;
}

.search-bar input {
  width: 100%;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-bar input:focus {
  border-color: #3cb371;
}

.sort-dropdown {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: 'Kanit', sans-serif;
  color: #999;
  width: 220px;
  margin-left: auto; /* ✅ ให้ลอยไปด้านขวา */
}

.sort-label {
  font-size: 0.9rem;
  color: #999;
}

.select-wrapper {
  position: relative;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.select-wrapper select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  padding: 10px 36px 10px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  outline: none;
  color: #333;
  background-color: transparent;
  cursor: pointer;
}

/* ลูกศร */
.select-wrapper .arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #3cb371; /* สีเขียว */
  pointer-events: none;
  font-size: 14px;
}
</style>
