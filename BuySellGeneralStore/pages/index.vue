<script setup>
import { ref, computed, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";
import Navbar from "~/components/UI/Navbar.vue";
import ProductCard from "~/components/Product/Product Card.vue";
import { useCartStore } from "~/stores/cart";

const cartStore = useCartStore();
const addToCart = cartStore.addToCart;

const productList = ref([]);

const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
);

onMounted(async () => {
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("is_featured", true)
  if (error) {
    console.error("Error loading products:", error);
  } else {
    productList.value = data;
  }
});

const hotProducts = computed(() =>
  productList.value.filter((p) => p.promotype === "hot")
);
const saleProducts = computed(() =>
  productList.value.filter((p) => p.promotype === "sale")
);
const normalProducts = computed(() =>
  productList.value.filter((p) => p.promotype === "normal")
);
const rowsVisible = ref({
  hot: 1,
  sale: 1,
  normal: 1,
});

const getVisibleProducts = (productsRef, key) =>
  computed(() => productsRef.value.slice(0, rowsVisible.value[key] * 3));

const hotVisible = getVisibleProducts(hotProducts, "hot");
const saleVisible = getVisibleProducts(saleProducts, "sale");
const normalVisible = getVisibleProducts(normalProducts, "normal");

function toggleShow(key, total) {
  if (rowsVisible.value[key] * 3 < total) {
    rowsVisible.value[key]++; // expand
  } else {
    rowsVisible.value[key] = 1; // collapse
  }
}
</script>

<template>
  <div>
    <div>
      <Navbar />
      <router-view />
    </div>
    <div class="shop-banner">
      <img src="/Image/Banner.svg" alt="shop-banner" />
    </div>

    <section id="Feature-Wrapper">
      <div class="Feature-Section">
        <span class="title">สินค้าขายดี</span>
        <div v-if="!productList.length">Loading products...</div>
        <div v-else class="product-Visible">
          <div class="product-list">
            <ProductCard
              v-for="(product, index) in hotVisible"
              :key="index"
              :id="product.productid"
              :name="product.nameproduct"
              :price="product.baseprice"
              :saleprice="product.saleprice"
              :qty="product.stock"
              :image="`Image/${product.imgurl}`"
              :promotype="product.promotype"
              @add-to-cart="() => addToCart(product)"
            />
          </div>
          <button
            v-if="hotProducts.length > 3"
            class="show-more-btn"
            @click="toggleShow('hot', hotProducts.length)"
          >
            {{ rowsVisible.hot * 3 < hotProducts.length ? 'ดูเพิ่มเติม' : 'ย่อ' }}
          </button>
        </div>
      </div>

      <div class="Feature-Section">
        <span class="title">สินค้าลดราคา</span>
        <div v-if="!productList.length">Loading products...</div>
        <div v-else class="product-Visible">
          <div class="product-list">
            <ProductCard
              v-for="(product, index) in saleVisible"
              :key="index" 
              :id="product.productid" 
              :name="product.nameproduct" 
              :originalprice="product.baseprice" 
              :saleprice="product.saleprice" 
              :qty="product.stock" 
              :image="`Image/${product.imgurl}`"
              :promotype="product.promotype"
              @add-to-cart="() => addToCart(product)"
            />
          </div>
          <button
            v-if="saleProducts.length > 3"
            class="show-more-btn"
            @click="toggleShow('sale', saleProducts.length)"
          >
            {{ rowsVisible.sale * 3 < saleProducts.length ? 'ดูเพิ่มเติม' : 'ย่อ' }}
          </button>
        </div>
      </div>

      <div class="Feature-Section">
        <span class="title">สินค้าปกติ</span>
        <div v-if="!productList.length">Loading products...</div>
        <div v-else class="product-Visible">
          <div class="product-list">
            <ProductCard
              v-for="(product, index) in normalVisible"
              :key="index"
              :id="product.productid"
              :name="product.nameproduct"
              :price="product.baseprice"
              :saleprice="product.saleprice"
              :qty="product.stock"
              :image="`Image/${product.imgurl}`"
              :promotype="product.promotype"
              @add-to-cart="() => addToCart(product)"
            />
          </div>
          <button
            v-if="normalProducts.length > 3"
            class="show-more-btn"
            @click="toggleShow('normal', normalProducts.length)"
          >
            {{ rowsVisible.normal * 3 < normalProducts.length ? 'ดูเพิ่มเติม' : 'ย่อ' }}
          </button>
        </div>
      </div>
    </section>

    <footer style="
        background-color: #6acc91;
        width: 100%;
        height: 500px;
        margin-top: 12em;
      "></footer>
  </div>
</template>
<style>
body {
  margin: 0;
  padding: 0;
  background-color: #FAFAF5;
  font-family: Prompt, sans-serif;
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
  width: 100%;
  margin-top: 60px;
}

.shop-banner img {
  width: 100%;
  object-fit: fill;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #111827;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 57px;
  margin-left: 2rem;
}
.product-Visible{
  display: flex;
  flex-direction: column;
}
.show-more-btn {
  align-self: center;
  margin-top: 30px;
  background: transparent;
  border: #6acc91 1px solid;
  padding: 0.7em 1.5em;
  border-radius: 4px;
  cursor: pointer;
  color: #6acc91;
  font-weight: bold;
  font-family: prompt, 'san-serif';
}

footer {
  flex-shrink: 0;
}
</style>
