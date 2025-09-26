<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { createClient } from "@supabase/supabase-js";
import { useNotificationStore } from '~/stores/notification'
  

const config = useRuntimeConfig(); // ถ้าใช้ Nuxt
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey);

const showNotifications = ref(false);
const notificationStore = useNotificationStore(); // ใช้ store

// เปิด/ปิดแถบ Notification
function toggleNotification() {
  showNotifications.value = !showNotifications.value;

  // ถ้าเปิด popup แล้ว เคลียร์ตัวเลข badge
  if (showNotifications.value) {
    notificationStore.clearCount();
  }
}

onMounted(() => {
  // subscribe ฟัง event update ของตาราง product
  const channel = supabase
    .channel("low-stock")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "product" },
      (payload) => {
        const newStock = payload.new.stock;

        if (newStock <= 10) {
          notificationStore.addNotification({
            title: "สินค้าของคุณใกล้จะหมดสต๊อก",
            desc: `${payload.new.nameproduct} เหลือ ${newStock} ชิ้น`,
            is_read: false,
            created_at: new Date().toISOString()   // ✅ เพิ่ม timestamp
          });
        }
      }
    )
    .subscribe();

  // cleanup channel ตอนออกจาก component
  onBeforeUnmount(() => {
    supabase.removeChannel(channel);
  });
});
</script>

<template>
  <header class="topbar">
    <!-- ปุ่มแจ้งเตือน -->
    <div class="notification" @click="toggleNotification">
      <Icon
        name="material-symbols:notifications-rounded"
        style="color: black; width: 32px; height: 32px;"
      />
      <!-- Badge ตัวเลข -->
      <span v-if="notificationStore.notificationCount > 0" class="notification-badge">
        {{ notificationStore.notificationCount }}
      </span>
    </div>

    <!-- การ์ด Notification -->
    <div v-if="showNotifications" class="notification-card">
      <div class="notification-header">Notifications</div>
      <div class="notification-list">
        <div
          v-for="(n, i) in notificationStore.notifications"
          :key="i"
          class="notification-item"
        >
          <div class="red-dot" v-if="!n.is_read"></div>
          <div class="notification-text">
            <div class="notification-title">{{ n.title }}</div>
            <div class="notification-desc">{{ n.desc }}</div>
            <div class="notification-time">
              {{ n.created_at ? new Date(n.created_at).toLocaleString() : '' }}
            </div>
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
  position: relative;
}

.notification {
  position: relative;
  height: 32px;
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 50%;
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
