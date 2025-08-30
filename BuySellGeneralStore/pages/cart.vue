<script setup>
import Navbar from "~/components/UI/Navbar.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import StepProgress from "~/components/UI/StepProgress.vue";
import Summary from "~/components/UI/Summary.vue";

const router = useRouter();
const currentStep = ref(1);

// mock data
const cart = ref([
  {
    id: 1,
    name: "ไข่ไก่ เบอร์ 1",
    price: 4.7,
    qty: 1,
    image: "/Image/pen.jpg",
  },
  {
    id: 2,
    name: "บะหมี่กึ่งสำเร็จรูป",
    price: 10.0,
    oldPrice: 12.0,
    qty: 1,
    image: "/Image/pen.jpg",
  },
]);
</script>

<template>
  <div>
    <!-- Navbar -->
    <div>
      <Navbar />
    </div>

    <div class="cart-container">
      <!-- Progress bar -->
      <div>
        <StepProgress :currentStep="currentStep" />
      </div>

      <h2>Order</h2>
      <div class="cart-content">
        <!-- สินค้า -->
        <div class="order-list">
          <div v-for="item in cart" :key="item.id" class="order-item">
            <img :src="item.image" class="item-img" />
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-price">
                <span v-if="item.oldPrice" class="old-price">
                  {{ item.oldPrice.toFixed(2) }} บาท
                </span>
              </div>
              <div>
                <span :class="item.oldPrice ? 'discounted' : ''">
                  {{ item.price.toFixed(2) }} บาท
                </span>
              </div>
            </div>
            <div class="quantity-control">
              <button @click="decrease(item)">-</button>
              <span>{{ item.qty }}</span>
              <button @click="increase(item)">+</button>
            </div>
          </div>
        </div>

        <!-- ส่วนลด / รวม -->
        <div class="summary1">
          <Summary :cart="cart" :currentStep="currentStep" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #fafaf5;
  font-family: "Prompt", sans-serif;
  min-height: 100vh;
}
.cart-container {
  max-width: 900px;
  margin: auto;
  margin-top: 4rem;
  font-family: sans-serif;
}

.cart-content {
  display: flex;
  gap: 6rem;
  margin-top: 0.5rem;
}

.order-list {
  flex: 2;
}
.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: "Prompt", sans-serif;
}
.item-img {
  width: 60px;
  height: 60px;
  margin-right: 1rem;
}
.item-info {
  flex: 1;
}
.item-name {
  font-weight: bold;
}
.item-price {
  font-size: 0.7rem;
  font-family: "Prompt", sans-serif;
}
.old-price {
  text-decoration: line-through;
  color: #888;
  margin-right: 5px;
}
.discounted {
  color: red;
  font-weight: bold;
}

.quantity-control {
  display: flex;
  margin-top: 30px;
}
.quantity-control button {
  width: 30px;
  height: 30px;
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
}
.quantity-control span {
  margin: 0 8px;
  font-size: 16px;
  font-family: "Prompt", sans-serif;
}
h2 {
  font-family: "Prompt", sans-serif;
  margin: 20px;
  padding: 0px;
}
.summary1 {
  flex: 1;
}
</style>
