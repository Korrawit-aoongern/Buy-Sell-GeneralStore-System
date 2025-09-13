<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const qrCodeUrl = "Image/PromptPay.png"; // path รูป QR code

const uploadedSlip = ref(null);
const previewUrl = ref(null);

const showToast = ref(false);

function handleSlipUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    uploadedSlip.value = file;
    previewUrl.value = URL.createObjectURL(file);
  } else {
    alert("กรุณาอัปโหลดรูปภาพเท่านั้น");
  }
}

function submitSlip() {
  if (!uploadedSlip.value) {
    alert("กรุณาแนบสลิปก่อนส่ง");
    return;
  }

  // ส่งสลิปไป backend หรือ Firebase ได้ที่นี่

  showToast.value = true; // แสดง toast

  setTimeout(() => {
    showToast.value = false; // ซ่อน toast
    router.push("/"); // กลับหน้าแรก
  }, 2000); // แสดง 2 วินาที
}

function goBack() {
  router.back();
}


</script>

<template>
  <div class="promptpay-container">
    <h2>ชำระเงินด้วย PromptPay</h2>
    <p>สแกนคิวอาร์โค้ดด้านล่างเพื่อชำระเงิน</p>

    <div class="qr-code-wrapper">
      <img :src="qrCodeUrl" alt="PromptPay QR Code" class="qr-code" />
    </div>

    <div class="upload-section">
      <label class="upload-label">
        แนบสลิปการโอนเงิน
        <input type="file" @change="handleSlipUpload" accept="image/*" />
      </label>

      <div v-if="previewUrl" class="slip-preview">
        <img :src="previewUrl" alt="Preview Slip" />
      </div>

      <button class="btn-submit" @click="submitSlip" :disabled="!uploadedSlip">
        ส่งสลิป
      </button>
    </div>

    <div class="btn-group">
      <button class="btn-back" @click="goBack">ย้อนกลับ</button>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="toast">
      ส่งสลิปเรียบร้อยแล้ว! รอการตรวจสอบ
    </div>
  </div>
</template>

<style scoped>
.promptpay-container {
  max-width: 450px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
  font-family: "Prompt", sans-serif;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.qr-code-wrapper {
  margin: 2rem 0 1rem;
}

.qr-code {
  width: 260px;
  height: 260px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.upload-section {
  margin-top: 2rem;
  text-align: center;
}

.upload-label {
  display: block;
  font-weight: 600;
  margin-bottom: 1rem;
  cursor: pointer;
}

input[type="file"] {
  margin-top: 0.5rem;
}

.slip-preview img {
  width: 250px;
  height: auto;
  border-radius: 10px;
  margin: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-submit {
  background-color: #2b776f;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-submit:hover:enabled {
  background-color: #246656;
}

.btn-group {
  margin-top: 2rem;
  display: flex;
  justify-content: space-around;
}

.btn-back,
.btn-home {
  background-color: #6b7280;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-back:hover,
.btn-home:hover {
  background-color: #4b5563;
}

/* Toast style */
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #2b776f;
  color: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
  font-weight: 700;
  font-size: 1.1rem;
  z-index: 9999;
  text-align: center;
}
</style>
