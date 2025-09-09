<template>
  <div class="w-72 rounded-3xl shadow-xl bg-white relative overflow-hidden p-4 flex flex-col items-center">
    <!-- รูปภาพสินค้า -->
    <div class="relative w-full h-40 bg-gray-100 rounded-2xl overflow-hidden mb-4">
      <img
        :src="imageUrl || 'https://via.placeholder.com/300x200.png?text=No+Image'"
        alt="สินค้า"
        class="w-full h-full object-cover"
      />
      
      <!-- SOLD OUT overlay -->
      <div v-if="stock <= 0" class="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
        <span class="text-red-600 text-5xl font-bold rotate-[-30deg]">
          SOLD OUT
        </span>
      </div>
    </div>

    <!-- รายละเอียด -->
    <h3 class="text-lg font-bold text-gray-800 text-center">{{ name }}</h3>
    <p v-if="price" class="text-lg text-black mt-1">{{ price.toFixed(2) }}</p>
    <p v-else class="text-lg text-black mt-1">0.00</p>

    <p :class="stock <= 0 ? 'text-red-500' : 'text-green-600'" class="text-sm font-medium mt-1">
      {{ stock }} Qty.
    </p>

    <!-- ปุ่ม -->
    <button
      :disabled="stock <= 0"
      class="w-full py-2 mt-4 rounded-xl text-white text-sm font-semibold"
      :class="stock <= 0 ? 'bg-red-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'"
    >
      เพิ่มลงตะกร้า
    </button>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, default: 'ชื่อสินค้า' },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' }
});
</script>
