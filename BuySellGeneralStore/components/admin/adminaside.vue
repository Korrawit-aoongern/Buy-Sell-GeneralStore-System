<template>
  <nav class="sidebar">
    <h1 class="sidebar-title">จัดการร้านค้า</h1>
    <ul class="menu">
      <li><NuxtLink to="/admin/shop-info">แก้ไขข้อมูลพื้นฐาน</NuxtLink></li>
      <li><NuxtLink to="/admin/dashboard">หน้าหลัก</NuxtLink></li>
      <li><NuxtLink to="/admin/all-products">รายการสินค้า</NuxtLink></li>
      <li><NuxtLink to="/admin/add-product">เพิ่มสินค้า</NuxtLink></li>
      <li><NuxtLink to="/admin/product-detail">รายละเอียดสินค้า</NuxtLink></li>
      <li><NuxtLink to="/admin/all-orders">รายการออเดอร์</NuxtLink></li>
      <li><NuxtLink to="/admin/order-detail">รายละเอียดออเดอร์</NuxtLink></li>
      <li><NuxtLink to="/admin/all-customer">รายการลูกค้า</NuxtLink></li>
      <li><NuxtLink to="/admin/customer-detail">รายละเอียดลูกค้า</NuxtLink></li>
    </ul>
  </nav>
</template>

<style scoped>
.sidebar {
  height: 140%;
  width: 250px;
  background-color: #597162;
  color: white;
  padding: 20px;
  box-sizing: border-box;
}

.sidebar-title {
  color: #6ACC91;
  font-weight: bold;
  margin-bottom: 30px;
  font-size: 24px;
  text-align: center;
}

.menu {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  gap: 1em;
}

.menu li {
  margin-bottom: 15px;
}

.menu a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  display: block;
  padding: 0.5em 1em;
}

.menu a:hover {
  background-color: #566a5e;
  border: 1px solid #8BAF99;
  border-radius: 10px;
  text-decoration: none;
  padding: 0.5em 1em;
}

.menu a.router-link-exact-active {
  background-color: #4F6155;
  border: 1px solid #8BAF99;
  border-radius: 10px;
  padding: 0.5em 1em;
}
</style>
