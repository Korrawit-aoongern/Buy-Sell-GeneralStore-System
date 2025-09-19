<script setup>
import { ref } from 'vue'
import adminaside from '~/components/admin/adminaside.vue'

const showNotifications = ref(false)

function toggleNotification() {
  showNotifications.value = !showNotifications.value
}
</script>

<template>
  <div class="dashboard-container">
    <!-- ✅ ใช้ Sidebar ที่แยกออกมา -->
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

      <div class="product-list">
        <h2>รายการสินค้า</h2>

        <div class="search-bar">
          <input type="text" placeholder="ค้นหา..." />
        </div>

        <table class="product-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>ราคา</th>
              <th>ลดเหลือ</th>
              <th>จำนวนสต็อก</th>
              <th>ประเภทการขาย</th>
              <th>หมวดหมู่</th>
              <th>แสดงในหน้าหลัก</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="checkbox" /></td>
              <td>1</td>
              <td>หูฟัง</td>
              <td>69.00</td>
              <td>69.00</td>
              <td>2</td>
              <td>ธรรมดา</td>
              <td>เทคโนโลยี</td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>2</td>
              <td>มะหมี่กึ่งสำเร็จรูป</td>
              <td>12.00</td>
              <td>10.00</td>
              <td>987</td>
              <td>ลดราคา</td>
              <td>อาหาร</td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>3</td>
              <td>กระต่ายน้อย</td>
              <td>80.00</td>
              <td>80.00</td>
              <td>1098</td>
              <td>ขายดี</td>
              <td>ของใช้</td>
              <td><input type="checkbox" /></td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button>&lt;</button>
          <button class="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>&gt;</button>
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

/* main content remains */
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

.product-list {
  padding: 20px;
  background-color: #f7f7f7;
  flex: 1;
}

.search-bar {
  margin-bottom: 10px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.product-table th,
.product-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
}

.product-table th {
  background-color: #f0f0f0;
}

.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
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
</style>
