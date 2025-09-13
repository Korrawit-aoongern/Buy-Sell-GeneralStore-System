<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showConfirmModal = ref(false);

function goBack() {
  router.push("/Details");
}

function goHome() {
  showConfirmModal.value = true;
}

async function goToSubmit() {
  showConfirmModal.value = false;
  await router.push("/submit");
}
</script>

<template>
  <div class="promptpay-container">
    <h2>ชำระเงินด้วย PromptPay</h2>
    <p>สแกนคิวอาร์โค้ดด้านล่างเพื่อชำระเงิน</p>

    <div class="qr-code-wrapper">
      <img :src="qrCodeUrl" alt="PromptPay QR Code" class="qr-code" />
    </div>

    <button class="btn-back" @click="goBack">ย้อนกลับ</button>
    <button class="btn-home" @click="goHome">ต่อไป</button>
  </div>

  <div v-if="showConfirmModal" class="modal-overlay">
    <div class="modal-box">
      <h3>ยืนยันคำสั่งซื้อสำเร็จ</h3>
      <p>ขอบคุณที่สั่งซื้อกับเรา!</p>
      <button @click="goToSubmit">ตกลง</button>
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

button:hover {
  background-color: #5ab67e;
}
/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.modal-box {
  background: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  text-align: center;
  max-width: 320px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);

  max-height: 90vh;
  overflow-y: auto;
}

.modal-box h3 {
  margin-bottom: 1rem;
  font-weight: 700;
  color: #2f855a;
  font-size: 1.5rem;
}

.modal-box p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: #333;
}

.modal-box button {
  background-color: #2f855a;
  color: white;
  padding: 0.6rem 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.modal-box button:hover {
  background-color: #276749;
}
</style>
