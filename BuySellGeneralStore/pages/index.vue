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

const productList = ref([
  {
    name: 'ปากกา 1',
    price: 12,
    qty: 0,
    type: 'hot',
    image: new URL('@/assets/images/Pen.jpg', import.meta.url).href
  },
  {
    name: 'ปากกา 1',
    price: 12,
    qty: 100,
    type: 'hot',
    image: new URL('@/assets/images/Pen.jpg', import.meta.url).href
  },
  {
    name: 'ปากกา 2',
    price: 10,
    originalPrice: 15, // ✅ ราคาก่อนลด
    qty: 0,
    type: 'sell',
    image: new URL('@/assets/images/R.jpg', import.meta.url).href
  },
  {
    name: 'ปากกา 2',
    price: 10,
    originalPrice: 15, // ✅ ราคาก่อนลด
    qty: 60,
    type: 'sell',
    image: new URL('@/assets/images/R.jpg', import.meta.url).href
  },
  {
    name: 'ปากกา 3',
    price: 15,
    qty: 0,
    type: 'normal',
    image: new URL('@/assets/images/Lan.jpg', import.meta.url).href
  },
  {
    name: 'ปากกา 3',
    price: 15,
    qty: 10,
    type: 'normal',
    image: new URL('@/assets/images/Lan.jpg', import.meta.url).href
  }
])



// ถ้าจะใช้ sortedProducts จริง ๆ
const sortedProducts = computed(() => {
  return productList.value // หรือเขียน logic การจัดเรียงได้ที่นี่
})

const hotProducts = computed(() => productList.value.filter(p => p.type === 'hot'))
const sellProducts = computed(() => productList.value.filter(p => p.type === 'sell'))
const normalProducts = computed(() => productList.value.filter(p => p.type === 'normal'))
</script>

<template>
  <div> <!-- ✅ Wrapper element -->
  
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
     <div class="text-block"> <h2 class="title">สินค้าขายดี</h2> </div>
    <div class="product-list">
      <Producthot
        v-for="(product, index) in hotProducts"
        :key="index"
        :name="product.name"
        :price="product.price"
        :qty="product.qty"
        :image="product.image"
      />
    </div>

    <!-- ลดราคา -->
     <div class="text-block1"> <h2 class="title">สินค้าลดราคา</h2> </div>
    <div class="product-list">
      <ProductCardSell
        v-for="(product, index) in sellProducts"
        :key="index"
        :name="product.name"
        :price="product.price"
        :originalPrice="product.originalPrice"
        :qty="product.qty"
        :image="product.image"
      />
    </div>

    <!-- ปกติ -->
     <div class="text-block1"> <h2 class="title">สินค้าปกติ</h2> </div>
    <div class="product-list">
      <ProductCard
        v-for="(product, index) in normalProducts"
        :key="index"
        :name="product.name"
        :price="product.price"
        :qty="product.qty"
        :image="product.image"
      />
    </div>
    
  </div> <!-- 🔚 End wrapper -->
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
