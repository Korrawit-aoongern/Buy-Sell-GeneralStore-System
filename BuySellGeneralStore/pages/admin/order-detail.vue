<script setup>
import { ref } from "vue";
import adminaside from '~/components/admin/adminaside.vue'

const showNotifications = ref(false);
function toggleNotification() {
  showNotifications.value = !showNotifications.value;
}

// ตัวอย่างข้อมูลออเดอร์
const order = ref({
  id: 2001,
  status: "รอดำเนินการ",
  customer: {
    name: "สมชาย สมดี",
    address: "243 ซอยสันเนิน บ้านกลาง เมือง พิษณุโลก 65000",
    phone: "055059695"
  },
  payment: "ปลายทาง",
  items: [
    { name: "หูฟัง", qty: 2, price: 69, total: 138 },
    { name: "หูฟัง", qty: 2, price: 69, total: 138 }
  ],
  discount: 0
})

const totalPrice = () => {
  return order.value.items.reduce((sum, item) => sum + item.total, 0);
}
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

      <!-- Order Detail -->
      <div class="content">
        <h2 class="title">รายละเอียดออเดอร์</h2>
        <div class="order-header">
          <div>
            <p><b>Order:</b> #{{ order.id }}</p>
            <p><b>Status:</b> {{ order.status }}</p>
          </div>
          <div class="actions">
            <button class="btn-success">เสร็จสิ้นแล้ว</button>
            <button class="btn-warning">จัดส่ง</button>
            <button class="btn-danger">ยกเลิก</button>
          </div>
        </div>

        <div class="order-layout">
          <!-- Billing Address -->
          <div class="box">
            <h3>Billing Address</h3>
            <p><b>ชื่อ:</b> {{ order.customer.name }}</p>
            <p><b>ที่อยู่:</b> {{ order.customer.address }}</p>
            <p><b>เบอร์โทร:</b> {{ order.customer.phone }}</p>
          </div>

          <!-- Payment -->
          <div class="box">
            <h3>Payment Method</h3>
            <p>{{ order.payment }}</p>
          </div>

          <!-- Image -->
          <div class="box image-box">
            <img src="https://via.placeholder.com/200x200?text=No+image+available" alt="No image" />
          </div>
        </div>

        <!-- Table -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ชื่อสินค้า</th>
                <th>จำนวน</th>
                <th>ราคา</th>
                <th>ราคารวม</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in order.items" :key="index">
                <td>{{ item.name }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ item.price.toFixed(2) }}</td>
                <td>{{ item.total.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total -->
        <div class="summary">
          <p>ราคาทั้งหมด: <b>{{ totalPrice().toFixed(2) }} บาท</b></p>
          <p>ส่วนลด: <b>{{ order.discount.toFixed(2) }} บาท</b></p>
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
}

.notification {
  height: 32px;
  cursor: pointer;
}

/* Notification */
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

.notification-title {
  font-size: 14px;
  font-weight: bold;
}

.notification-desc {
  font-size: 13px;
  color: #555;
}

/* Content */
.content {
  padding: 20px;
}

.title {
  font-size: 20px;
  margin-bottom: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.actions button {
  margin-left: 10px;
  padding: 5px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-success {
  background: #4CAF50;
  color: white;
}
.btn-warning {
  background: #FFB300;
  color: white;
}
.btn-danger {
  background: #E53935;
  color: white;
}

.order-layout {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.box {
  flex: 1;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
}

.image-box img {
  max-width: 200px;
  margin: auto;
  display: block;
}

.table-container {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ddd;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  background: #4CAF50;
  color: white;
}

th, td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.summary {
  text-align: right;
  font-size: 16px;
}
</style>
