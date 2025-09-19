<script setup>
import { ref } from "vue";
import adminaside from '~/components/admin/adminaside.vue'

const showNotifications = ref(false);

function toggleNotification() {
  showNotifications.value = !showNotifications.value;
}

const orders = ref([
  { id: 1, billId: "6fd94294aeed7f89", status: "ยกเลิก", date: "2025-09-16 22:25:17", total: 250.00, payment: "ปลายทาง" },
  { id: 4, billId: "805cda85d02c47b3", status: "รอดำเนินการ", date: "2025-09-16 22:27:47", total: 59.00, payment: "Prompt Pay" },
  { id: 5, billId: "f04d5aab5473ba6", status: "จัดส่ง", date: "2025-09-17 21:54:44", total: 250.00, payment: "ปลายทาง" },
  { id: 6, billId: "d112fa34daf4516ff2", status: "เสร็จสิ้น", date: "2025-09-18 20:14:31", total: 177.00, payment: "Prompt Pay" }
])
</script>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <adminaside />

    <!-- Main Content -->
    <div class="main-content">
      <header class="topbar">
        <div class="notification" @click="toggleNotification">
          <Icon name="material-symbols:notifications-rounded" style="color: black; width: 32px; height: 32px;" />
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
            <div class="notification-item">
              <div class="red-dot"></div>
              <div class="notification-text">
                <div class="notification-title">คำสั่งซื้อใหม่</div>
                <div class="notification-desc">ออเดอร์ #1234 รอการยืนยัน</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Order List -->
      <div class="content">
        <h2 class="title">รายการออเดอร์</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>รหัส</th>
                <th>บิลไอดี</th>
                <th>สถานะ</th>
                <th>วันที่ทำรายการ</th>
                <th>ราคารวม</th>
                <th>วิธีชำระ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td><input type="checkbox" /></td>
                <td>{{ order.id }}</td>
                <td>{{ order.billId }}</td>
                <td>{{ order.status }}</td>
                <td>{{ order.date }}</td>
                <td>{{ order.total.toFixed(2) }}</td>
                <td>{{ order.payment }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button>&lt;</button>
          <button class="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>&gt;</button>
          <span>แสดงสินค้า 1 - 50 จาก 500</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: 'prompt', sans-serif;
}

.dashboard-container {
  display: flex;
  height: 100vh;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.topbar {
  height: 60px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.notification {
  height: 32px;
  cursor: pointer;
}

.notification-card {
  position: absolute;
  top: 75px;
  right: 20px;
  background: #fff;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 1000;
}

.notification-header {
  font-size: 14px;
  font-weight: bold;
  padding: 10px 15px;
  border-bottom: 1px solid #E5E5E5;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 15px;
  border-bottom: 1px solid #E5E5E5;
}

.red-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  margin-top: 5px;
  margin-right: 10px;
}

.notification-text {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.notification-desc {
  font-size: 13px;
  color: #555;
}

.content {
  padding: 20px;
}

.title {
  font-size: 20px;
  margin-bottom: 15px;
}

.table-container {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ddd;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  background: #f9f9f9;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.pagination {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.pagination button {
  border: 1px solid #ccc;
  background: white;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.pagination .active {
  background: #333;
  color: #fff;
}

.pagination span {
  margin-left: auto;
  font-size: 13px;
  color: #666;
}
</style>
