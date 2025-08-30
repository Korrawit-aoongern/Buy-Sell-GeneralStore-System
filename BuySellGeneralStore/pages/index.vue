<script setup>
import { ref } from "vue";
import ProductCard from "~/components/Product/Product Card.vue";
import ProductCardSell from "~/components/Product/Product CardSell.vue";
import SoldoutCard from "~/components/Product/Sold out Card.vue";
import Producthot from "~/components/Product/Producthot.vue";
import Navbar from "~/components/UI/Navbar.vue";

const activePage = ref("Home");

const setActive = (page) => {
  activePage.value = page;
};

const productList = ref([
  {
    name: "ปากกา 1",
    price: 12,
    qty: 0,
    type: "hot",
    image: "/Image/pen.jpg",
  },
  {
    name: "ปากกา 1",
    price: 12,
    qty: 100,
    type: "hot",
    image: "/Image/pen.jpg",
  },
  {
    name: "ปากกา 2",
    price: 10,
    originalPrice: 15, // ✅ ราคาก่อนลด
    qty: 0,
    type: "sell",
    image: "/Image/R.jpg",
  },
  {
    name: "ปากกา 2",
    price: 10,
    originalPrice: 15, // ✅ ราคาก่อนลด
    qty: 60,
    type: "sell",
    image: "/Image/R.jpg",
  },
  {
    name: "ปากกา 3",
    price: 15,
    qty: 0,
    type: "normal",
    image: "/Image/R.jpg",
  },
  {
    name: "ปากกา 3",
    price: 15,
    qty: 10,
    type: "normal",
    image: "/Image/Lan.jpg",
  },
]);

// ถ้าจะใช้ sortedProducts จริง ๆ
const sortedProducts = computed(() => {
  return productList.value; // หรือเขียน logic การจัดเรียงได้ที่นี่
});

const hotProducts = computed(() =>
  productList.value.filter((p) => p.type === "hot")
);
const sellProducts = computed(() =>
  productList.value.filter((p) => p.type === "sell")
);
const normalProducts = computed(() =>
  productList.value.filter((p) => p.type === "normal")
);
</script>

<template>
  <div>
    <!-- ✅ Wrapper element -->
    <!-- Navbar -->
    <div>
      <Navbar />
      <router-view />
    </div>

    <!-- ขายดี -->
    <div class="text-block"><h2 class="title">สินค้าขายดี</h2></div>
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
    <div class="text-block1"><h2 class="title">สินค้าลดราคา</h2></div>
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
    <div class="text-block1"><h2 class="title">สินค้าปกติ</h2></div>
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
  </div>
  <!-- 🔚 End wrapper -->
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f6f6f6;
  font-family: "Prompt", sans-serif;
  min-height: 100vh;
}
</style>

<style scoped>

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
  bottom: 20px; /* เปลี่ยนจาก top เป็น bottom */
  right: 20px;
  top: auto; /* ป้องกัน top ทับซ้อน */
  background-color: white;
  padding: 8px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
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
