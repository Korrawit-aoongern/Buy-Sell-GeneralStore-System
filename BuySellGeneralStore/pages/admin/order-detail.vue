<script setup>
import { ref } from "vue";
import adminaside from '~/components/admin/adminaside.vue'
import notification from "~/components/admin/notification.vue";
import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
);

const route = useRoute();
// ตัวอย่างข้อมูลออเดอร์
const order = ref({});
const orderitems = ref([]);
const customer = ref({})
const errorMsg = ref("");

function saveWithExpiry(key, value) {
  const now = new Date();
  const item = { value, expiry: now.getTime() + 24 * 60 * 60 * 1000 };
  localStorage.setItem(key, JSON.stringify(item));
}
function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  const item = JSON.parse(itemStr);
  if (Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}
async function fetchOrder(id) {
  try {
    const cached = getWithExpiry(`order_${id}`);
    if (cached) {
      order.value = cached.order;
      customer.value = cached.customer;
      orderitems.value = cached.orderitems;
      return;
    }

    const { data, error } = await supabase
      .from("order")
      .select(`
        orderid,
        billingid,
        status,
        payment_method,
        total_amount,
        orderdate,
        payment_slip,
        customer:customerid (
          customerid,
          fname,
          lname,
          phone,
          address
        ),
        orderitems:orderitem (
          order_item_id,
          quantity,
          price_at_buy,
          product:productid (
            productid,
            nameproduct,
            baseprice,
            imgurl
          )
        )
      `)
      .eq("orderid", id)
      .single();

    if (error || !data) throw error || new Error("ไม่พบออเดอร์");

    // Transform for UI
    const orderdata = {
      oid: data.orderid,
      billingid: data.billingid,
      status: data.status,
      paymentMethod: data.payment_method,
      total: data.total_amount,
      orderdate: data.orderdate,
      slip:
        data.payment_slip ||
        "https://cdjpebstofhdsmmqpzlw.supabase.co/storage/v1/object/public/product/no-image.jpg",
    };

    const customerdata = {
      fname: data.customer?.fname || "",
      lname: data.customer?.lname || "",
      phone: data.customer?.phone || "",
      address: data.customer?.address || "",
    };

    const orderitemsdata = (data.orderitems || []).map((oi) => ({
      oiid: oi.order_item_id,
      quantity: oi.quantity,
      priceAtBuy: oi.price_at_buy,
      product: {
        id: oi.product.productid,
        name: oi.product?.nameproduct || "ไม่พบสินค้า",
        baseprice: oi.product?.baseprice || 0,
        imgurl: oi.product?.imgurl ||
        "https://cdjpebstofhdsmmqpzlw.supabase.co/storage/v1/object/public/product/no-image.jpg",
      },
    }));

    // Assign to refs
    order.value = orderdata;
    customer.value = customerdata;
    orderitems.value = orderitemsdata;

    // Save everything in one cached object
    saveWithExpiry(`order_${id}`, {
      order: orderdata,
      customer: customerdata,
      orderitems: orderitemsdata,
    });
  } catch (err) {
    console.error(err);
    errorMsg.value = "ไม่สามารถโหลดข้อมูลออเดอร์ได้";
  }
}
function discountPercent() {
  if (!orderitems.value.length) return 0;

  let originalTotal = 0;
  let discountedTotal = 0;

  orderitems.value.forEach(item => {
    const base = item.product?.baseprice || item.priceAtBuy;
    originalTotal += base * item.quantity;
    discountedTotal += item.priceAtBuy * item.quantity;
  });

  if (originalTotal <= 0) return 0;

  return ((originalTotal - discountedTotal) / originalTotal) * 100;
}
async function updateStatus(newStatus) {
  if (!newStatus || !order.value.oid) return;

  try {
    const { error } = await supabase
      .from("order")
      .update({ status: newStatus })
      .eq("orderid", order.value.oid);

    if (error) throw error;

    alert("อัปเดตสถานะสำเร็จ");
    // Update locally so UI reflects change immediately
    order.value.status = newStatus;
  } catch (err) {
    console.error("Update status error:", err.message);
    alert("อัปเดตสถานะไม่สำเร็จ: " + err.message);
  }
}

onMounted(() => {
  const id = Number(route.query.id); // ✅ ensure numeric
  if (id) fetchOrder(id);
  else errorMsg.value = "กรุณาเลือกออเดอร์ที่ต้องการดูจากหน้าออเดอร์ทั้งหมด";
});
</script>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <adminaside />

    <!-- Main Content -->
    <div class="main-content">
      <notification/>

      <!-- Order Detail -->
      <div class="content">
        <h2 class="title">รายละเอียดออเดอร์</h2>

        <div v-if="errorMsg"><p>{{ errorMsg }}</p></div>
        <!-- Order header -->
        <div v-else-if="order">
        <div class="content-header">
          <div style="flex: 1;">
            <p><b>Order:</b> #{{ order.oid }}</p>
            <p><b>BillingID:</b> {{ order.billingid }}</p>
            <p><b>Status:</b> {{ order.status }}</p>
            <p><b>วันที่:</b> {{ new Date(order.orderdate).toLocaleString("th-TH") }}</p>
          </div>
          <div class="actions">
            <button class="btn-success" @click="updateStatus('Complete')">เสร็จสิ้นแล้ว</button>
            <button class="btn-edit" @click="updateStatus('Delivery')">จัดส่ง</button>
            <button class="btn-danger" @click="updateStatus('Cancelled')">ยกเลิก</button>
            <button class="btn-info" @click="updateStatus('Pending')">รอดำเนินการ</button>
          </div>
        </div>

        <div class="order-layout">
          <!-- Billing Address -->
          <div class="box">
            <h3>Billing Address</h3>
            <p><b>ชื่อ:</b> {{ customer.fname }} {{ customer.lname }}</p>
            <p><b>ที่อยู่:</b> {{ customer.address }}</p>
            <p><b>เบอร์โทร:</b> {{ customer.phone }}</p>
          </div>

          <!-- Payment -->
          <div class="box">
            <h3>Payment Method</h3>
            <div style="display: flex; gap: 12px;">
              <div v-if="order.paymentMethod == 'COD'"><Icon name="material-symbols:local-atm-sharp" style="width: 24px; height: 24px; color: black;"/>
              </div>
              <div v-else>
                <img src="../../public/Image/promptpay-icon.svg" alt="promptpay" style="width: 24px;">
              </div>
              <div>{{ (order.paymentMethod == "COD") ? "ปลายทาง" : "Prompt Pay" }}</div>
            </div>
            
          </div>

          <!-- Slip / Image -->
          <div class="box image-box">
            <div v-if="order.paymentMethod == 'COD'">ไม่มีสลิปเนื่องจากเก็บปลายทาง</div>
            <img :src="order.slip" alt="payment slip" />
          </div>
        </div>

        <!-- Table -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>รูปสินค้า</th>
                <th>ชื่อสินค้า</th>
                <th>จำนวน</th>
                <th>ราคาจริง</th>
                <th>ราคาหลังลด</th>
                <th>ราคารวม</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in orderitems" :key="index">
                <td>
                  <img :src="item.product?.imgurl" alt="Product Image" style="width: 200px; height: auto;" />
                </td>
                <td>{{ item.product?.name || "ไม่พบสินค้า" }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ new Intl.NumberFormat("th-TH",{minimumFractionDigits:2}).format(item.product?.baseprice) }} ฿</td>
                <td>{{ new Intl.NumberFormat("th-TH",{minimumFractionDigits:2}).format(item.priceAtBuy) }} ฿</td>
                <td>{{ new Intl.NumberFormat("th-TH",{minimumFractionDigits:2}).format
                ((item.priceAtBuy) * (item.quantity)) }} ฿</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total -->
        <div class="summary">
          <span>ส่วนลดเปอร์เซ็นทั้งหมด : </span>
            <b>{{
              discountPercent().toFixed(0)
            }} %</b>
        </div>
        <div class="summary">
          <p>ราคาทั้งหมด : <b>{{ new Intl.NumberFormat("th-TH",{minimumFractionDigits:2}).format
                (order.total) }} บาท</b></p>
        </div>
        </div>

        <div v-else><p>กำลังโหลด...</p></div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: 'prompt', sans-serif;
}

.dashboard-container {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.topbar {
  height: 60px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
}

/* Content */
.content {
  padding: 20px;
}

.title {
  font-size: 20px;
  margin-bottom: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.order-layout {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.box {
  flex: 1;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.image-box img {
  max-width: 200px;
  margin: auto;
  display: block;
}

.table-container {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ddd;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  background: #597162;
  color: white;
}

th, td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.summary {
  text-align: right;
  font-size: 16px;
}
</style>
