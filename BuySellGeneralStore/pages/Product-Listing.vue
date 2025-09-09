<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import ProductCard from "~/components/Product/Product Card.vue";
import Navbar from "~/components/UI/Navbar.vue";
import { useCart } from "~/composables/useCart"; // ✅ นำเข้า

import { createClient } from "@supabase/supabase-js"

const productList = ref([])
const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
);

const { addToCart } = useCart(); // ✅ ใช้งาน addToCart ได้เลย
const accentColor = "#6ACC91";
const btnWidth = 220;

const sortOptions = [
  { value: "az", label: "ก-ฮ A-Z" },
  { value: "za", label: "ฮ-ก Z-A" },
  { value: "priceLowHigh", label: "ราคาต่ำไปสูง" },
  { value: "priceHighLow", label: "ราคาสูงไปต่ำ" },
];
const categories = [
  { label: "อาหาร", value: "foods" },
  { label: "เครื่องเขียน", value: "stationary" },
  { label: "ของใช้ในครัว", value: "kitchen" },
  { label: "ของใช้ในห้องนํ้า", value: "bathroom" },
  { label: "ของตกแต่งบ้าน", value: "decoration" },
  { label: "ของใช้ส่วนตัว", value: "personal" },
  { label: "เทคโนโลยี", value: "technology" },
  { label: "ของใช้กลางแจ้ง", value: "outdoors" },
  { label: "ของใช้ในบ้านทั่วไป", value: "general" },
];
const priceRanges = [
  { label: "ไม่จำกัด", value: "all" },
  { label: "0.00 - 100.00", value: "0-100" },
  { label: "100.00 - 500.00", value: "100-500" },
  { label: "500.00 - 1,000.00", value: "500-1000" },
  { label: "มากกว่า 1,000.00", value: "1000+" },
];
const promoTypes = [{ label: "ไม่จำกัด", value: "all" },
  { label: "สินค้าลดราคา", value: "sale" },
  { label: "สินค้าขายดี", value: "hot" },
  { label: "สินค้าปกติ", value: "normal" },
];

const selectedSort = ref(sortOptions[0]?.value || "az");
const isOpen = ref(false);
const showPanel = ref(false);

const activeCategory = ref(null); // null = "all"
const activePrice = ref("all");
const activePromo = ref("all");
const pressAll = ref(false);

const clearFilters = () => {
  activeCategory.value = null;
  activePrice.value = "all";
  activePromo.value = "all";
};

const setCategory = (cat) => {
  activeCategory.value = cat === activeCategory.value ? null : cat;
};


const filteredProducts = computed(() => {
  return productList.value.filter(p => {
    if (activeCategory.value && p.categorytype !== activeCategory.value) return false;

    switch (activePrice.value) {
      case "0-100": if (!(p.baseprice >= 0 && p.baseprice <= 100)) return false; break;
      case "100-500": if (!(p.baseprice >= 100 && p.baseprice <= 500)) return false; break;
      case "500-1000": if (!(p.baseprice >= 500 && p.baseprice <= 1000)) return false; break;
      case "1000+": if (!(p.baseprice > 1000)) return false; break;
    }

    if (activePromo.value !== "all" && p.promotype !== activePromo.value) return false;

    return true;
  });
});


const sortedProducts = computed(() => {
  const products = [...filteredProducts.value]
  switch (selectedSort.value) {
    case "az": return products.sort((a, b) => a.nameproduct.localeCompare(b.nameproduct, 'th'))
    case "za": return products.sort((a, b) => b.nameproduct.localeCompare(a.nameproduct, 'th'))
    case "priceLowHigh": return products.sort((a, b) => (a.saleprice ?? a.baseprice) - (b.saleprice ?? b.baseprice))
    case "priceHighLow": return products.sort((a, b) => (b.saleprice ?? b.baseprice) - (a.saleprice ?? a.baseprice))
    default: return products
  }
})

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}
function selectOption(option) {
  selectedSort.value = option.value;
  isOpen.value = false;
}

// close when clicking outside
function handleClickOutside(e) {
  const selector = document.querySelector(".select-wrapper");
  if (selector && !selector.contains(e.target)) {
    isOpen.value = false;
  }
}
onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);

/* interactions */
const togglePanel = () => {
  showPanel.value = !showPanel.value;
};

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

</script>

<template>

  <div style="display: flex; flex-direction: column">
    <!-- Sidebar (Filter) -->
    <div class="page">
      <div style="display: flex; flex-direction: row">
        <div class="accent-strip" :style="{ background: accentColor }">
          <button class="accent-btn" :class="{ open: showPanel }" @click="togglePanel" :aria-expanded="showPanel">
            ☰
          </button>
        </div>
        <aside class="panel" :class="{ open: showPanel }" :style="{ '--btn-width': btnWidth + 'px' }">
          <!-- All product filter button at top -->
          <div class="panel-top">
            <button class="all-button"
              :class="{ active: activeCategory === null && activePrice === 'all' && activePromo === 'all' }"
              @click="clearFilters" @mousedown.prevent="pressAll = true" @mouseup="pressAll = false"
              @mouseleave="pressAll = false">
              สินค้าทั้งหมด
            </button>
          </div>

          <!-- Category Filter -->
          <section class="group category-group">
            <div class="category-list">
              <div v-for="(cat, i) in categories" :key="i" class="category-item"
                :class="{ active: activeCategory === cat.value }" @click="setCategory(cat.value)">
                {{ cat.label }}
              </div>
            </div>
          </section>

          <!-- Price Filter -->
          <section class="group price-group">
            <div class="group-head">
              <span class="triangle"></span>
              <span class="group-head-text">ราคาขั้นต่ำ</span>
            </div>

            <div class="radios" role="radiogroup" aria-label="price range">
              <label v-for="(r, idx) in priceRanges" :key="idx" class="radio-row">
                <input type="radio" name="price" :value="r.value" v-model="activePrice" />
                <span class="radio-label">{{ r.label }}</span>
              </label>
            </div>
          </section>

          <!-- Promo Filter -->
          <section class="group promo-group">
            <div class="group-head">
              <span class="triangle"></span>
              <span class="group-head-text">ประเภทสินค้า</span>
            </div>

            <div class="radios" role="radiogroup" aria-label="promo type">
              <label v-for="(p, idx) in promoTypes" :key="idx" class="radio-row">
                <input type="radio" name="promo" :value="p.value" v-model="activePromo" />
                <span class="radio-label">{{ p.label }}</span>
              </label>
            </div>
          </section>
        </aside>
      </div>

      <!-- Main Content -->
      <main :class="{ shrink: showFilterTab }" class="content">
        <!-- Navbar -->
        <div>
          <Navbar />
          <router-view />
        </div>
        <!-- Search and Sort -->
        <div class="top-bar">
          <div class="search-bar">
            <Icon name="material-symbols:search" style="color: black; width: 2em; height: 2em" />
            <input type="text" />
          </div>
          <div class="sort-dropdown">
            <label class="sort-label">จัดเรียงโดย</label>

            <!-- custom dropdown -->
            <div class="select-wrapper" @click="toggleDropdown">
              <div style="display: flex; align-items: center">
                <div class="selected">
                  {{sortOptions?.find(opt => opt.value === selectedSort)?.label || "จัดเรียง"}}
                </div>
                <Icon name="material-symbols:keyboard-arrow-down" class="arrow" :class="{ open: isOpen }" />
              </div>

              <ul v-if="isOpen" class="select-option">
                <li v-for="option in sortOptions" :key="option.value" :class="{ active: option.value === selectedSort }"
                  @mousedown.stop="selectOption(option)">
                  <span>{{ option.label }}</span>
                  <Icon v-if="option.value === selectedSort" name="material-symbols:check" class="check-icon" />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Product list -->
        <div class="product-list">
          <ProductCard v-for="(product, index) in sortedProducts"
          :id="product.productid"
          :key="index"
          :name="product.nameproduct"
          :price="product.promotype === 'sale' ? product.saleprice : product.baseprice"
          :originalprice="product.baseprice"
          :saleprice="product.saleprice"
          :qty="product.stock"
          :image="`Image/${product.imgurl}`"
          :promotype="product.promotype"
          @add-to-cart="addToCart(product)" />
        </div>
      </main>
    </div>
    <footer style="background-color: #6acc91; width: 100%; height: 500px"></footer>
  </div>
</template>
<style>
body {
  margin: 0;
  padding: 0;
  background-color: #fafaf5;
  font-family: "Prompt", sans-serif;
  min-height: 100vh;
}
</style>
<style scoped>
:root {
  --accent: #6acc91;
  --accent-dark: #57b97b;
  --accent-text: #111827;
  --panel-gap: 12px;
}

.page {
  display: flex;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #fafaf5;
}

.accent-strip {
  width: 50px;
  min-width: 50px;
  height: 100vh;
  margin-top: 50px;
  position: sticky;
  left: 0;
  top: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1200;
}

.accent-btn {
  margin-top: 20px;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #111827;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accent-btn.open {
  color: #eff1f3;
}

/* Sidebar */
.panel {
  left: 50px;
  top: 0;
  min-height: 100vh;
  scrollbar-width: none;
  background: #f6f6f6;
  box-shadow: none;
  width: 0;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  transition: width 300ms ease;
  z-index: 1150;
  flex: 1;
  overflow-y: auto;
}

.panel.open {
  width: calc(var(--btn-width) + 20px);
}

/* Panel top area holds the All product button */
.panel-top {
  display: flex;
  align-items: center;
  width: 240px;
  padding: 0;
  background-color: #f6f6f6;
}

/* All product filter button */
.all-button {
  font-family: "Prompt", sans-serif;
  width: var(--btn-width);
  height: 45px;
  background-color: #f6f6f6;
  border: 4px solid #6acc91;
  border-top-right-radius: 20px;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  transition: background-color 300ms ease-out, color 300ms ease-out,
    font-weight 200ms;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

/* hover -> background to accent */
.all-button:hover {
  background-color: #6acc91;
  color: #111827;
}

/* pressed/active -> text white + bold */
.all-button.active,
.all-button:active {
  background-color: #6acc91;
  color: #fff;
  font-weight: 700;
}

/* panel body: everything below top button */
.panel-body {
  padding-top: 18px;
  box-sizing: border-box;
  width: calc(var(--btn-width) + 20px);
}

/* GROUPS (category, price, promo) */
.group {
  margin-bottom: 24px;
}

/* group title for category - centered container below the button */
.category-group .category-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  width: 201px;
  /* item width depends on this, as requested */
  margin-top: 8px;
  /* centered */
}

/* Category item styles */
.category-item {
  width: 201px;
  height: 22px;
  padding: 5px;
  padding-left: 20px;
  background: transparent;
  color: #111827;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 200ms ease, color 200ms ease, font-weight 200ms;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  /* create only top-right & bottom-right radius on hover */
}

.category-item:hover {
  background: #6acc91;
  color: #111827;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.category-item.active {
  background: #6acc91;
  color: #fff;
  font-weight: 700;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* Group title style for price / promo */
.group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 195px;
  padding: 18px 18px 21px;
  box-sizing: border-box;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 11px solid #cfcfcf;
  transform: rotate(0deg);
}

.group-head-text {
  font-size: 16px;
  color: #111827;
  font-weight: 400;
}

/* Radio rows (price & promo lists) */
.radios {
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 18px;
  box-sizing: border-box;
}

.radio-row {
  display: flex;
  align-items: center;
  gap: 10px;
  height: fit-content;
  font-size: 16px;
  color: #111827;
  font-weight: 300;
  cursor: pointer;
}

.radio-row input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 17px;
  height: 17px;
  border: 2px solid #6acc91;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  outline: none;
}

/* inner dot */
.radio-row input[type="radio"]::after {
  content: "";
  width: 9px;
  height: 9px;
  background: #6acc91;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s ease-in-out;
}

/* when checked → show the dot */
.radio-row input[type="radio"]:checked::after {
  transform: translate(-50%, -50%) scale(1);
}

/* Main content */
.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  transition: margin-left 0.3s ease;
}

.content.shrink {
  margin-left: 280px;
}

.cart-icon {
  position: absolute;
  right: 0;
  margin-right: 166px;
  font-size: 24px;
  color: #111827;
}

/* Search + Sort */
.top-bar {
  display: flex;
  justify-content: flex-end;
  padding: 79px 1.7rem 35px 216px;
  align-items: flex-end;
  gap: 48px;
}

.search-bar {
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 11px;
  justify-self: center;
  max-width: 448px;
  width: 100%;
  border-radius: 30px;
  padding: 5px;
}

.search-bar input {
  width: 100%;
  background-color: #ececec;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 0px solid transparent;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-bar input:focus {
  border: 1px solid #3cb371;
}

.sort-dropdown {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: Prompt, sans-serif;
  color: #999;
  width: 252px;
  margin-right: 60px;
  margin-left: 90px;
}

.sort-label {
  font-size: 12px;
  font-weight: 100;
  color: #999;
}

.select-wrapper {
  position: relative;
  background-color: #fafaf5;
  border-radius: 9px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  user-select: none;
}

.selected {
  flex: 1;
  padding: 10px 36px 10px 16px;
  font-size: 12px;
  color: #111827;
}

.arrow {
  margin-right: 12px;
  color: #6acc91;
  pointer-events: none;
  width: 1.5em;
  height: 1.5rem;
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(90deg);
}

/* fake dropdown list */
.select-option {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
  background: #fafaf5;
  border-radius: 9px;
  font-weight: 100;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 20;
}

.select-option li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 100;
  cursor: pointer;
  color: #111827;
  transition: background-color ease 0.3s;
}

.select-option li:hover {
  background: #f3f3ee;
}

.select-option li.active {
  font-weight: 500;
  background: #eaeae7;
}

.check-icon {
  color: #6acc91;
  width: 1rem;
  height: 1.5rem;
}

/* Product grid */
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 32px 18px;
  padding-left: 5rem;
  padding-bottom: 5rem;
}

footer {
  flex-shrink: 0;
}
</style>
