<script setup>
import { ref } from "vue";
import ProductCard from "~/components/Product/Product Card.vue";
import ProductCardDiscount from "~/components/Product/Product Card-Discount.vue";
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
    <div>
      <Navbar />
      <router-view />
    </div>

    <div style="display: flex; flex-direction: column;">
    <div class="shop-banner">
      <img src="/Image/Banner.svg" alt="shop-banner">
    </div>
    <section id="Feature-Wrapper">
     <!-- ขายดี -->
      <div class="Feature-Section">
        <span class="title">สินค้าขายดี</span>
        <div class="product-list">
          <ProductCard
            v-for="(product, index) in hotProducts"
            :key="index"
            :name="product.name"
            :price="product.price"
            :qty="product.qty"
            :image="product.image"
            :type="product.type"
          />
        </div>
      </div>


    <!-- ลดราคา -->
      <div class="Feature-Section">
        <span class="title">สินค้าลดราคา</span>
        <div class="product-list">
          <ProductCardDiscount
            v-for="(product, index) in sellProducts"
            :key="index"
            :name="product.name"
            :price="product.price"
            :originalPrice="product.originalPrice"
            :qty="product.qty"
            :image="product.image"
            :type="product.type"
          />
        </div>
      </div>

    <!-- ปกติ -->
      <div class="Feature-Section">
        <span class="title">สินค้าปกติ</span>
        <div class="product-list">
          <ProductCard
            v-for="(product, index) in normalProducts"
            :key="index"
            :name="product.name"
            :price="product.price"
            :qty="product.qty"
            :image="product.image"
            :type="product.type"
          />
        </div>
      </div>
    </section>
    <footer style="background-color: #6acc91; width: 100%; height: 500px; margin-top: 12em;"></footer>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #FAFAF5;
  font-family: "Prompt", sans-serif;
  min-height: 100vh;
}
</style>

<style scoped>
#Feature-Wrapper {
  display: flex;
  flex-direction: column; 
  margin-top: 46px;
  margin-left: 2rem;
  gap: 112px;
}
.Feature-Section {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  gap: 15px;
  margin-left: 2rem;
}
.shop-banner {
  width: 100vw;
  margin-top: 60px;
}
.shop-banner img {
  width: 100vw;
  object-fit: fill;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #111827;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 57px;
  margin-left: 2rem;
}
footer {
  flex-shrink: 0;
}
</style>
