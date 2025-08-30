<script setup>
import Navbar from "~/components/UI/Navbar.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import StepProgress from "~/components/UI/StepProgress.vue";

const router = useRouter();
const currentStep = ref(1);

// mock data
const cart = ref([
  {
    id: 1,
    name: "ไข่ไก่ เบอร์ 1",
    price: 4.7,
    qty: 1,
    image: "https://i.imgur.com/MO0OqGZ.png",
  },
  {
    id: 2,
    name: "บะหมี่กึ่งสำเร็จรูป",
    price: 10.0,
    oldPrice: 12.0,
    qty: 1,
    image: "https://i.imgur.com/Bb2nMSr.png",
  },
]);

const discount = computed(() => {
  return cart.value.reduce((sum, item) => {
    if (item.oldPrice) {
      return sum + (item.oldPrice - item.price) * item.qty;
    }
    return sum;
  }, 0);
});

const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0);
});

function increase(item) {
  item.qty++;
}
function decrease(item) {
  if (item.qty > 1) item.qty--;
}

// ✅ ปุ่ม "ต่อไป"
function goNext() {
  currentStep.value = 2; // เปลี่ยน step
  router.push("/details"); // ไปหน้าถัดไป
}
</script>

<template>
  <div>
    <!-- Navbar -->
    <div>
      <Navbar />
    </div>

    <div class="cart-container">
      <!-- Progress bar -->
      <div>
        <StepProgress :currentStep="currentStep" />
      </div>

      <h2>Order</h2>
      <div class="cart-content">
        <!-- สินค้า -->
        <div class="order-list">
          <div v-for="item in cart" :key="item.id" class="order-item">
            <img :src="item.image" class="item-img" />
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-price">
                <span v-if="item.oldPrice" class="old-price">
                  {{ item.oldPrice.toFixed(2) }} บาท
                </span>
                <span :class="item.oldPrice ? 'discounted' : ''">
                  {{ item.price.toFixed(2) }} บาท
                </span>
              </div>
            </div>
            <div class="quantity-control">
              <button @click="decrease(item)">-</button>
              <span>{{ item.qty }}</span>
              <button @click="increase(item)">+</button>
            </div>
          </div>
        </div>

        <!-- ส่วนลด / รวม -->
        <div class="summary">
          <div class="row">
            <span>ส่วนลด</span>
            <span
              ><strong>{{ discount.toFixed(2) }}</strong></span
            >
          </div>
          <div class="row total">
            <span>ราคารวม</span>
            <span
              ><strong>{{ total.toFixed(2) }}</strong></span
            >
          </div>
          <div class="buttons">
            <button class="cancel">ยกเลิก</button>
            <button class="next" @click="goNext">ต่อไป</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f6f6f6;
  font-family: "Prompt", sans-serif;
  min-height: 100vh;
}
.cart-container {
  max-width: 900px;
  margin: auto;
  margin-top: 4rem;
  font-family: sans-serif;
}

.cart-content {
  display: flex;
  gap: 6rem;
  margin-top: 0.5rem;
}

.order-list {
  flex: 2;
}
.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: "Prompt", sans-serif;
}
.item-img {
  width: 60px;
  height: 60px;
  margin-right: 1rem;
}
.item-info {
  flex: 1;
}
.item-name {
  font-weight: bold;
}
.item-price {
  font-size: 0.9rem;
}
.old-price {
  text-decoration: line-through;
  color: #888;
  margin-right: 5px;
}
.discounted {
  color: red;
  font-weight: bold;
}

.quantity-control {
  display: flex;
  margin-top: 30px;
}
.quantity-control button {
  width: 30px;
  height: 30px;
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
}
.quantity-control span {
  margin: 0 8px;
  font-size: 16px;
  font-family: "Prompt", sans-serif;
}

.summary {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: "Prompt", sans-serif;
  display: flex;
  flex-direction: column; /* จัดเรียงภายในกล่องเป็นแนวตั้ง */
  justify-content: space-between; /* จัดให้ส่วนลดและราคารวมอยู่ด้านบน, ปุ่มอยู่ด้านล่าง */
  padding: 10px; /* เพิ่ม padding ให้กล่อง */
}
.row {
  display: flex;
  justify-content: space-between;
  display: flex;
  margin: 0 16px;
  padding: 5px;
}
.row span strong {
  font-weight: bold; /* กำหนดให้เลขที่อยู่ใน <strong> เป็นตัวหนา */
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  display: flex;
  justify-content: space-between; /* ให้ปุ่มห่างกัน */
  margin-top: 6rem; /* ช่วยจัดให้ปุ่มอยู่ที่ด้านล่างสุด */
}
.cancel {
  background: #e63946;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  font-family: "Prompt", sans-serif;
  font-weight: 700;
  color: #eff1f3;
  border: none;
  margin: 0 16px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.cancel:hover {
  background: #ff0015;
}
.next {
  background: #6acc91;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  font-family: "Prompt", sans-serif;
  font-weight: 700;
  color: #eff1f3;
  border: none;
  margin: 0 16px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.next:hover {
  background: #00c24d;
}
h2 {
  font-family: "Prompt", sans-serif;
  margin: 20px;
  padding: 0px;
}
</style>
