<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useCart } from '~/composables/useCart'
const { cartCount } = useCart()
</script>

<template>
  <nav class="navbar">
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/Product-Listing">Product</router-link></li>
      <li><router-link to="/Order">Order</router-link></li>

    </ul>
    <div class="cart-icon">
      <router-link to="/cart">
        <Icon
          name="material-symbols:shopping-cart-outline"
          style="color: black; width: 45px; height: 45px"
        />
        <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
      </router-link>
    </div>
  </nav>
</template>

<style>
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  margin: 1rem 2rem;
  padding: 1rem 2rem;
}
.nav-links {
  display: flex;
  gap: 136px;
  list-style: none;
  position: absolute;
  right: 34%;
  top: 5%
}
.nav-links li a {
  text-decoration: none;
  color: #6acc91;
  cursor: pointer;
}
/* ⭐ ใช้อันนี้แทน */
.router-link-exact-active {
  font-weight: bold;
  color: #2e8b57;
}

.cart-icon {
  position: absolute;
  right: 0;
  top: 5%;
  margin-right: 166px;
  font-size: 24px;
  color: #111827;
}
.cart-count {
  position: absolute;
  top: -10px;
  right: -10px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 4px 8px;
  font-size: 14px;
}
</style>
