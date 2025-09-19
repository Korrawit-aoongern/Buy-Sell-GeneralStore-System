<script setup>
import { ref } from "vue";
import adminaside from '~/components/admin/adminaside.vue'

const showNotifications = ref(false);
function toggleNotification() {
  showNotifications.value = !showNotifications.value;
}

// ข้อมูลลูกค้าตัวอย่าง
const customers = ref([
  { id: 1, name: "ชื่อจริง นามสกุล", phone: "0123456789", address: "แม่กาจังหวัดพะเยา ประเทศไทย" },
  { id: 2, name: "ชื่อจริง นามสกุล", phone: "0123456789", address: "แม่กาจังหวัดพะเยา ประเทศไทย" },
  { id: 3, name: "ชื่อจริง นามสกุล", phone: "0123456789", address: "แม่กาจังหวัดพะเยา ประเทศไทย" },
]);

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

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredCustomers.value.slice(start, start + pageSize);
});
</script>

<template>
  <div class="dashboard-container">
    <adminaside />

    <div class="main-content">
      <header class="topbar">
        <div class="notification" @click="toggleNotification">
          <Icon name="material-symbols:notifications-rounded" style="width:32px;height:32px;color:black;" />
        </div>
        <div v-if="showNotifications" class="notification-card">
          <div class="notification-header">Notifications</div>
          <div class="notification-list">
            <div class="notification-item">
              <div class="red-dot"></div>
              <div class="notification-text">
                <div class="notification-title">สินค้าของคุณใกล้จะหมดสต๊อก</div>
                <div class="notification-desc">หูฟังเหลือ 1 ชิ้น</div>
              </div>
            </div>
          </div>
        </div>
      </header>

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

        <div class="pagination">
          <button @click="currentPage = Math.max(currentPage - 1, 1)">‹</button>
          <span>หน้า {{ currentPage }}</span>
          <button @click="currentPage++">›</button>
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
  margin-top: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
}
</style>
