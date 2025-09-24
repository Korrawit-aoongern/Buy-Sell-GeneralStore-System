<script setup>
import { ref, onMounted } from "vue";
import adminaside from '~/components/admin/adminaside.vue';
import notification from "~/components/admin/notification.vue";
import { createClient } from "@supabase/supabase-js";


const isEditing = ref(false);

// === Supabase config ===
const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey);

// store data
const storeData = ref({
  name: "",
  phone: "",
  address: "",
  qrcode: "",
});

// data ที่แก้ไข
const editData = ref({ ...storeData.value });
const qrFile = ref(null); // เก็บไฟล์ที่เลือก


const cancelEdit = () => {
  isEditing.value = false;
  editData.value = { ...storeData.value };
  qrFile.value = null;
};

// ⬆️ Upload ไฟล์ไป Storage (bucket ownerSlip)
async function uploadQrCode(file) {
  const fileName = `ownerSlip_${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("ownerSlip")   // 👈 bucket ใหม่
    .upload(fileName, file);

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  // ดึง public URL
  const { data: urlData } = supabase.storage
    .from("ownerSlip")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// save → update Supabase
const saveData = async () => {
  let qrUrl = editData.value.qrcode;

  // ถ้ามีไฟล์ใหม่ → อัปโหลดขึ้น Storage
  if (qrFile.value) {
    const uploadedUrl = await uploadQrCode(qrFile.value);
    if (uploadedUrl) {
      qrUrl = uploadedUrl;
    }
  }

  storeData.value = { ...editData.value, qrcode: qrUrl };
  isEditing.value = false;

  const { error } = await supabase
    .from("owner")
    .update({
      name: storeData.value.name,
      phone: storeData.value.phone,
      address: storeData.value.address,
      qrcode: storeData.value.qrcode,
    })
    .eq("ownerid", 1);

  if (error) {
    console.error("Update error:", error.message);
  }
};

// เลือกไฟล์ (preview + เก็บไฟล์)
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    qrFile.value = file;
    editData.value.qrcode = URL.createObjectURL(file); // preview local ก่อน
  }
};

// fetch data from Supabase
const fetchStoreData = async () => {
  const { data, error } = await supabase
    .from("owner")
    .select("*")
    .eq("ownerid", 1)
    .single();

  if (error) {
    console.error("Fetch error:", error.message);
  } else {
    storeData.value = data;
    editData.value = { ...data };
  }
};

onMounted(() => {
  fetchStoreData();
});
</script>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <adminaside />

    <!-- Main Content -->
    <div class="main-content">
      <notification/>

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
            <img v-if="storeData.qrcode" :src="storeData.qrcode" alt="QR Code" class="qr-img" />
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
                  <div class="upload-placeholder" :class="{ 'has-image': editData.qrcode }">
                    <template v-if="editData.qrcode">
                      <img :src="editData.qrcode" alt="preview" class="preview-img" />
                    </template>
                    <template v-else>
                      <span class="upload-icon">⬆️</span>
                      <span>ใส่รูปภาพ</span>
                    </template>
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
  border: 1px solid #ccc;  
  border-radius: 6px;       
  height:100%;          /* ความสูงคงเดิม */
  width: 100%;             /* ให้เต็ม container แต่ไม่เกิน max */
  max-width: 250px;        /* ขนาดสูงสุด ปรับได้ตามต้องการ */
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

.upload-placeholder.has-image {
  padding: 0;
}

.upload-icon {
  font-size: 22px;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  transition: transform 0.3s;
}

.preview-img:hover {
  transform: scale(1.05);
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
