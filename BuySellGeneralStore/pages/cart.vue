<script setup>
import Navbar from "~/components/UI/Navbar.vue";
import StepProgress from "~/components/UI/StepProgress.vue";
import Summary from "~/components/UI/Summary.vue";

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";

// สเต็ปปัจจุบัน
const currentStep = ref(1);

// เรียกใช้ store
const cartStore = useCartStore();
const cart = cartStore.cart;
const increase = cartStore.increase;
const decrease = cartStore.decrease;
const removeItem = cartStore.removeItem;  // เพิ่มฟังก์ชันลบสินค้า

// รวมจำนวนสินค้า
const totalQty = computed(() =>
  cart.reduce((sum, item) => sum + item.qty, 0)
);

// ใช้งาน router
const router = useRouter();
function cancelOrder() {
  router.push('/');
}
</script>

<template>
  <div>
    <Navbar />

    <div class="cart-container">
      <StepProgress :currentStep="currentStep" />

      <h2>Order</h2>
      <p class="total-qty">รวมจำนวน: {{ totalQty }} ชิ้น</p>

      <div class="cart-content">
        <div class="order-list">
          <div v-for="item in cart" :key="item.id" class="order-item">

            <img :src="item.image" class="item-img" />

            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-price">
                <span v-if="item.oldPrice" class="old-price">
                  {{ (item.oldPrice * item.qty).toFixed(2) }} บาท
                </span>
              </div>
              <div>
                <span :class="item.oldPrice ? 'discounted' : ''">
                  {{ (item.price * item.qty).toFixed(2) }} บาท
                </span>
              </div>
            </div>

            <div class="quantity-control">
              <button @click="decrease(item)">-</button>
              <span>{{ item.qty }}</span>
              <button @click="increase(item)">+</button>
            </div>

            <!-- ปุ่มลบสินค้า -->
            <button class="remove-item-btn" @click="removeItem(item)">×</button>
          </div>
        </div>
        
          <div class="summary1">
            <Summary :cart="cart" :currentStep="currentStep" />
            <div class="buttons">
              
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<style scoped>

.cart-container {
  padding: 2rem;
}

.total-qty {
  font-size: 18px;
  color: #2e8b57;
  margin: 0.5rem 0 1.5rem;
}

.cart-content {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.order-list {
  flex: 2;
}

.order-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  position: relative;
  /* เพื่อให้ปุ่มลบจัดตำแหน่งได้ */
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.item-price .old-price {
  text-decoration: line-through;
  color: gray;
  font-size: 14px;
}

.discounted {
  color: red;
  font-weight: bold;
  font-size: 16px;
}

.quantity-control {
  display: flex;
  gap: 10px;
  align-items: center;
}

.quantity-control button {
  padding: 4px 10px;
  font-size: 16px;
  background-color: #6acc91;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.quantity-control button:hover {
  background-color: #55b27d;
}

/* ปุ่มลบสินค้า */
.remove-item-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #ff4d4f;
  margin-left: 1rem;
  align-self: flex-start;
  line-height: 1;
  user-select: none;
  padding: 0 8px;
  transition: color 0.2s ease-in-out;
}

.remove-item-btn:hover {
  color: #d9363e;
}

.summary1 {
  flex: 1;
}
</style>
