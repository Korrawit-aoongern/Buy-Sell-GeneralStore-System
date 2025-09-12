<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import Summary from "~/components/UI/Summary.vue";
import Navbar from "~/components/UI/Navbar.vue";
import ProgressStep from "~/components/UI/StepProgress.vue";

const step = ref(3);

const router = useRouter();

const cartStore = useCartStore();
const cart = cartStore.cart;
const userInfo = cartStore.customerInfo;

// ถ้า paymentMethod เป็น PromptPay ให้เด้งไปอีกหน้า
onMounted(() => {
  if (userInfo.paymentMethod === "PromptPay") {
    router.push("/promptpay");
  }
});

function goBackToSummary() {
  step.value = 1;
}

</script>

<template>
  <Navbar />

  <div v-if="step === 1">
    <p>หน้านี้ยังไม่ได้ใส่เนื้อหา summary นะครับ</p>
    <button @click="step = 2">ไปหน้า Submit</button>
  </div>

  <div v-else-if="step === 3">
    <div class="step-container">
      <ProgressStep :currentStep="step" />
    </div>

    <div class="submit-page">
      <div class="left-section">
        <h2>รายละเอียด</h2>
        <div class="info-row"><span class="label">ชื่อ</span><span>{{ userInfo.name }}</span></div>
        <div class="info-row"><span class="label">นามสกุล</span><span>{{ userInfo.surname }}</span></div>
        <div class="info-row"><span class="label">ที่อยู่</span><span>{{ userInfo.address }}</span></div>
        <div class="info-row"><span class="label">เบอร์โทร</span><span>{{ userInfo.phone }}</span></div>
        <div class="info-row"><span class="label">วิธีการชำระเงิน</span><span>{{ userInfo.paymentMethod }}</span></div>

        <h2>รายการ</h2>
        <ul class="item-list">
          <li v-for="item in cart" :key="item.id" class="item">
            <img :src="item.image || 'https://via.placeholder.com/80'" alt="product" class="item-img" />
            <div class="item-info">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-price">{{ item.price.toFixed(2) }} บาท</p>
            </div>
            <div class="item-qty">{{ item.qty }}</div>
          </li>
        </ul>
      </div>

      <div class="right-section">
        <Summary :cart="cart" :currentStep="2" @back="goBackToSummary" @next="goHome" />
      </div>
    </div>
  </div>

  <!-- ✅ Step 3 -->
  <div v-else-if="step === 3">
    <div class="step-container">
      <ProgressStep :currentStep="step" />
    </div>

    <div class="confirm-page">
      <h2>✅ การสั่งซื้อเสร็จสมบูรณ์</h2>
      <p>ขอบคุณที่สั่งซื้อกับเรา</p>
      <button @click="step = 1">กลับไปหน้าแรก</button>
    </div>
  </div>
</template>



<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
  font-family: "Prompt", sans-serif;
}

/* layout split left and right */
.submit-page {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

.step-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4rem;
}

/* Left side */
.left-section {
  flex: 3;
}

h2 {
  font-weight: 800;
  margin-bottom: 1rem;
  color: #2b776f;
  border-bottom: 2px solid #2b776f;
  padding-bottom: 0.4rem;
}

.info-row {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.label {
  font-weight: 700;
  color: #2b776f;
  min-width: 120px;
  flex-shrink: 0;
  text-align: left;
}

.info-row > span:last-child {
  font-weight: 500;
  color: #333;
  word-break: break-word;
  flex: 1;
}

.item-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 5px rgb(0 0 0 / 0.1);
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgb(0 0 0 / 0.15);
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #2b776f;
  font-size: 1rem;
}

.item-price {
  font-size: 0.9rem;
  color: #555;
}

.item-qty {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  min-width: 30px;
  text-align: center;
}

/* Right side */
.right-section {
  flex: 1;
  margin-top: 7rem;
}

.summary-box {
  background: white;
  padding: 1.8rem 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgb(0 0 0 / 0.1);
  font-size: 0.95rem;
  color: #333;
  font-weight: 600;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  font-weight: 600;
  font-size: 1rem;
}

.summary-row.total {
  font-weight: 900;
  font-size: 1.3rem;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
  margin-top: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem 0;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 700;
  margin-top: 1rem;
  font-family: "Prompt", sans-serif;
  transition: background-color 0.3s ease;
}

.btn-cancel {
  background-color: #e63946;
  color: white;
}

.btn-cancel:hover {
  background-color: #c52839;
}

.btn-confirm {
  background-color: #6acc91;
  color: white;
}

.btn-confirm:hover {
  background-color: #54a573;
}
</style>
