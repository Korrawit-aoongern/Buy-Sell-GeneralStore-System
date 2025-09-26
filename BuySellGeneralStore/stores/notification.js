// stores/notification.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  // โหลดจาก localStorage แบบปลอดภัย
  let saved = []
  try {
    saved = JSON.parse(localStorage.getItem('notifications')) || []
  } catch (e) {
    saved = []
  }

  const notifications = ref(saved)
  const notificationCount = ref(notifications.value.filter(n => !n.is_read).length)

  function addNotification(n) {
    // กำหนด is_read ถ้าไม่มี
    if (n.is_read === undefined) n.is_read = false
    notifications.value.unshift(n)
    notificationCount.value = notifications.value.filter(x => !x.is_read).length
  }

  function clearCount() {
    notifications.value.forEach(n => n.is_read = true)
    notificationCount.value = 0
  }

  function setNotifications(arr) {
    notifications.value = arr.map(n => ({ ...n, is_read: n.is_read ?? false }))
    notificationCount.value = notifications.value.filter(n => !n.is_read).length
  }
function addNotification(n) {
  if (n.is_read === undefined) n.is_read = false
  if (!n.created_at) n.created_at = new Date().toISOString()
  
  // เพิ่ม notification ด้านบน
  notifications.value.unshift(n)
  
  // ตัดให้เหลือแค่ 7 รายการล่าสุด
  if (notifications.value.length > 7) {
    notifications.value = notifications.value.slice(0, 7)
  }

  // อัปเดต badge
  notificationCount.value = notifications.value.filter(x => !x.is_read).length
}

  // watch + deep = true แต่ไม่ให้ loop
  watch(notifications, (val) => {
    try {
      localStorage.setItem('notifications', JSON.stringify(val))
    } catch(e) {
      console.error("Cannot save notifications:", e)
    }
  }, { deep: true })

  return { notifications, notificationCount, addNotification, clearCount, setNotifications }
})
