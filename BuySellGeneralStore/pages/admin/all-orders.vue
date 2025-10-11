<script setup>
import { ref } from "vue";
import adminaside from '~/components/admin/adminaside.vue'
import notification from "~/components/admin/notification.vue";
import { createClient } from '@supabase/supabase-js';

const orders = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

const selectedRows = ref([])
const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
);
const searchQuery = ref("")

const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value
  const query = searchQuery.value.toLowerCase()
  return orders.value.filter((p) =>
    Object.values(p).some((val) =>
      String(val).toLowerCase().includes(query)
    )
  )
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage, totalItems.value))

async function fetchOrders(page = 1) {
  const from = (page - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  const { data, error, count } = await supabase
    .from('order')
    .select('orderid, orderdate, total_amount, billingid, status, payment_method, isDelete', { count: 'exact' })
    .eq('isDelete', false)
    .order('orderid', { ascending: false })
    .range(from, to) // 👈 pagination

  if (error) {
    console.error('Error fetching orders:', error.message)
  } else {
    orders.value = data
    totalItems.value = count
    totalPages.value = Math.ceil(count / itemsPerPage)
    currentPage.value = page
  }
}
function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    fetchOrders(page)
  }
}
function toggleSelection(orderid) {
  if (selectedRows.value.includes(orderid)) {
    selectedRows.value = selectedRows.value.filter(id => id !== orderid)
  } else {
    selectedRows.value.push(orderid)
  }
}
const allSelected = computed({
  get() {
    return selectedRows.value.length === filteredOrders.value.length && filteredOrders.value.length > 0
  },
  set(value) {
    if (value) {
      selectedRows.value = filteredOrders.value.map(o => o.orderid)
    } else {
      selectedRows.value = []
    }
  }
})
const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 &&
         selectedRows.value.length < filteredOrders.value.length
})
async function updateStatus(newStatus) {
  if (!newStatus) return
  try {
    const { error } = await supabase
      .from("order")
      .update({ status: newStatus })
      .in("orderid", selectedRows.value)

    if (error) throw error

    alert("อัปเดตสถานะสำเร็จ")
    fetchOrders(currentPage.value)
    selectedRows.value = []
  } catch (err) {
    console.error("Update status error:", err.message)
    alert("อัปเดตสถานะไม่สำเร็จ: " + err.message)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <adminaside />

    <!-- Main Content -->
    <div class="main-content">
      <notification/>
      <!-- Order List -->
      <div class="table-list">
        <h2>รายการออเดอร์</h2>

        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="ค้นหา..."
          />
        </div>
        <div v-if="selectedRows.length > 0" class="action-ribbon">
          <div class="action-ribbon-left">
            {{ selectedRows.length }} รายการที่ถูกเลือก
          </div>
          <div class="action-ribbon-right">
            <!-- ดูเพิ่มเติม only when 1 row selected -->
            <button 
              v-if="selectedRows.length === 1" 
              class="btn more" 
              @click="$router.push({ path: '/admin/order-detail', query: { id: selectedRows[0] } })">
              ดูเพิ่มเติม
            </button>

            <!-- Status dropdown -->
            <select class="btn select-status" @change="updateStatus($event.target.value)">
              <option value="" disabled selected>สถานะ</option>
              <option value="Complete">เสร็จสิ้น</option>
              <option value="Delivery">จัดส่ง</option>
              <option value="Pending">รอดำเนินการ</option>
            </select>
          </div>
        </div>
        <table class="list-table">
          <thead>
            <tr>
              <th>
                <input 
                type="checkbox"
                v-model="allSelected"
                :indeterminate="isIndeterminate"/>
              </th>
              <th>รหัส</th>
              <th>บิลไอดี</th>
              <th>สถานะ</th>
              <th>วันที่ทำรายการ</th>
              <th>ราคารวม</th>
              <th>วิธีชำระ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(o, index) in filteredOrders" :key="index">
              <td>
                <input 
                  type="checkbox" 
                  :value="o.orderid" 
                  :checked="selectedRows.includes(o.orderid)"
                  @change="toggleSelection(o.orderid)" 
                />
              </td>
              <td>{{ o.orderid }}</td>
              <td>{{ o.billingid }}</td>
              <td>{{ o.status }}</td>
              <td>{{ new Date(o.orderdate).toLocaleString("sv-SE", { hour12: false }).replace("T", " ") }}</td>
              <td>{{ new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(o.total_amount) }}฿</td>
              <td>{{ (o.payment_method == "COD") ? "ปลายทาง" : "Prompt Pay" }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="pagination">
          <div>
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
          <button
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
          </div>
          <div class="pagination-info">
            แสดงสินค้า {{ startItem }} - {{ endItem }} จาก {{ totalItems }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Prompt, sans-serif;
}

.dashboard-container {
  display: flex;
  height: 100%;
  min-height: 100vh;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.table-list {
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
  background-color: #f7f7f7;
  flex: 1;
}

.topbar {
  height: 60px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}
.select-status {
  margin: 0;
  color: black;
  font-size: 12px;
  font-family: Prompt, sans-serif;
  font-weight: bold;
}

.list-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.list-table th,
.list-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
}

.list-table th {
  background-color: #f0f0f0;
  color: #111827;
}

.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.pagination button {
  padding: 5px 10px;
  border: none;
  background-color: #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.pagination .active {
  background-color: #597162;
  color: white;
}
.pagination-info {
  color: #A8A4A4;
  padding-right: 2em;
}
input[type="checkbox"]:indeterminate {
  background-color: #ccc;
  border-color: #999;
}
</style>
