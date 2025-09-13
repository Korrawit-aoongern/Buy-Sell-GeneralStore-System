<script setup>
import Navbar from "~/components/UI/Navbar.vue";
import StepProgress from "~/components/UI/StepProgress.vue";
import Summary from "~/components/UI/Summary.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";

const router = useRouter();
const currentStep = ref(2);

const cartStore = useCartStore();
const cart = cartStore.cart;

// ฟอร์มข้อมูลลูกค้า
const name = ref("");
const surname = ref("");
const address = ref("");
const phone = ref("");
const paymentMethod = ref("");

// ควบคุม modal
const showConfirmModal = ref(false);
const showErrorModal = ref(false);

// เช็คความถูกต้องของฟอร์ม
const formIsValid = computed(() => {
  return (
    name.value.trim() !== "" &&
    surname.value.trim() !== "" &&
    address.value.trim() !== "" &&
    phone.value.trim() !== "" &&
    paymentMethod.value.trim() !== ""
  );
});

function cancelOrder() {
  router.push("/cart");
}

function goBack() {
  router.push("/cart");
}

function confirmOrder() {
  if (!formIsValid.value) {
    showErrorModal.value = true; // 👉 เปิด modal error
    return;
  }

  cartStore.setCustomerInfo({
    name: name.value,
    surname: surname.value,
    address: address.value,
    phone: phone.value,
    paymentMethod: paymentMethod.value,
  });

  if (paymentMethod.value === "PromptPay") {
    router.push("/promptpay");
  } else {
    showConfirmModal.value = true;
  }
}

function goToSubmit() {
  showConfirmModal.value = false;
  router.push("/submit");
}
</script>

<template>
  <div>
    <Navbar />

    <div class="cart-container">
      <StepProgress :currentStep="currentStep" />

      <div class="cart-content">
        <!-- 🔹 Form ด้านซ้าย -->
        <div class="form-section">
          <h2>Address</h2>
          <form class="address-form" @submit.prevent>
            <label>
              ชื่อ
              <input type="text" v-model="name" />
            </label>

            <label>
              นามสกุล
              <input type="text" v-model="surname" />
            </label>

            <label>
              ที่อยู่
              <input type="text" v-model="address" />
            </label>

            <label>
              เบอร์โทร
              <input type="text" v-model="phone" />
            </label>

            <fieldset class="payment-methods-column">
              <legend>วิธีการชำระเงิน</legend>

              <div class="payment-row">
                <span>ปลายทาง</span>
                <input type="radio" value="ปลายทาง" v-model="paymentMethod" />
              </div>

              <div class="payment-row">
                <span>Prompt Pay</span>
                <input type="radio" value="PromptPay" v-model="paymentMethod" />
              </div>
            </fieldset>
          </form>
        </div>

        <!-- 🔹 Summary ด้านขวา -->
        <div class="summary1">
          <Summary
            :cart="cart"
            :currentStep="currentStep"
            @cancel="cancelOrder"
            @back="goBack"
            @next="confirmOrder"
          />
        </div>
      </div>
    </div>

    <!-- Modal Success -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-box success">
        <h3>ยืนยันคำสั่งซื้อสำเร็จ</h3>
        <p>ขอบคุณที่สั่งซื้อกับเรา!</p>
        <button @click="goToSubmit">ตกลง</button>
      </div>
    </div>

    <!-- Modal Error -->
    <div v-if="showErrorModal" class="modal-overlay">
      <div class="modal-box error">
        <h3>กรอกข้อมูลไม่ครบ!</h3>
        <p>กรุณากรอกข้อมูลให้ครบถ้วนก่อนดำเนินการต่อ</p>
        <button @click="showErrorModal = false">ตกลง</button>
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
  max-width: 1000px;
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

.payment-methods-column {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  border: none;
  padding: 0;
}

.payment-methods-column legend {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  width: 100%;
}

.payment-row input[type="radio"] {
  margin: 0;
  transform: scale(1.2); /* ขยายปุ่มเล็กน้อย */
}

/* ================= Modal ================= */
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
  font-size: 1.5rem;
}

.modal-box p {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #333;
}

.modal-box button {
  padding: 0.6rem 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  color: white;
}

/* ✅ Success Modal */
.modal-box.success h3 {
  color: #2f855a;
}
.modal-box.success button {
  background-color: #2f855a;
}
.modal-box.success button:hover {
  background-color: #276749;
}

/* ❌ Error Modal */
.modal-box.error h3 {
  color: #e63946;
}
.modal-box.error button {
  background-color: #e63946;
}
.modal-box.error button:hover {
  background-color: #c53030;
}
</style>
