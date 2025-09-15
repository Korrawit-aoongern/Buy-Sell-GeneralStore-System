<script setup>
import { ref, onMounted } from "vue";
import Navbar from "~/components/UI/Navbar.vue";
import { createClient } from "@supabase/supabase-js";

const orderCode = ref("");
const billingID = ref(""); 
const showModal = ref(false);
const confirmCancelModal = ref(false);
const orderCodeErrorMessage = ref("กรุณากรอกรหัสรายการก่อน");
const foundOrder = ref(null);

const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
);

const statusMap = {
  Complete: "เสร็จสิ้น",
  Pending: "รอดำเนินการ",
  Delivery: "กำลังจัดส่ง",
  Cancelled: "ยกเลิกแล้ว",
};

// ⏰ check local storage on load
onMounted(() => {
  const saved = localStorage.getItem("orderTracker");
  if (saved) {
    const { billingid, expiry } = JSON.parse(saved);
    if (Date.now() < expiry) {
      orderCode.value = billingid; // auto fill
      checkOrder(); // auto fetch
    } else {
      localStorage.removeItem("orderTracker"); // expired
    }
  }
});

const checkOrder = async () => {
  if (!orderCode.value.trim()) {
    orderCodeErrorMessage.value = "กรุณากรอกรหัสรายการก่อน";
    showModal.value = true;
    return;
  }

  const { data: order, error } = await supabase
    .from("order")
    .select(`
      orderid,
      billingid,
      status,
      payment_method,
      total_amount,
      orderdate,
      customer:customerid (
        fname,
        lname,
        phone,
        address
      ),
      orderitems:orderitem (
        quantity,
        price_at_buy,
        product:productid (
          nameproduct,
          baseprice,
          saleprice,
          imgurl
        )
      )
    `)
    .eq("billingid", orderCode.value.trim())
    .single();

  if (error || !order) {
    console.error(error);
    orderCodeErrorMessage.value = "ไม่พบรหัสรายการนี้";
    foundOrder.value = null;
    showModal.value = true;
  } else {
    billingID.value = order.billingid;
    foundOrder.value = {
      orderid: order.orderid,
      name: order.customer.fname,
      surname: order.customer.lname,
      address: order.customer.address,
      phone: order.customer.phone,
      status: order.status,
      paymentMethod: order.payment_method,
      orderDate: new Date(order.orderdate).toLocaleString("th-TH", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      totalAmount: order.total_amount,
      items: order.orderitems.map((item) => ({
        name: item.product.nameproduct,
        price: item.price_at_buy ?? item.product.baseprice,
        originalPrice:
          item.price_at_buy && item.price_at_buy < item.product.baseprice
            ? item.product.baseprice
            : null,
        isSale: item.price_at_buy && item.price_at_buy < item.product.baseprice,
        qty: item.quantity,
        image: `/Image/${item.product.imgurl}`,
      })),
    };

    // ✅ save to localStorage for 1 day
    localStorage.setItem(
      "orderTracker",
      JSON.stringify({
        billingid: order.billingid,
        expiry: Date.now() + 24 * 60 * 60 * 1000, // 1 day
      })
    );
  }
};

// rest of your cancel functions unchanged ...
</script>


<template>
  <div>
    <div>
      <Navbar />
      <router-view />
    </div>

    <div class="order-tracking-page">
      <h1 class="tracking-title">Order Tracking</h1>
    </div>

    <div class="tracking-form-container">
      <h2 class="form-title">โปรดใส่รหัสรายการ</h2>
      <label class="form-label">รหัสรายการ</label>
      <input v-model="orderCode" type="text" class="form-input" />
      <button class="check-button" @click="checkOrder">ตรวจสอบ</button>
    </div>

    <div v-if="foundOrder" class="order-details">
      <div class="order-detail">
        <span class="order-label">รหัสรายการ: </span>
        <span class="order-value">{{ billingID }}</span>
      </div>

      <div class="order-detail">
        <span class="order-label">สถานะ: </span>
        <span class="order-value">
          {{ statusMap[foundOrder.status] || "ไม่ทราบสถานะ" }}
        </span>
      </div>

      <div class="order-detail">
        <span class="order-label">วันที่สั่งซื้อ: </span>
        <span class="order-value">{{ foundOrder.orderDate }}</span>
      </div>

      <div class="order-detail">
        <span class="order-label">วิธีชำระเงิน: </span>
        <span class="order-value">{{ foundOrder.paymentMethod }}</span>
      </div>

      <div class="order-detail">
        <span class="order-label">ชื่อ: </span>
        <span class="order-value">{{ foundOrder.name }}</span>
      </div>

      <div class="order-detail">
        <span class="order-label">นามสกุล: </span>
        <span class="order-value">{{ foundOrder.surname }}</span>
      </div>

      <div class="order-detail">
        <span class="order-label">ที่อยู่: </span>
        <span class="order-value">{{ foundOrder.address }}</span>
      </div>

      <div class="order-detail">
        <span class="order-label">เบอร์โทร: </span>
        <span class="order-value">{{ foundOrder.phone }}</span>
      </div>

      <div v-for="item in foundOrder.items" :key="item.name" class="order-item">
        <img :src="item.image" alt="" width="139px" />
        <div>
          <strong>{{ item.name }}</strong
          ><br />
          <div class="price-stack" v-if="item.isSale">
            <span class="sale-price">{{ item.price.toFixed(2) }} บาท</span>
            <span class="original-price"
              >{{ item.originalPrice.toFixed(2) }} บาท</span
            >
          </div>
          <div class="price-stack" v-else>
            <span class="current-price">{{ item.price.toFixed(2) }} บาท</span>
          </div>
        </div>
        <div class="item-quantity">จำนวน: {{ item.qty }}</div>
      </div>

      <div class="order-sum">
        <span class="order-label">รวมราคา: </span>
        <span class="order-value"
          >{{ foundOrder.totalAmount.toFixed(2) }} บาท</span
        >
      </div>
    </div>

    <!-- ปุ่มยกเลิกออเดอร์ -->
    <button
      v-if="foundOrder && foundOrder.status === 'Pending'"
      class="cancel-button large"
      @click="promptCancelOrder"
    >
      ยกเลิกออเดอร์
    </button>

    <!-- Modal แจ้งเตือน -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <button class="close-button" @click="showModal = false">✕</button>
        <div class="modal-content">
          <div class="modal-icon">!</div>
          <p class="modal-text">{{ orderCodeErrorMessage }}</p>
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
            <button class="cancel-button" @click="closeCancelModal">
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
    <footer
      style="
        background-color: #6acc91;
        width: 100%;
        height: 500px;
        margin-top: 12em;
      "
    ></footer>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #fafaf5;
  font-family: Prompt, sans-serif;
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
  color: #6acc91;
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
  background-color: #6acc91;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  font-weight: bold;
  font-family: prompt, sans-serif;
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
  color: #e73b3b;
  border-color: #e73b3b;
  /* สีของ modal-icon กำหนดโดยคลาสเสริม */
}
.modal-text {
  color: #e73b3b;
  font-size: 24px;
  font-weight: 700;
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
  text-align: center;
  transition: background-color 0.3s ease;
  display: flex; /* จัดข้อความตรงกลางแนวตั้งและแนวนอน */
  justify-content: center;
  align-items: center;
}

/* ปุ่มใช่ สีแดง */
.confirm-button {
  background-color: #e73b3b;
  color: white;
  font-family: Prompt, sans-serif;
  border: none;
}

.confirm-button:hover {
  background-color: #b32e2e;
}

/* ปุ่มยกเลิก สีเทา */
.cancel-button {
  background-color: transparent;
  color: #a8a4a4;
  border-color: #a8a4a4;
  border-width: 1px;
  font-family: prompt, sans-serif;
}

.cancel-button:hover {
  color: #767676;
  border-color: #767676;
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
  background-color: #e73b3b; /* สีแดง */
  font-family: prompt, sans-serif;
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.cancel-button.large:hover {
  background-color: #b32e2e; /* สีแดงเข้มเมื่อ hover */
}

/* รายละเอียดรายการ */
.order-details {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 10px;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.order-detail {
  display: flex;
  flex-direction: column;
}
.order-label {
  font-weight: bold;
  color: #6acc91; /* Green color for labels */
}
.order-value {
  color: #111827; /* สีเข้มสำหรับค่า */
  display: block;
  font-weight: 700;
}
.order-sum {
  align-self: flex-end;
  justify-self: flex-end;
  display: flex;
  gap: 36px;
}

.order-item {
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  gap: 24px;
}

.item-quantity {
  font-size: 1rem;
  color: #111827;
  font-weight: bold;
  margin-left: auto; /* Aligns the quantity to the right */
}

/* ราคาที่ลดแล้ว กับ ราคาปกติในบรรทัดเดียว */
.price-stack {
  display: flex;
  flex-direction: column; /* วางซ้อนแนวตั้ง */
  align-items: flex-start; /* ชิดซ้าย */
  margin-bottom: 0.3rem;
}

.price {
  color: #111827;
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.2;
}
.sale-price {
  color: red;
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.2;
}

.original-price {
  text-decoration: line-through;
  color: #111827;
  font-size: 0.85rem;
  margin-top: 2px;
}
</style>
