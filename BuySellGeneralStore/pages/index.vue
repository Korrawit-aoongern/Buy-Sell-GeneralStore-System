<template>
  <div class="page-wrapper">
    <!-- Navbar -->
    <nav class="navbar">
      <ul class="menu">
        <li><router-link to="/" active-class="active">Home</router-link></li>
        <li><router-link to="/product" active-class="active">Product</router-link></li>
        <li><router-link to="/order" active-class="active">Order</router-link></li>
      </ul>

      <div class="cart">🛒</div>
    </nav>

    <div class="page-container">
      <!-- Sidebar -->
      <aside v-show="showSidebar" class="sidebar">
        <!-- ปุ่ม toggle อยู่มุมขวาบน sidebar -->
        <button class="sidebar-toggle" @click="toggleSidebar">✕ ปิดแถบเมนู</button>

        <h3 class="sidebar-title">สินค้าทั้งหมด</h3>
        <ul class="category-list">
          <li v-for="(cat, i) in categories" :key="i">{{ cat }}</li>
        </ul>

        <!-- ราคา -->
        <div class="filter-group">
          <p class="filter-title" @click="togglePrice">▾ ราคาขั้นต่ำ</p>
          <div v-show="showPrice">
            <label
              v-for="(price, i) in priceRanges"
              :key="'price-' + i"
              class="radio-label"
            >
              <input type="radio" v-model="selectedPrice" :value="price" />
              {{ price }}
            </label>
          </div>
        </div>

        <!-- ประเภทสินค้า -->
        <div class="filter-group">
          <p class="filter-title" @click="toggleType">▾ ประเภทสินค้า</p>
          <div v-show="showType">
            <label
              v-for="(type, i) in productTypes"
              :key="'type-' + i"
              class="radio-label"
            >
              <input type="radio" v-model="selectedType" :value="type" />
              {{ type }}
            </label>
          </div>
        </div>
      </aside>

      <!-- ปุ่ม toggle sidebar เมื่อ sidebar ปิด -->
      <button
        v-if="!showSidebar"
        class="sidebar-toggle-open"
        @click="toggleSidebar"
        aria-label="เปิดแถบเมนู"
      >
        ☰ เปิดแถบเมนู
      </button>

      <!-- Main Content -->
      <div :class="['main-content', { 'full-width': !showSidebar }]">
        <!-- Sort Dropdown -->
        <div class="sort-bar">
          <label>จัดเรียงโดย</label>
          <select v-model="activeSort" class="select">
            <option value="a-z">ก-ฮ A-Z</option>
            <option value="z-a">ฮ-ก Z-A</option>
          </select>
        </div>

        <!-- Product Grid -->
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

<script setup>
import { ref, computed } from "vue";
import ProductPrice from "~/components/Product/ProductPrice.vue";

// ตัวอย่างสินค้า
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

const showPrice = ref(true);
const showType = ref(true);

const togglePrice = () => {
  showPrice.value = !showPrice.value;
};
const toggleType = () => {
  showType.value = !showType.value;
};

const activeSort = ref("a-z");

const sortedProducts = computed(() => {
  const sorted = [...products.value];
  if (activeSort.value === "a-z") {
    return sorted.sort((a, b) => a.name.localeCompare(b.name, "th"));
  } else if (activeSort.value === "z-a") {
    return sorted.sort((a, b) => b.name.localeCompare(a.name, "th"));
  }
  return sorted;
});

const showSidebar = ref(true);
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fafaf5;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  user-select: none;
  box-shadow: 0 2px 5px rgb(0 0 0 / 0.1);
  z-index: 1000;
}

/* Menu */
.menu {
  list-style: none;
  display: flex;
  gap: 30px;
  padding: 0;
  margin: 0;
}

.menu a {
  color: white;
  text-decoration: none;
  font-weight: 400;
}

.menu a.active {
  font-weight: 700;
  text-decoration: underline;
}

/* Cart icon */
.cart {
  font-size: 24px;
}

/* Container ที่ครอบ sidebar + main content */
.page-container {
  display: flex;
  flex: 1;
  position: relative;
  padding: 20px;
}

/* Sidebar */
.sidebar {
  position: relative;
  width: 250px;
  background-color: white;
  border: 1px solid #ccc;
  padding: 20px;
  margin-left: 20px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

/* ปุ่ม toggle sidebar อยู่มุมขวาบนของ sidebar */
.sidebar-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #e53935;
  border: none;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
}

/* ปุ่มเปิด sidebar เมื่อ sidebar ปิด */
.sidebar-toggle-open {
  position: absolute;
  left: 20px;
  top: 80px; /* กำหนดตำแหน่งใต้ navbar */
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  z-index: 100;
}

/* Main content */
.main-content {
  flex: 1;
  padding: 0 20px;
  transition: all 0.3s ease;
}

.main-content.full-width {
  margin-left: 0;
}

/* Sort */
.sort-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
}

.select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  appearance: none;
}

/* Product grid */
.product-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* Category list */
.category-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.category-list li {
  margin-bottom: 6px;
}

/* Filter group */
.filter-group {
  margin-bottom: 20px;
}

.filter-title {
  font-weight: bold;
  margin-bottom: 8px;
  cursor: pointer;
}

.radio-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 1024px) {
  .product-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    margin-left: 0;
    margin-bottom: 20px;
    position: relative;
    box-shadow: none;
    border-radius: 0;
  }

  .sidebar-toggle,
  .sidebar-toggle-open {
    position: fixed;
    top: 12px;
    right: 12px;
    z-index: 1001;
  }

  .main-content {
    padding: 0 10px;
  }

  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .product-list {
    grid-template-columns: 1fr;
  }
}
</style>
