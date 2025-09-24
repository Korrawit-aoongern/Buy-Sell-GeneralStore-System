<script setup>
import { ref, computed } from "vue";
import adminaside from '~/components/admin/adminaside.vue'
import notification from "~/components/admin/notification.vue";



// ข้อมูลลูกค้าตัวอย่าง
const customers = ref([]);
for (let i = 1; i <= 500; i++) {
  customers.value.push({
    id: i,
    name: `ลูกค้า ${i}`,
    phone: "0123456789",
    address: "แม่กาจังหวัดพะเยา ประเทศไทย"
  });
}

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = 50;

const filteredCustomers = computed(() => {
  return customers.value.filter(c =>
    c.name.includes(searchQuery.value) ||
    c.phone.includes(searchQuery.value) ||
    c.address.includes(searchQuery.value)
  );
});

const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / pageSize));

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredCustomers.value.slice(start, start + pageSize);
});

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}
</script>

<template>
  <div class="dashboard-container">
    <adminaside />

    <div class="main-content">
      <notification/>

      <div class="content">
        <h2>รายการลูกค้า</h2>
        <input v-model="searchQuery" placeholder="ค้นหา..." class="search-box"/>

        <table class="customer-table">
          <thead>
            <tr>
              <th><input type="checkbox"/></th>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>เบอร์โทร</th>
              <th>ที่อยู่</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in paginatedCustomers" :key="customer.id">
              <td><input type="checkbox"/></td>
              <td>{{ customer.id }}</td>
              <td>{{ customer.name }}</td>
              <td>{{ customer.phone }}</td>
              <td>{{ customer.address }}</td>
            </tr>
          </tbody>
        </table>

        <!-- pagination -->
        <div class="pagination">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">‹</button>

          <button
            v-for="page in totalPages"
            :key="page"
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>

          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">›</button>

          <span class="summary">
            แสดงสินค้า {{ (currentPage - 1) * pageSize + 1 }}
            -
            {{ Math.min(currentPage * pageSize, filteredCustomers.length) }}
            จาก {{ filteredCustomers.length }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.dashboard-container {
  display: flex;
  height: 100vh;
}
.main-content {
  flex: 1;
  padding: 20px;
}
.customer-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}
.customer-table th, .customer-table td {
  border-bottom: 1px solid #ccc;
  padding: 8px 10px;
  text-align: left;
}
.search-box {
  width: 200px;
  padding: 5px 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.pagination button {
  padding: 5px 10px;
  border: none;
  background-color: #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.pagination .active {
  background-color: #597162;
  color: white;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.summary {
  margin-left: auto;
  font-size: 14px;
  color: #555;
}
</style>
