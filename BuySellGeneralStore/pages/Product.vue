<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import ProductPrice from "~/components/Product/ProductPrice.vue";

// Sidebar states
const showSidebar = ref(true);
const showPrice = ref(true);
const showType = ref(true);

// Filters
const categories = [
  "อาหาร",
  "ของใช้ในครัว",
  "ของใช้ในห้องน้ำ",
  "ของตกแต่งบ้าน",
  "ของใช้ส่วนตัว",
  "ของใช้วิเล็กทรอนิกส์",
  "ของใช้กลางแจ้ง",
  "ของใช้ในบ้านทั่วไป",
];
const priceRanges = [
  "ไม่จำกัด",
  "0.00 - 100.00",
  "100.00 - 500.00",
  "500.00 - 1,000.00",
  "มากกว่า 1,000.00",
];
const productTypes = ["ไม่จำกัด", "สินค้าลดราคา", "สินค้ามายด์", "สินค้าปกติ"];

const selectedPrice = ref("ไม่จำกัด");
const selectedType = ref("ไม่จำกัด");

// Search & Sort
const searchQuery = ref("");
const activeSort = ref("a-z");

// Product data
const products = ref([
  { name: "ดินสอ", price: 10, qty: 200 },
  { name: "ปากกา", price: 15, qty: 100 },
  { name: "แปรงฟัน", price: 49, qty: 10 },
  { name: "พร้อมที่ไทยถูขอบยาง", price: 99, qty: 1 },
  { name: "สายยาว 10 เมตร", price: 70, qty: 3 },
  { name: "สายแลน 20 เมตร", price: 240, qty: 2 },
  { name: "Acer Monitor EK220", price: 2690, qty: 2 },
  { name: "Gamesir T4W Wired", price: 790, qty: 3 },
  { name: "Keyboard Hatsune Miku", price: 1770, qty: 1 },
  { name: "MSI Optix G24C4", price: 4650, qty: 4 },
  { name: "OKER NOTEBOOK COOLER", price: 400, qty: 1 },
  { name: "razer basilisk v3 pro", price: 6317.5, qty: 1 },
]);

// Filter + Sort logic
const sortedProducts = computed(() => {
  let filtered = [...products.value];

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
  }

  // Sort
  if (activeSort.value === "a-z") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (activeSort.value === "z-a") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  return filtered;
});

// Sidebar toggle
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const togglePrice = () => (showPrice.value = !showPrice.value);
const toggleType = () => (showType.value = !showType.value);

// Route
const route = useRoute();
</script>
<template>
  <div class="page-wrapper">
    <!-- Navbar -->
    <nav class="navbar">
      <ul class="menu">
        <li>
          <router-link to="/home" :class="{ active: route.path === '/home' }">
            Home
          </router-link>
        </li>
        <li>
          <router-link to="/product" :class="{ active: route.path === '/product' }">
            Product
          </router-link>
        </li>
        <li>
          <router-link to="/order" :class="{ active: route.path === '/order' }">
            Order
          </router-link>
        </li>
      </ul>

      <div class="cart">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 3h1.5l1.5 13.5h12.75l1.5-9H6.75M16.5 21a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
        </svg>
      </div>
    </nav>

    <!-- Search + Sort Bar -->
    <div class="search-sort-wrapper">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="ค้นหาสินค้า..."
        class="search-input"
      />
      <div class="sort-wrapper">
        <label for="sort">จัดเรียงโดย</label>
        <select id="sort" v-model="activeSort">
          <option value="a-z">ก-ฮ A-Z</option>
          <option value="z-a">ฮ-ก Z-A</option>
        </select>
      </div>
    </div>

    <div class="page-container">
      <!-- Sidebar -->
      <aside v-show="showSidebar" class="sidebar">
        <button class="sidebar-toggle" @click="toggleSidebar">✕</button>

        <h3 class="sidebar-title">สินค้าทั้งหมด</h3>
        <ul class="category-list">
          <li v-for="(cat, i) in categories" :key="i">{{ cat }}</li>
        </ul>

        <div class="filter-group">
          <p class="filter-title" @click="togglePrice">▾ ราคาขั้นต่ำ</p>
          <div v-show="showPrice">
            <label v-for="(price, i) in priceRanges" :key="'price-' + i" class="radio-label">
              <input type="radio" v-model="selectedPrice" :value="price" />
              {{ price }}
            </label>
          </div>
        </div>

        <div class="filter-group">
          <p class="filter-title" @click="toggleType">▾ ประเภทสินค้า</p>
          <div v-show="showType">
            <label v-for="(type, i) in productTypes" :key="'type-' + i" class="radio-label">
              <input type="radio" v-model="selectedType" :value="type" />
              {{ type }}
            </label>
          </div>
        </div>
      </aside>

      <button v-if="!showSidebar" class="sidebar-toggle-open" @click="toggleSidebar">☰</button>

      <div :class="['main-content', { 'full-width': !showSidebar }]">
        <div class="product-list">
          <ProductPrice
            v-for="(item, index) in sortedProducts"
            :key="index"
            :name="item.name"
            :price="item.price"
            :qty="item.qty"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
  background-color: #4caf50;
  color: white;
  font-size: 1.1rem;
  user-select: none;
  box-shadow: 0 2px 5px rgb(0 0 0 / 0.1);
}

.menu {
  list-style: none;
  display: flex;
  gap: 24px;
}

.menu a {
  text-decoration: none;
  color: #333;
}

.menu a.active {
  font-weight: bold;
}

.cart {
  position: fixed;
  bottom: 20px;
  right: 20px;
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

/* 🔎 ตรงนี้คือส่วนจัดตำแหน่งช่องค้นหา + sort */
.search-sort-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 16px 20px;
}

.search-input {
  width: 300px;
  padding: 6px 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.sort-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Layout */
.page-container {
  display: flex;
}

.sidebar {
  width: 250px;
  border-right: 1px solid #ddd;
  padding: 16px;
}

.sidebar-toggle {
  float: right;
  cursor: pointer;
}

.sidebar-toggle-open {
  margin: 10px;
  cursor: pointer;
}

.main-content {
  flex: 1;
  padding: 16px;
}

.main-content.full-width {
  width: 100%;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}
</style>