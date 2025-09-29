<script setup>
import { ref, onMounted } from "vue";
import adminaside from '~/components/admin/adminaside.vue';
import notification from "~/components/admin/notification.vue";
import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey);
const route = useRoute();

const idsParam = route.query.ids
const customerIds = idsParam ? idsParam.split(',').map(id => Number(id)) : []

const customer = ref({});
const orders = ref([]);
const errorMsg = ref("");

// fetch all orders where customerid IN [customerIds]
async function fetchCustomerOrders() {
  if (customerIds.length === 0) {
    errorMsg.value = "กรุณาเลือกจากรายชื่อลูกค้า";
    return
  }

  try {
    const { data, error } = await supabase
      .from("order")
      .select(`
        orderid,
        billingid,
        total_amount,
        orderdate,
        status,
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
      .in("customerid", customerIds)
      .order("orderdate", { ascending: false })

    if (error) throw error
    if (!data || data.length === 0) throw new Error("ไม่พบลูกค้า")

    const firstCustomer = data[0].customer
    customer.value = {
      id: firstCustomer.customerid,
      name: `${firstCustomer.fname} ${firstCustomer.lname}`,
      phone: firstCustomer.phone,
      address: firstCustomer.address,
      totalOrders: data.length
    }

    orders.value = data.map(ord => ({
      id: ord.orderid,
      code: ord.billingid,
      status: ord.status,
      total: ord.total_amount,
      date: ord.orderdate,
      items: (ord.orderitems || []).map(oi => ({
        id: oi.order_item_id,
        qty: oi.quantity,
        price: oi.price_at_buy,
        baseprice: oi.product?.baseprice,
        name: oi.product?.nameproduct || "ไม่พบสินค้า",
        img: oi.product?.imgurl || "https://cdjpebstofhdsmmqpzlw.supabase.co/storage/v1/object/public/product/no-image.jpg",
      })),
    }))
  } catch (err) {
    console.error(err)
    errorMsg.value = "ไม่สามารถโหลดข้อมูลลูกค้าได้"
  }
}
function discountPercent() {
  if (!orders.value.length) return 0;

  let originalTotal = 0;
  let discountedTotal = 0;

  orders.value.forEach(order => {
    (order.items || []).forEach(item => {
      const base = item.baseprice || item.price; // fallback to price if baseprice missing
      originalTotal += base * item.qty;
      discountedTotal += item.price * item.qty;
    });
  });

  if (originalTotal <= 0) return 0;

  return ((originalTotal - discountedTotal) / originalTotal) * 100;
}


onMounted(() => fetchCustomerOrders())

</script>

<template>
  <div class="dashboard-container">
    <adminaside />
    <div class="main-content">
      <notification />

      <div class="content">
        <h2>รายละเอียดลูกค้า</h2>

        <div v-if="errorMsg"><p>{{ errorMsg }}</p></div>

        <div v-else-if="customer.id">
          <div class="card" style="display: flex; flex-direction: column; gap: 10px;">
            <div><strong>#{{ customer.id }}</strong></div>
            <span><strong>ชื่อ :</strong> {{ customer.name }}</span>
            <div><strong><Icon name="material-symbols:phone-in-talk-rounded" color="black"/> :</strong> {{ customer.phone }}</div>
            <div><strong>ที่อยู่ :</strong> {{ customer.address }}</div>
          </div>

          <div>
            <h3>จำนวนครั้งที่สั่งสินค้า : {{ orders.length }} ครั้ง</h3>
          </div>

          <div v-for="order in orders" :key="order.id" class="order-card">
            <h4>Order #{{ order.id }}</h4>
            <h4>Billing: {{ order.code }}</h4>
            <table class="table-container">
              <thead>
                <tr>
                  <th>รูปสินค้า</th>
                  <th>ชื่อสินค้า</th>
                  <th>จำนวน</th>
                  <th>ราคา</th>
                  <th>ราคาหลังลด</th>
                  <th>ราคารวม</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.items" :key="item.id">
                  <td>
                    <img :src="item.img" alt="Product Image" style="width: 200px; height: auto;" /> 
                  </td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.qty }}</td>
                  <td>{{ item.baseprice.toFixed(2) }}</td>
                  <td>{{ item.price.toFixed(2) }}</td>
                  <td>{{ (item.qty*item.price).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
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
        </div>

        <div v-else><p>กำลังโหลด...</p></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
body {
  font-family: 'prompt', sans-serif;
}

.dashboard-container {
  display: flex;
  height: 100%;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px;
}

/* Topbar */
.topbar {
  height: 60px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.notification {
  height: 32px;
  cursor: pointer;
}

.notification-card {
  position: absolute;
  top: 75px;
  right: 20px;
  background: #fff;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 1000;
}

.notification-header {
  font-size: 14px;
  font-weight: bold;
  padding: 10px 15px;
  border-bottom: 1px solid #E5E5E5;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 15px;
  border-bottom: 1px solid #E5E5E5;
}

.red-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  margin-top: 5px;
  margin-right: 10px;
}

.notification-text {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.notification-desc {
  font-size: 13px;
  color: #555;
}

/* Customer Section */
.customer-details {
  margin-top: 20px;
}

.customer-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.order-card {
  margin-top: 20px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.order-table th {
  background: #4d6651;
  color: #fff;
  padding: 10px;
  text-align: left;
}

.order-table td {
  border-bottom: 1px solid #ddd;
  padding: 10px;
}

</style>