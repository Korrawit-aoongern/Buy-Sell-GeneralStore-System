<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { createClient } from "@supabase/supabase-js";

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey);

const orderId = ref(route.query.orderid || null);
const slipFile = ref(null);
const slipPreviewUrl = ref("");
const showConfirmModal = ref(false);
const showWarning = ref(false);
const qrCodeUrl = ref("/Image/PromptPay.png");

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    slipFile.value = file;
    slipPreviewUrl.value = URL.createObjectURL(file);
  }
}



function goBack() {
  router.push("/details");
}

function goHome() {
  if (!slipFile.value) {
    showWarning.value = true;
    setTimeout(() => (showWarning.value = false), 3000);
    return;
  }
  showConfirmModal.value = true;
}

async function goToThankyou() {
  if (!slipFile.value) {
    showWarning.value = true;
    setTimeout(() => (showWarning.value = false), 3000);
    return;
  }

  try {
    // Upload slip first
    const fileName = `${billingId}_${Date.now()}.png`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("img_slip")
      .upload(fileName, slipFile.value);

    if (storageError) throw storageError;

    const { data: urlData } = supabase.storage
      .from("img_slip")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Place order only after slip upload
    const { data, error } = await supabase.rpc("place_order", {
      p_customer: JSON.parse(route.query.customer),
      p_items: JSON.parse(route.query.cart),
      p_payment_method: "Prompt Pay",
      p_billingid: route.query.billingid,
      p_slip: publicUrl, // you can extend RPC to accept slip
    });

    if (error) throw error;

    router.push({ path: "/thankyou", query: { orderid: data } });
  } catch (err) {
    console.error("Error placing order:", err);
    alert("เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่");
  }
}
</script>

<template>
  <div class="promptpay-container">
    <h2>ชำระเงินด้วย PromptPay</h2>
    <p>สแกนคิวอาร์โค้ดด้านล่างเพื่อชำระเงิน</p>

    <div class="qr-code-wrapper">
      <img :src="qrCodeUrl" alt="PromptPay QR Code" class="qr-code" />
    </div>

    <!-- อัปโหลดสลิป -->
    <div class="upload-section">
      <label class="upload-label" for="slipUpload">อัปโหลดสลิปการโอนเงิน</label>
      <input id="slipUpload" type="file" accept="image/*" @change="handleFileChange" />

      <div v-if="slipPreviewUrl" class="slip-preview">
        <img :src="slipPreviewUrl" alt="Slip Preview" />
      </div>
    </div>

    <button class="btn-back" @click="goBack">ย้อนกลับ</button>
    <button class="btn-home" @click="goHome">ยืนยัน</button>
  </div>

  <!-- กล่องเตือนถ้าไม่ได้อัปโหลดสลิป -->
  <div v-if="showWarning" class="warning-box">
    กรุณาอัปโหลดสลิปก่อนยืนยันคำสั่งซื้อ
  </div>

  <!-- Modal ยืนยัน -->
  <div v-if="showConfirmModal" class="modal-overlay">
    <div class="modal-box">
      <h3>ยืนยันคำสั่งซื้อสำเร็จ</h3>
      <p>ขอบคุณที่สั่งซื้อกับเรา!</p>
      <button @click="goToThankyou">ตกลง</button>
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

.btn-back,
.btn-home {
  background-color: #2b776f;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  margin: 1rem 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #5ab67e;
}

/* กล่องแจ้งเตือนสีแดง */
.warning-box {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #e53e3e;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: fade-in-out 3s ease forwards;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  10% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
}

/* Modal */
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
