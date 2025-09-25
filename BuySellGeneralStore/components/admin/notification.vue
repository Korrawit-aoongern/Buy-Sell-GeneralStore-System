<script setup>
const showNotifications = ref(false);

function toggleNotification() {
  showNotifications.value = !showNotifications.value;
}
</script>
<template>
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
</template>

<style scoped>
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.20);
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
</style>
