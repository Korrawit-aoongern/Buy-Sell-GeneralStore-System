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
    <!-- Sidebar -->
    <adminaside />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Bar -->
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

      <!-- Page Title -->
      <div class="page-header">
        <h2>เพิ่มสินค้า</h2>
        <div class="actions">
          <button class="btn cancel">ยกเลิก</button>
          <button class="btn confirm">ยืนยัน</button>
        </div>
      </div>

      <!-- Form Grid -->
      <div class="form-grid">
        <!-- รายละเอียด -->
        <div class="form-section">
          <h3>รายละเอียด</h3>
          <label>ชื่อสินค้า</label>
          <input type="text" />
          <label>จำนวน</label>
          <input type="number" />
        </div>

        <!-- ประเภท -->
        <div class="form-section">
          <h3>Type</h3>
          <label>หมวดหมู่สินค้า</label>
          <input type="text" />
          <label>ประเภทการขาย</label>
          <input type="text" />
          <label style="display: flex; align-items: center;">
            <input type="checkbox" style="margin-right: 5px;" />
            แสดงในหน้าหลัก
          </label>
        </div>

        <!-- ราคา -->
        <div class="form-section">
          <h3>ราคา</h3>
          <label>ราคา</label>
          <input type="text" />
          <label>ส่วนลดในเปอร์เซ็น</label>
          <input type="text" />
          <label>ราคาหลังลด</label>
          <input type="text" />
        </div>

        <!-- อัปโหลดรูปภาพ -->
        <div class="form-section full-width">
          <h3>ใส่รูปสินค้า</h3>
          <div class="upload-box">
            <Icon name="mdi:upload" style="font-size: 32px;" />
            <p>ใส่รูปภาพ</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Prompt', sans-serif;
}

.dashboard-container {
  display: flex;
  height: 100vh;
}

/* Sidebar นำเข้าแล้วจาก <adminaside /> */

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  background-color: #f9f9f3;
}

/* Topbar */
.topbar {
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 0 20px;
  box-sizing: border-box;
}

.notification {
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
  z-index: 1000;
}

.notification-header {
  font-weight: bold;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.red-dot {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  margin-top: 5px;
  margin-right: 10px;
}

.notification-title {
  font-weight: bold;
  font-size: 14px;
}

.notification-desc {
  font-size: 13px;
  color: #555;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.cancel {
  background-color: #f44336;
  color: white;
}

.confirm {
  background-color: #4caf50;
  color: white;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.form-section {
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.form-section h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.form-section label {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
}

.form-section input[type="text"],
.form-section input[type="number"] {
  padding: 8px;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* Full width row for image upload */
.full-width {
  grid-column: span 3;
}

.upload-box {
  border: 1px dashed #999;
  padding: 40px;
  text-align: center;
  border-radius: 10px;
  color: #777;
  cursor: pointer;
}
</style>
