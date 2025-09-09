<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
 
const props = defineProps({
  cart: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
});
 
const router = useRouter();
 
const discount = computed(() => {
  return props.cart.reduce((sum, item) => {
    if (item.oldPrice) {
      return sum + (item.oldPrice - item.price) * item.qty;
    }
    return sum;
  }, 0);
});
 
const total = computed(() => {
  return props.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
});
 
function goNext() {
  if (props.currentStep === 1) {
    router.push("/details");
  } else if (props.currentStep === 2) {
    router.push("/submit");
  }
}
 
function cancel() {
  router.push("/");
}
 
function goBack() {
  router.back();
}
</script>
 
<template>
<div class="summary">
<div class="row">
<span>ส่วนลด</span>
<span><strong>{{ discount.toFixed(2) }}</strong></span>
</div>
<div class="row total">
<span>ราคารวม</span>
<span><strong>{{ total.toFixed(2) }}</strong></span>
</div>
 
    <div class="buttons">
<!-- ถ้าอยู่ step 1 = แสดง "ยกเลิก" -->
<button
        v-if="currentStep === 1"
        class="cancel"
        @click="cancel"
>
        ยกเลิก
</button>
 
      <!-- ถ้า step > 1 = แสดง "ย้อนกลับ" -->
<button
        v-else
        class="cancel"
        @click="goBack"
>
        ย้อนกลับ
</button>
 
      <button class="next" @click="goNext">ต่อไป</button>
</div>
</div>
</template>
<style>
.summary {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: "Prompt", sans-serif;
  display: flex;
  flex-direction: column; /* จัดเรียงภายในกล่องเป็นแนวตั้ง */
  justify-content: space-between; /* จัดให้ส่วนลดและราคารวมอยู่ด้านบน, ปุ่มอยู่ด้านล่าง */
  padding: 10px; /* เพิ่ม padding ให้กล่อง */
}
.row {
  display: flex;
  justify-content: space-between;
  display: flex;
  margin: 0 16px;
  padding: 5px;
}
.row span strong {
  font-weight: bold; /* กำหนดให้เลขที่อยู่ใน <strong> เป็นตัวหนา */
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  display: flex;
  justify-content: space-between; /* ให้ปุ่มห่างกัน */
  margin-top: 6rem; /* ช่วยจัดให้ปุ่มอยู่ที่ด้านล่างสุด */
}
.cancel {
  background: #e63946;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  font-family: "Prompt", sans-serif;
  font-weight: 700;
  color: #eff1f3;
  border: none;
  margin: 0 16px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.cancel:hover {
  background: #ff0015;
}
.next {
  background: #6acc91;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  font-family: "Prompt", sans-serif;
  font-weight: 700;
  color: #eff1f3;
  border: none;
  margin: 0 16px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.next:hover {
  background: #00c24d;
}
</style>
