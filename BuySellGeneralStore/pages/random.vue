<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

function generateRandomOrderId(length = 16) {
  const chars = "abcdef0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const orderId = ref(generateRandomOrderId());

const router = useRouter();

function goHome() {
  router.push("/");
}

function copyOrderId() {
  navigator.clipboard.writeText(orderId.value)
}
</script>

<template>
  <div class="order-complete-container">
    <h1>ขอบคุณสำหรับคำสั่งซื้อ</h1>
    <p>รหัสรายการ : <strong>{{ orderId }}</strong> <button @click="copyOrderId" class="copy-btn" title="คัดลอกรหัส">📋</button></p>

    <button class="btn-back-home" @click="goHome">กลับไปหน้าสินค้า</button>
  </div>
</template>


<style scoped>
.order-complete-container {
  max-width: 500px;
  margin: 4rem auto;
  padding: 2rem 3rem;
  text-align: center;
  font-family: "Prompt", sans-serif;
  background-color: #fafaf0;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

h1 {
  color: #2f855a;
  margin-bottom: 1rem;
}

p {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 0.5rem;
}

.copy-btn:hover {
  color: #6acc91;
}

.btn-back-home {
  background-color: #6acc91;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 2.5rem;
  color: white;
  font-weight: 700;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

.btn-back-home:hover {
  background-color: #559955;
}
</style>
