<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from '~/stores/cart'
const cartStore = useCartStore()
const props = defineProps({
  cart: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
  disableNext: {
    type: Boolean,
    default: false,
  },
  userInfo: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["next", "back", "cancel"]);

const router = useRouter();

const discount = computed(() => {
  return props.cart.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.qty;
    }
    return sum;
  }, 0);
});

const total = computed(() => {
  return props.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
});

const isNextDisabled = computed(() => props.cart.length === 0 || props.disableNext);

function goNext() {
  if (isNextDisabled.value) return;

  emit("next");

  if (props.currentStep === 1) {
    router.push("/details");
  } else if (props.currentStep === 2) {
    if (props.userInfo.paymentMethod === "PromptPay") {
      router.push("/promptpay");
    } else {
      router.push("/some-other-page"); // เปลี่ยนเป็นหน้าอื่นถ้าจำเป็น
    }
  }
}

function cancel() {
  cartStore.clearCart()
  emit("cancel");
  router.push("/");
}

function goBack() {
  emit("back");
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
      <button
        v-if="currentStep === 1"
        class="cancel"
        @click="cancel"
      >
        ยกเลิก
      </button>

      <button
        v-else
        class="cancel"
        @click="goBack"
      >
        ย้อนกลับ
      </button>

      <button
        class="next"
        @click="goNext"
        :disabled="isNextDisabled"
      >
        ต่อไป
      </button>
    </div>
  </div>
</template>



<style scoped>
.summary {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: "Prompt", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1.5rem; /* ✅ ขยับกล่องลงมาจากด้านบน */
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 16px;
  padding: 5px;
}

.row:first-of-type {
  margin-top: 2rem; /* ✅ ขยับแถว "ส่วนลด" ลงมา */
}

.row span strong {
  font-weight: bold;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: space-between;
  margin-top: 6rem; /* ✅ ดันปุ่มลงล่าง */
}

.cancel {
  background: #e63946;
  color: #eff1f3;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-family: "Prompt", sans-serif;
  font-weight: 700;
  margin: 0 16px;
  height: 32px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cancel:hover {
  background: #ff0015;
}

.next {
  background: #6acc91;
  color: #eff1f3;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-family: "Prompt", sans-serif;
  font-weight: 700;
  margin: 0 16px;
  height: 32px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.next:hover {
  background: #00c24d;
}
</style>
