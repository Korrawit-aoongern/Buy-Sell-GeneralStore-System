<script setup>
import Navbar from "~/components/UI/Navbar.vue";
import StepProgress from "~/components/UI/StepProgress.vue";
import Summary from "~/components/UI/Summary.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart"; // 👈 import cart store

const router = useRouter();
const currentStep = ref(2);

// ใช้ cart จาก store
const cartStore = useCartStore();
const cart = cartStore.cart;
const totalPrice = cartStore.totalPrice;

// ฟอร์มข้อมูลลูกค้า
const name = ref("Alice");
const surname = ref("Yoeta");
const address = ref("1, Third Street, Lahti, Finland");
const phone = ref("457853144"); 
const paymentMethod = ref("PromptPay");

// ส่วนลดเฉพาะในหน้านี้
const discount = ref(0);

function cancelOrder() {
  router.push('/cart'); // หรือใช้ชื่อ route เช่น router.push({ name: 'cart' })
}

function confirmOrder() {
  alert("ยืนยันคำสั่งซื้อแล้ว");
  // เช่น: router.push("/success");
}
</script>


<template>
  <div>
    <!-- Navbar -->
    <Navbar />

    <div class="cart-container">
      <!-- Progress bar -->
      <StepProgress :currentStep="currentStep" />

      <div class="cart-content">
        <!-- ฟอร์มกรอกข้อมูล -->
        <div class="form-section">
          <h2>Address</h2>
          <form class="address-form">
            <label>ชื่อ
              <input type="text" v-model="name" />
            </label>

            <label>นามสกุล
              <input type="text" v-model="surname" />
            </label>

            <label>ที่อยู่
              <input type="text" v-model="address" />
            </label>

            <label>เบอร์โทร
              <input type="text" v-model="phone" />
            </label>

            <fieldset>
              <legend>วิธีการชำระเงิน</legend>
              <label>
                <input type="radio" value="ปลายทาง" v-model="paymentMethod" />
                ปลายทาง
              </label>
              <label>
                <input type="radio" value="PromptPay" v-model="paymentMethod" />
                Prompt Pay
              </label>
            </fieldset>
          </form>
        </div>

        <!-- กล่องสรุปยอด -->
        <div class="summary1">
          <Summary :cart="cart" :currentStep="currentStep" />
          </div>
        </div>
      </div>
    </div>

</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
  background-color: #fafaf5;
  font-family: "Prompt", sans-serif;
  min-height: 100vh;
}

.cart-container {
  max-width: 900px;
  margin: auto;
  margin-top: 4rem;
  font-family: "Prompt", sans-serif;
}

.cart-content {
  display: flex;
  gap: 4rem;
  margin-top: 2rem;
}

.form-section {
  flex: 2;
}

.address-form {
  display: grid;
  gap: 1rem;
}

.address-form label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  font-size: 0.9rem;
}

.address-form input[type="text"] {
  margin-top: 0.3rem;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

fieldset {
  border: none;
  margin-top: 1rem;
}

legend {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.summary1 {
  flex: 1;
}

.summary-box {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px #ddd;
  font-size: 0.9rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.1rem;
}

.btn-cancel,
.btn-confirm {
  width: 100%;
  padding: 0.5rem 0;
  margin-bottom: 0.7rem;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.btn-cancel {
  background-color: #d9534f;
  color: white;
}

.btn-confirm {
  background-color: #5cb85c;
  color: white;
}
</style>
