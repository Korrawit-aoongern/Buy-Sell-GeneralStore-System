<script setup>
import { ref } from "vue";
import adminaside from '~/components/admin/adminaside.vue'
const showNotifications = ref(false);
const isEditing = ref(false);

// ข้อมูลจริง
const storeData = ref({
  name: "The General Store",
  phone: "0123456789",
  address: "แม่กา อำเภอเมืองพะเยา พะเยา ประเทศไทย",
  qrCode: "/Image/PromptPay.png",
});

// ข้อมูลที่แก้ไข
const editData = ref({ ...storeData.value });

const toggleNotification = () => {
  showNotifications.value = !showNotifications.value;
};

const cancelEdit = () => {
  isEditing.value = false;
  editData.value = { ...storeData.value }; // คืนค่าเดิม
};

const saveData = () => {
  storeData.value = { ...editData.value }; // บันทึกค่าใหม่
  isEditing.value = false;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    editData.value.qrCode = URL.createObjectURL(file);
  }
};


</script>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <adminaside />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Topbar -->
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
        <h1 class="page-title">แก้ไขข้อมูลพื้นฐาน</h1>
        <div class="card">
        
        
          <!-- โหมด View -->
          <div v-if="!isEditing" class="info">
            <button class="edit-btn" @click="isEditing = true">แก้ไข</button>
            <p><strong>ชื่อ</strong><br />{{ storeData.name }}</p>
            <p><strong>เบอร์โทร</strong><br />{{ storeData.phone }}</p>
            <p><strong>ที่อยู่</strong><br />{{ storeData.address }}</p>
            <p><strong>QR Code</strong></p>
            <img src="/Image/PromptPay.png" alt="QR Code" class="qr-img" />
          </div>

          <!-- โหมด Edit -->
          <div v-else>
            
            <form @submit.prevent="saveData">
              <div>
           

                <label>ชื่อ</label>
                <input v-model="editData.name" type="text" />
              </div>
              <div>
                <label>เบอร์โทร</label>
                <input v-model="editData.phone" type="text" />
              </div>
              <div>
                <label>ที่อยู่</label>
                <input v-model="editData.address" type="text" />
              </div>
             


              <div>
                <label>QR Code</label>
                <label class="upload-box">
                    <input type="file" @change="handleFileUpload" hidden />
                    <div class="upload-placeholder">
                    <span class="upload-icon">⬆️</span>
                    <span>ใส่รูปภาพ</span>
                    </div>
                </label>
            </div>
            <div class="btn-group">
                <button type="button" class="cancel-btn" @click="cancelEdit">ยกเลิก</button>
                <button type="submit" class="save-btn">ยืนยัน</button>
              </div>
            </form>
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
  background: #f9f9f3;
}

/* Topbar */
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

/* Notification card */
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

/* Content */
.content {
  padding: 20px;
}
.page-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}
.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.edit-btn {
  background: #7ecb9a;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
}
.edit-btn:hover {
  background: #68b383;
}
.info p {
  margin-bottom: 15px;
  font-size: 15px;
}
.qr-img {
  width: 180px;
}
.upload-box {
  border: 1px solid #ccc;   /* เส้นกรอบเทา */
  border-radius: 6px;       /* มุมโค้งเล็กน้อย */
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
  color: #444;
  margin-top: 6px;
  background: #fff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: bold;
  color: #444;
}

.upload-icon {
  font-size: 22px;
}
.btn-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.cancel-btn {
  background: #e74c3c;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}
.cancel-btn:hover {
  background: #c0392b;
}

.save-btn {
  background: #2ecc71;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}
.save-btn:hover {
  background: #27ae60;
}
</style>
