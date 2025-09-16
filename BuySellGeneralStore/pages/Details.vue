<script setup>
import Navbar from "~/components/UI/Navbar.vue";
import StepProgress from "~/components/UI/StepProgress.vue";
import Summary from "~/components/UI/Summary.vue";

import { ref, onMounted, watch } from "vue";
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

// errors สำหรับแสดงข้อความ
const errors = ref({
  name: "",
  surname: "",
  address: "",
  phone: "",
  paymentMethod: "",
});

// ควบคุม modal
const showConfirmModal = ref(false);
const showErrorModal = ref(false);

// ✅ validate เบอร์โทร และช่องอื่น ๆ
function validateForm() {
  errors.value = {
    name: name.value.trim() === "" ? "กรุณากรอกชื่อ" : "",
    surname: surname.value.trim() === "" ? "กรุณากรอกนามสกุล" : "",
    address: address.value.trim() === "" ? "กรุณากรอกที่อยู่" : "",
    phone:
      phone.value.trim() === ""
        ? "กรุณากรอกเบอร์โทร"
        : !/^0\d{9}$/.test(phone.value)
        ? "เบอร์โทรต้องขึ้นต้นด้วย 0 และมี 10 หลัก"
        : "",
    paymentMethod: paymentMethod.value === "" ? "กรุณาเลือกวิธีชำระเงิน" : "",
  };

  return Object.values(errors.value).every((e) => e === "");
}

onMounted(() => {
  if (cartStore.customerInfo) {
    name.value = cartStore.customerInfo.name || "";
    surname.value = cartStore.customerInfo.surname || "";
    address.value = cartStore.customerInfo.address || "";
    phone.value = cartStore.customerInfo.phone || "";
    paymentMethod.value = cartStore.customerInfo.paymentMethod || "";
  }
});

watch([name, surname, address, phone, paymentMethod], () => {
  cartStore.setCustomerInfo({
    name: name.value,
    surname: surname.value,
    address: address.value,
    phone: phone.value,
    paymentMethod: paymentMethod.value,
  });
});

function cancelOrder() {
  router.push("/cart");
}

function goBack() {
  router.push("/cart");
}

function confirmOrder() {
  if (!validateForm()) {
    showErrorModal.value = true;
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
              <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
            </label>

            <label>
              นามสกุล
              <input type="text" v-model="surname" />
              <p v-if="errors.surname" class="error-message">
                {{ errors.surname }}
              </p>
            </label>

            <label>
              ที่อยู่
              <input type="text" v-model="address" />
              <p v-if="errors.address" class="error-message">
                {{ errors.address }}
              </p>
            </label>

            <label>
              เบอร์โทร
              <input type="text" v-model="phone" />
              <p v-if="errors.phone" class="error-message">
                {{ errors.phone }}
              </p>
            </label>

            <fieldset class="payment-methods-column">
              <legend>วิธีการชำระเงิน</legend>

              <div class="payment-row">
                <span>ปลายทาง</span>
                <input type="radio" value="COD" v-model="paymentMethod" />
              </div>

              <div class="payment-row">
                <span>Prompt Pay</span>
                <input type="radio" value="Prompt Pay" v-model="paymentMethod" />
              </div>

              <p v-if="errors.paymentMethod" class="error-message">
                {{ errors.paymentMethod }}
              </p>
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

    <!-- ✅ Modal Success -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-box success">
        <h3>กรุณาตรวจสอบข้อมูลอีกครั้ง</h3>
        <p>สามารถตรวจสอบได้ในหน้าถัดไปและกดย้อนกลับเพื่อแก้ไข</p>
        <button @click="goToSubmit">ตกลง</button>
      </div>
    </div>

    <!-- ✅ Modal Error -->
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
  transform: scale(1.2);
  /* ขยายปุ่มเล็กน้อย */
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
  background: #fff;
  padding: 2rem 3rem;
  border-radius: 12px;
  text-align: center;
  max-width: 320px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
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
  margin-top: 1rem;
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

/* ✅ Error message under input */
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

</style>
