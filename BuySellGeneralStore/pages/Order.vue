<script setup>
import { ref } from "vue";
import Navbar from "~/components/UI/Navbar.vue";

const orderCode = ref("");
const showModal = ref(false); // Modal เตือนกรอกรหัส
const confirmCancelModal = ref(false); // Modal ยืนยันยกเลิกออเดอร์
const foundOrder = ref(null);

const orders = {
  123456: {
    name: "สมศักดิ์",
    surname: "นามสกุล",
    address: "19 หมู่ 2 เมืองพัทยา พัทยา",
    phone: "056687641",
    items: [
      {
        name: "ปากกาก",
        price: 10.0,
        qty: 5,
        image: new URL("~/assets/images/pen.jpg", import.meta.url).href,
      },
      {
        name: "สายแลน",
        price: 299.0,
        originalPrice: 199.0,
        qty: 2,
        image: new URL("~/assets/images/Lan.jpg", import.meta.url).href,
      },
    ],
  },
};

const checkOrder = () => {
  if (!orderCode.value.trim()) {
    showModal.value = true;
    return;
  }

  const order = orders[orderCode.value.trim()];
  if (order) {
    foundOrder.value = order;
  } else {
    foundOrder.value = null;
    alert("ไม่พบรหัสรายการนี้");
  }
};

// เรียก modal ยืนยันยกเลิก
const promptCancelOrder = () => {
  confirmCancelModal.value = true;
};

// ยืนยันยกเลิกออเดอร์จริงๆ
const cancelOrder = () => {
  orderCode.value = "";
  foundOrder.value = null;
  confirmCancelModal.value = false;
};

// ปิด modal ยืนยันโดยไม่ยกเลิก
const closeCancelModal = () => {
  confirmCancelModal.value = false;
};
</script>

<template>
  <div>
    <Navbar />
    <router-view />
  </div>

  <div>
    <div class="order-tracking-page">
      <h1 class="tracking-title">Order Tracking</h1>
    </div>
  </div>
  <!-- ... ส่วน navbar กับฟอร์มเหมือนเดิม ... -->

  <div class="tracking-form-container">
    <h2 class="form-title">โปรดใส่รหัสรายการ</h2>
    <label class="form-label">รหัสรายการ</label>
    <input v-model="orderCode" type="text" class="form-input" />
    <button class="check-button" @click="checkOrder">ตรวจสอบ</button>
  </div>

  <div v-if="foundOrder" class="order-details">
    <h2>รายละเอียด</h2>
    <p><strong>ชื่อ:</strong> {{ foundOrder.name }}</p>
    <p><strong>นามสกุล:</strong> {{ foundOrder.surname }}</p>
    <p><strong>ที่อยู่:</strong> {{ foundOrder.address }}</p>
    <p><strong>เบอร์โทร:</strong> {{ foundOrder.phone }}</p>

    <div v-for="item in foundOrder.items" :key="item.name" class="order-item">
      <img :src="item.image" alt="" width="50" />
      <div>
        <strong>{{ item.name }}</strong
        ><br />

        <!-- ✅ แสดงราคาปัจจุบัน + ราคาปกติแนวตั้ง -->
        <div class="price-stack" v-if="item.originalPrice">
          <span class="current-price">{{ item.price.toFixed(2) }} บาท</span>
          <span class="original-price"
            >{{ item.originalPrice.toFixed(2) }} บาท</span
          >
        </div>

        <!-- 🔹 หากไม่มีราคาปกติ -->
        <div class="price-stack" v-else>
          <span class="current-price">{{ item.price.toFixed(2) }} บาท</span>
        </div>

        จำนวน: {{ item.qty }}
      </div>
    </div>
  </div>

  <!-- ปุ่มยกเลิกออเดอร์ เพิ่มคลาส large เพื่อให้อยู่ตรงกลาง -->
  <button
    v-if="foundOrder"
    class="cancel-button large"
    @click="promptCancelOrder"
  >
    ยกเลิกออเดอร์
  </button>

  <!-- Modal เตือนเมื่อไม่กรอก -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-box">
      <button class="close-button" @click="showModal = false">✕</button>
      <div class="modal-content">
        <div class="modal-icon">!</div>
        <p class="modal-text">กรุณากรอกรหัสรายการก่อน</p>
        <div class="modal-actions">
          <button class="confirm-button" @click="showModal = false">
            ตกลง
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal ยืนยันยกเลิกออเดอร์ -->
  <div v-if="confirmCancelModal" class="modal-overlay">
    <div class="modal-box">
      <button class="close-button" @click="closeCancelModal">✕</button>
      <div class="modal-content">
        <div class="modal-icon" style="color: red; border-color: red">!</div>
        <p class="modal-text" style="color: red; font-weight: bold">
          คุณต้องการยกเลิกออเดอร์ใช่หรือไม่
        </p>
        <div class="modal-actions" style="gap: 1rem">
          <button class="confirm-button" @click="cancelOrder">ใช่</button>
          <button
            class="cancel-button"
            @click="closeCancelModal"
            style="background-color: #eee; color: #555; border: none"
          >
            ยกเลิก
          </button>
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
</style>

<style scoped>
/* ===== Page Content ===== */
.order-tracking-page {
  padding: 2rem;
}
.tracking-title {
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 3rem;
}
.tracking-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: left;
}
.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 1rem;
  text-align: center;
}
.form-label {
  font-size: 1rem;
  color: #3cb371;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
}
.check-button {
  background-color: #3cb371;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  float: right;
  transition: background-color 0.2s ease;
}
.check-button:hover {
  background-color: #34a15c;
}

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-box {
  background-color: white;
  width: 500px;
  border-radius: 8px;
  padding: 2rem;
  position: relative;
  text-align: center;
}
.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.modal-icon {
  font-size: 40px;
  border: 2px solid;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  /* สีของ modal-icon กำหนดโดยคลาสเสริม */
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.confirm-button,
.cancel-button {
  flex: 1; /* ให้ปุ่มทั้งสองกินพื้นที่เท่า ๆ กัน */
  padding: 0.75rem 0; /* ความสูงเท่ากัน */
  font-weight: bold;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  text-align: center;
  transition: background-color 0.3s ease;
  display: flex; /* จัดข้อความตรงกลางแนวตั้งและแนวนอน */
  justify-content: center;
  align-items: center;
}

/* ปุ่มใช่ สีแดง */
.confirm-button {
  background-color: #e53935;
  color: white;
}

.confirm-button:hover {
  background-color: #b52a24;
}

/* ปุ่มยกเลิก สีเทา */
.cancel-button {
  background-color: #eee;
  color: #555;
}

.cancel-button:hover {
  background-color: #ccc;
}

/* ปุ่มยกเลิกแบบใหญ่ ให้อยู่กลาง */
.cancel-button.large {
  display: block;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  padding: 0.75rem;
  font-size: 1.1rem;
  text-align: center;
  background-color: #e53935; /* สีแดง */
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.cancel-button.large:hover {
  background-color: #b52a24; /* สีแดงเข้มเมื่อ hover */
}

/* ปุ่มยกเลิกสีแดงใน modal */
.modal-actions .cancel-button {
  background-color: #e53935;
  color: white;
  border: none;
}

.modal-actions .cancel-button:hover {
  background-color: #b52a24;
}

/* สีของ cancel-button แบบใหญ่ กำหนดโดยคลาสเสริม */
.cancel-button.red {
  background-color: #e53935;
  color: white;
}
.cancel-button.red:hover {
  background-color: #b52a24;
}
.cancel-button.grey {
  background-color: #eee;
  color: #555;
}
.cancel-button.grey:hover {
  background-color: #ccc;
}

/* รายละเอียดรายการ */
.order-details {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 10px;
}
.order-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #ccc;
}
/* ราคาที่ลดแล้ว กับ ราคาปกติในบรรทัดเดียว */
.price-stack {
  display: flex;
  flex-direction: column; /* วางซ้อนแนวตั้ง */
  align-items: flex-start; /* ชิดซ้าย */
  margin-bottom: 0.3rem;
}

.current-price {
  color: red;
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.2;
}

.original-price {
  text-decoration: line-through;
  color: #888;
  font-size: 0.85rem;
  margin-top: 2px;
}
</style>
