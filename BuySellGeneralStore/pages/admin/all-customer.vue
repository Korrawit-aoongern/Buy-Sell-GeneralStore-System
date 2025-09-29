<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminAside from '~/components/admin/adminaside.vue'
import notification from "~/components/admin/notification.vue"
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)

const customers = ref([])
const searchQuery = ref("")
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

const selectedGroupKey = ref(null) // track selected group

// Compute start and end item for pagination summary
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems.value))

// ✅ Fetch customers from Supabase with range
async function fetchCustomers(page = 1) {


  const { data, error, count } = await supabase
    .from('customer')
    .select('*', { count: 'exact' })
    .order('customerid', { ascending: true })


  if (error) {
    console.error(error)
  } else {
    customers.value = data
    totalItems.value = count
    totalPages.value = Math.ceil(count / itemsPerPage)
    currentPage.value = page
  }
}

onMounted(() => fetchCustomers())

// Group by phone + name
const groupedCustomers = computed(() => {
  const grouped = {}
  customers.value.forEach(c => {
    const key = `${c.phone}-${c.fname}-${c.lname}`
    if (!grouped[key]) {
      grouped[key] = {
        key,
        ids: [c.customerid],
        fname: c.fname,
        lname: c.lname,
        phone: c.phone,
        address: c.address,
        count: 1
      }
    } else {
      grouped[key].ids.push(c.customerid)
      grouped[key].count++
    }
  })
  return Object.values(grouped)
})

// Filter grouped customers
const filteredCustomers = computed(() => {
  if (!searchQuery.value) return groupedCustomers.value
  const q = searchQuery.value.toLowerCase()
  return groupedCustomers.value.filter(c =>
    c.fname.toLowerCase().includes(q) ||
    c.lname.toLowerCase().includes(q) ||
    c.phone.toLowerCase().includes(q) ||
    c.address.toLowerCase().includes(q)
  )
})

// Paginate filtered results (client-side)
const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredCustomers.value.slice(start, start + itemsPerPage)
})

// ✅ Change page (fetch from Supabase)
function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    fetchCustomers(page)
  }
}

// Toggle group selection
function toggleSelection(groupKey) {
  selectedGroupKey.value = selectedGroupKey.value === groupKey ? null : groupKey
}

// Navigate to detail
function goToDetail() {
  if (!selectedGroupKey.value) return
  const group = groupedCustomers.value.find(g => g.key === selectedGroupKey.value)
  if (!group) return

  const params = new URLSearchParams({
    ids: group.ids.join(',')
  }).toString()
  navigateTo(`/admin/customer-detail?${params}`)
}
</script>


<template>
  <div class="dashboard-container">
    <AdminAside />
    <div class="main-content">
      <notification />

      <div class="content">
        <h2>รายการลูกค้า</h2>
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="ค้นหา..." 
          />
        </div>

        <div v-if="selectedGroupKey" class="action-ribbon">
            <div class="action-ribbon-left">
                ลูกค้าที่ถูกเลือก
            </div>
            <div class="action-ribbon-right">
              <button class="btn more" @click="goToDetail">ดูเพิ่มเติม</button>
            </div>
        </div>

        <table class="list-table">
          <thead>
            <tr>
              <th></th>
              <th>ชื่อ</th>
              <th>เบอร์โทร</th>
              <th>ที่อยู่</th>
              <th>จำนวนคำสั่งซื้อ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="group in paginatedCustomers" :key="group.key">
              <td>
                <input
                  type="checkbox"
                  :checked="selectedGroupKey === group.key"
                  @change="toggleSelection(group.key)"
                />
              </td>
              <td>{{ group.fname }} {{ group.lname }}</td>
              <td>{{ group.phone }}</td>
              <td>{{ group.address }}</td>
              <td>{{ group.count }}</td>
            </tr>
          </tbody>
        </table>

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
.dashboard-container {
  display: flex;
  height: 100%;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding: 20px;
}
.customer-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}
.customer-table th, .customer-table td {
  border-bottom: 1px solid #ccc;
  padding: 8px 10px;
  text-align: left;
}
.search-box {
  width: 200px;
  padding: 5px 10px;
  margin-top: 10px;
  margin-bottom: 10px;
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
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.summary {
  margin-left: auto;
  font-size: 14px;
  color: #555;
}
</style>
