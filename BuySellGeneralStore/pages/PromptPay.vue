<script setup>
import { useRouter } from "vue-router";

// ✅ นำเข้ารูป QR จาก assets


const router = useRouter();



// ฟังก์ชันกลับหน้าก่อนหน้า
function goBack() {
  router.back("/Details");
}

// ฟังก์ชันกลับหน้าแรก
function goHome() {
  router.push("/");
}
</script>

<template>
  <div class="promptpay-container">
    <h2>ชำระเงินด้วย PromptPay</h2>
    <p>สแกนคิวอาร์โค้ดด้านล่างเพื่อชำระเงิน</p>

    <div class="qr-code-wrapper">
      <img src="/Image/PromptPay.png" alt="PromptPay QR Code" class="qr-code" />
    </div>

    <button class="btn-back" @click="goBack">ย้อนกลับ</button>
    <button class="btn-home" @click="goHome">กลับหน้าแรก</button>
  </div>
</template>

<style scoped>
.promptpay-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
  font-family: "Prompt", sans-serif;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.qr-code-wrapper {
  margin: 2rem 0;
}

.qr-code {
  width: 250px;
  height: 250px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

button {
  background-color: #6acc91;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #6acc91;
}
</style>
