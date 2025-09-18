<script setup>
import { ref } from "vue";

const showNotifications = ref(false);

function toggleNotification() {
    showNotifications.value = !showNotifications.value;
}
</script>
<template>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <nav class="sidebar">
            <h1 class="sidebar-title">จัดการร้านค้า</h1>
            <ul class="menu">
                <li><router-link to="/admin/shop-info">แก้ไขข้อมูลพื้นฐาน</router-link></li>
                <li><router-link to="/admin/dashboard">หน้าหลัก</router-link></li>
                <li><router-link to="/admin/all-products">รายการสินค้า</router-link></li>
                <li><router-link to="/admin/add-product">เพิ่มสินค้า</router-link></li>
                <li><router-link to="/admin/product-detail">รายละเอียดสินค้า</router-link></li>
                <li><router-link to="/admin/all-orders">รายการออเดอร์</router-link></li>
                <li><router-link to="/admin/order-detail">รายละเอียดออเดอร์</router-link></li>
                <li><router-link to="/admin/all-customer">รายการลูกค้า</router-link></li>
                <li><router-link to="/admin/customer-detail">รายละเอียดลูกค้า</router-link></li>
            </ul>
        </nav>

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
            <div class="welcome">
                <h2>ยินดีต้อนรับ</h2>
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

/* Sidebar */
.sidebar {
    width: 250px;
    background-color: #597162;
    color: white;
    padding: 20px;
    box-sizing: border-box;
}

.sidebar-title {
    color: #6ACC91;
    font-weight: bold;
    margin-bottom: 30px;
    font-size: 24px;
    text-align: center;
}

.menu {
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    gap: 1em;
}

.menu li {
    margin-bottom: 15px;
}

.menu a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 16px;
    display: block;
    padding: 0.5em 1em;
}

.menu a:hover {
    background-color: #566a5e;
    border: 1px solid #8BAF99;
    border-radius: 10px;
    text-decoration: none;
    padding: 0.5em 1em;
}

/* Active state */
.menu a.router-link-exact-active {
    background-color: #4F6155;
    border: 1px solid #8BAF99;
    border-radius: 10px;
    padding: 0.5em 1em;
}

/* Main Content */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
}
.notification-card {
  position: absolute;
  top: 75px; /* 15px below icon */
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

.welcome {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.welcome h2 {
    font-size: 24px;
    color: black;
}
</style>
