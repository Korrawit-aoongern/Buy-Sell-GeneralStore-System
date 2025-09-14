<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCartStore } from "~/stores/cart";
import Summary from "~/components/UI/Summary.vue";
import Navbar from "~/components/UI/Navbar.vue";
import ProgressStep from "~/components/UI/StepProgress.vue";
import { createClient } from "@supabase/supabase-js";

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();
const cart = cartStore.cart;
const userInfo = cartStore.customerInfo;

const step = ref(3);

const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey);

function generateRandomOrderId(length = 16) {
  const chars = "abcdef0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
const billingId = ref(generateRandomOrderId());

function formatDateForPostgres(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Month is 0-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// ================== ORDER SUBMIT FUNCTION ==================
async function submitOrder() {
  try {
    // 1️⃣ Insert customer if needed
    const { data: customerData, error: customerError } = await supabase
      .from("customer")
      .insert([
        {
          fname: userInfo.name,
          lname: userInfo.surname,
          phone: userInfo.phone,
          address: userInfo.address,
          created_at: formatDateForPostgres()
        },
      ])
      .select("customerid")
      .single();

    if (customerError) throw customerError;
    const customerId = customerData.customerid;

    // 2️⃣ Insert order
    const { data: orderData, error: orderError } = await supabase
      .from("order")
      .insert({
        ownerid: 1,
        customerid: customerId,
        orderdate: formatDateForPostgres(),
        total_amount: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
        billingid: billingId.value,
        status: "Pending",
        payment_method: userInfo.paymentMethod,
        payment_slip: null,
      })
      .select("orderid")
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.orderid;

    // 3️⃣ Insert order items
    const orderItems = cart.map((item) => ({
      orderid: orderId,
      productid: item.id,
      quantity: item.qty,
      price_at_buy: item.price,
    }));

    const { error: orderItemError } = await supabase
      .from("orderitem")
      .insert(orderItems);

    if (orderItemError) throw orderItemError;

    // 4️⃣ Update stock (decrement)
    for (const item of cart) {
      const { error: stockError } = await supabase
        .rpc("decrement_stock", { product_id: item.id, qty: item.qty });

      if (stockError) throw stockError;
    }

    // 5️⃣ Redirect based on payment
    if (userInfo.paymentMethod === "Prompt Pay") {
      router.push({ path: "/promptpay", query: { orderid: orderId } });
    } else {
      router.push({ path: "/thankyou", query: { orderid: orderId } });
    }
  } catch (err) {
    console.error("Error submitting order:", err);
    alert("เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่");
  }
}

// ================== STEP LOGIC ==================
onMounted(() => {
  if (route.query.step) {
    step.value = Number(route.query.step);
  }
});

watch(
  () => route.query.step,
  (newStep) => {
    if (newStep) step.value = Number(newStep);
  }
);

function goBackToDetails() {
  router.push("/details");
}

function goToThankyou() {
  submitOrder();
  router.push("/thankyou");
}
function goToPromptpay() {
  router.push("/PromptPay");
}
</script>

<template>
  <Navbar />

  <!-- Step 1 -->
  <div v-if="step === 1">
    <p>หน้านี้ยังไม่ได้ใส่เนื้อหา summary นะครับ</p>
    <button @click="step = 2">ไปหน้า Submit</button>
  </div>

  <!-- Step 3: Summary / Submit -->
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
        <Summary
          :cart="cart"
          :currentStep="2"
          @click="submitOrder"
          @back="goBackToDetails"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.submit-page {
  display: flex;
  gap: 4rem;
  align-items: flex-start;
  max-width: 1000px;
  margin: auto;
  margin-top: 2rem;
  font-family: "Prompt", sans-serif;
}

.left-section {
  flex: 2;
}

.right-section {
  flex: 1;
}

.step-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4rem;
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
</style>
