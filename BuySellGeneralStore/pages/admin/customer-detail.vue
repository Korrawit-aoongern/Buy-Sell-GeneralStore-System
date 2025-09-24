<script setup>
import { ref } from "vue";
import adminaside from '~/components/admin/adminaside.vue'
import notification from "~/components/admin/notification.vue";
import { Icon } from '@iconify/vue';

const showNotifications = ref(false);

function toggleNotification() {
  showNotifications.value = !showNotifications.value;
}

// mock data
const customer = {
  id: 1,
  name: "ชื่อจริง นามสกุล",
  phone: "0123456789",
  address: "แม่น้ำ จังหวัดทะเล ประเทศไทย",
};

const orders = [
  {
    id: 4,
    code: "805cda85d02c47b3",
    items: [
      { name: "หูฟัง", qty: 2, price: 69.0 },
      { name: "หูฟัง", qty: 2, price: 69.0 },
    ],
  },
  {
    id: 5,
    code: "805cda85d02c47b3",
    items: [
      { name: "หูฟัง", qty: 2, price: 69.0 },
      { name: "หูฟัง", qty: 2, price: 69.0 },
    ],
  },
];
</script>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <adminaside />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Topbar -->
      <notification/>

      <!-- Customer Details -->
      <div class="customer-details">
        <h2>รายละเอียดลูกค้า</h2>
        <div class="customer-card">
          <p><strong>#{{ customer.id }}</strong> {{ customer.name }}</p>
          <p>📞 {{ customer.phone }}</p>
          <p>{{ customer.address }}</p>
        </div>

        <h3>จำนวนครั้งที่สั่งสินค้า : {{ orders.length }} ครั้ง</h3>

        <div v-for="order in orders" :key="order.id" class="order-card">
          <h4>Order #{{ order.id }}</h4>
          <small>{{ order.code }}</small>
          <table class="order-table">
            <thead>
              <tr>
                <th>ชื่อสินค้า</th>
                <th>จำนวน</th>
                <th>ราคา</th>
                <th>ราคารวม</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in order.items" :key="idx">
                <td>{{ item.name }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ item.price.toFixed(2) }}</td>
                <td>{{ (item.qty * item.price).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
  height: 100vh;
  background: #f9f9f4;
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
