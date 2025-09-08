<script setup>
import { ref } from "vue";
import ProductCard from "~/components/Product/Product Card.vue";
import ProductCardDiscount from "~/components/Product/Product Card-Discount.vue";
import Navbar from "~/components/UI/Navbar.vue";

import { useCart } from "~/composables/useCart"; // ✅ นำเข้า
import { createClient } from "@supabase/supabase-js"

const { addToCart } = useCart(); // ✅ ใช้งาน addToCart ได้เลย
const activePage = ref("Home");

const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
);

const setActive = (page) => {
  activePage.value = page;
};

const productList = ref([])

// โหลด product จาก DB
onMounted(async () => {
  const { data, error } = await supabase
    .from("product")
    .select("*")

  if (error) {
    console.error("Error loading products:", error)
  } else {
    productList.value = data
  }
})

// Computed filter
const hotProducts = computed(() =>
  productList.value.filter((p) => p.promotype === "hot")
)
const saleProducts = computed(() =>
  productList.value.filter((p) => p.promotype === "sale")
)
const normalProducts = computed(() =>
  productList.value.filter((p) => p.promotype === "normal")
)
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
          <div v-if="!productList.length">Loading products...</div>
          <div v-else>
          <div class="product-list">
            <ProductCard
              v-for="(product, index) in hotProducts"
              :key="index"
              :id="product.productid"
              :name="product.nameproduct"
              :price="product.baseprice"
              :qty="product.stock"
              :image="`Image/${product.imgurl}`"
              :promotype="product.promotype"
              @add-to-cart="addToCart(product)"
            />
          </div>
          </div>
        </div>

        <!-- สินค้าลดราคา -->
        <div class="Feature-Section">
          <span class="title">สินค้าลดราคา</span>
          <div v-if="!productList.length">Loading products...</div>
          <div v-else>
          <div class="product-list">
            <ProductCard
              v-for="(product, index) in saleProducts"
              :key="index"
              :id="product.productid"
              :name="product.nameproduct"
              :price="product.baseprice"
              :qty="product.stock"
              :image="`Image/${product.imgurl}`"
              :promotype="product.promotype"
              @add-to-cart="addToCart(product)"
            />
          </div>
          </div>
        </div>

        <!-- สินค้าปกติ -->
        <div class="Feature-Section">
          <span class="title">สินค้าปกติ</span>
          <div v-if="!productList.length">Loading products...</div>
          <div v-else>
          <div class="product-list">
            <ProductCard
              v-for="(product, index) in normalProducts"
              :key="index"
              :id="product.productid"
              :name="product.nameproduct"
              :price="product.baseprice"
              :qty="product.stock"
              :image="`Image/${product.imgurl}`"
              :promotype="product.promotype"
              @add-to-cart="addToCart(product)"
            />
          </div>
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
  margin-left: 103px;
  margin-right: 103px;
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
