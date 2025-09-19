<script setup>
import { ref } from "vue";
import adminaside from '~/components/admin/adminaside.vue'
const showNotifications = ref(false);

function toggleNotification() {
    showNotifications.value = !showNotifications.value;
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
