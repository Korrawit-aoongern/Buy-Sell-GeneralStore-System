 <script setup>
import { ref } from "vue";
import adminaside from '~/components/admin/adminaside.vue'

const showNotifications = ref(false);

function toggleNotification() {
  showNotifications.value = !showNotifications.value;
}

const product = ref({
  id: 1,
  name: "หูฟัง",
  type: "หูฟัง",
  brand: "ไม่ระบุ",
  quantity: 2,
  price: 69.00,
  discount: 0,
  finalPrice: 69.00,
  showOnHomepage: false,
  image: "/no-image.jpg"
})
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

      <!-- Content -->
      <div class="content">
        <h2 class="title">รายละเอียดสินค้า</h2>
        <div class="product-header">
          <h3>#{{ product.id }} {{ product.name }}</h3>
          <div class="actions">
            <button class="btn-edit">แก้ไข</button>
            <button class="btn-delete">ลบ</button>
          </div>
        </div>

        <div class="product-detail">
          <!-- Left Column -->
          <div class="left">
            <div class="card">
              <h4>รายละเอียด</h4>
              <p><b>ชื่อสินค้า:</b> {{ product.name }}</p>
              <p><b>ยี่ห้อ:</b> {{ product.brand }}</p>
              <p><b>จำนวน:</b> {{ product.quantity }}</p>
            </div>

            <div class="card image-card">
              <h4>รูปสินค้า</h4>
              <img :src="product.image" alt="Product Image" />
            </div>
          </div>

          <!-- Right Column -->
          <div class="right">
            <div class="card">
              <h4>Type</h4>
              <p><b>หมวดหมู่สินค้า:</b> {{ product.type }}</p>
              <p><b>ประเภทการขาย:</b> {{ product.brand }}</p>
              <label>
                <input type="checkbox" v-model="product.showOnHomepage" />
                แสดงในหน้าหลัก
              </label>
            </div>

            <div class="card">
              <h4>ราคา</h4>
              <p><b>ราคา:</b> {{ product.price.toFixed(2) }}</p>
              <p><b>ส่วนลดพิเศษ:</b> {{ product.discount }}%</p>
              <p><b>ราคาหลังลด:</b> {{ product.finalPrice.toFixed(2) }}</p>
            </div>
          </div>
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

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.actions button {
  margin-left: 10px;
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-edit {
  background: #A6CE39;
  color: white;
}

.btn-delete {
  background: #D9534F;
  color: white;
}

.product-detail {
  display: flex;
  gap: 20px;
}

.left, .right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
}

.image-card img {
  width: 200px;
  border: 2px solid #007bff;
  border-radius: 5px;
  margin-top: 10px;
}
</style>
