<script setup>
import { ref } from 'vue'
import adminaside from '~/components/admin/adminaside.vue'
import notification from "~/components/admin/notification.vue";
import { createClient } from '@supabase/supabase-js'

const products = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

const selectedRows = ref([]) // store productids
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const productToEdit = ref(null)
const imgFile = ref(null)
const isMultipleEdit = ref(false)

const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
);
const searchQuery = ref("")

// computed for live filtering
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const query = searchQuery.value.toLowerCase()
  return products.value.filter((p) =>
    Object.values(p).some((val) =>
      String(val).toLowerCase().includes(query)
    )
  )
})
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage, totalItems.value))

const categories = [
  { label: "อาหาร", value: "foods" },
  { label: "เครื่องเขียน", value: "stationary" },
  { label: "ของใช้ในครัว", value: "kitchen" },
  { label: "ของใช้ในห้องนํ้า", value: "bathroom" },
  { label: "ของตกแต่งบ้าน", value: "decoration" },
  { label: "ของใช้ส่วนตัว", value: "personal" },
  { label: "เทคโนโลยี", value: "technology" },
  { label: "ของใช้กลางแจ้ง", value: "outdoors" },
  { label: "ของใช้ในบ้านทั่วไป", value: "general" }
]

// promo types
const promoTypes = [
  { label: "สินค้าลดราคา", value: "sale" },
  { label: "สินค้าขายดี", value: "hot" },
  { label: "สินค้าปกติ", value: "normal" }
]
function saveWithExpiry(key, value) {
  const now = new Date();
  const item = { value, expiry: now.getTime() + 24 * 60 * 60 * 1000 };
  localStorage.setItem(key, JSON.stringify(item));
}
async function fetchProducts(page = 1) {
  const from = (page - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  const { data, error, count } = await supabase
    .from('product')
    .select('productid, nameproduct, baseprice, saleprice, stock, promotype, categorytype, is_featured, isDelete', { count: 'exact' })
    .eq('isDelete', false)
    .order('productid', { ascending: true }) // 👈 sort by ID ASC
    .range(from, to) // 👈 pagination

  if (error) {
    console.error('Error fetching products:', error.message)
  } else {
    products.value = data
    totalItems.value = count
    totalPages.value = Math.ceil(count / itemsPerPage)
    currentPage.value = page
  }
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    fetchProducts(page)
  }
}
function toggleSelection(productid) {
  if (selectedRows.value.includes(productid)) {
    selectedRows.value = selectedRows.value.filter(id => id !== productid)
  } else {
    selectedRows.value.push(productid)
  }
}
const allSelected = computed({
  get() {
    return selectedRows.value.length === filteredProducts.value.length && filteredProducts.value.length > 0
  },
  set(value) {
    if (value) {
      selectedRows.value = filteredProducts.value.map(p => p.productid)
    } else {
      selectedRows.value = []
    }
  }
})

const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 &&
         selectedRows.value.length < filteredProducts.value.length
})
function openEdit(productid) {
  const product = products.value.find(p => p.productid === productid)
  productToEdit.value = { ...product }
  showEditModal.value = true
}

function handleFileChange(event) {
  imgFile.value = event.target.files[0]
}

// ✅ Upload image to Supabase bucket and get public URL
async function uploadProductImage() {
  if (!imgFile.value) return productToEdit.value.imgurl // if no new file, keep old

  try {
    const fileName = `product_${Date.now()}`
    const { data: storageData, error: storageError } = await supabase.storage
      .from("product") // your bucket name
      .upload(fileName, imgFile.value)

    if (storageError) throw storageError

    // get public URL
    const { data: urlData } = supabase.storage
      .from("product")
      .getPublicUrl(fileName)

    return urlData.publicUrl
  } catch (err) {
    console.error("Upload image error:", err)
    return productToEdit.value.imgurl // fallback
  }
}

// ✅ Submit edit including image upload
async function submitEdit() {
  if (!productToEdit.value.categorytype || !productToEdit.value.promotype) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน")
    return
  }

  if (!isMultipleEdit.value) {
    // Single edit (full fields)
    const imgUrl = await uploadProductImage()
    productToEdit.value.imgurl = imgUrl

    if (!productToEdit.value.nameproduct || !productToEdit.value.baseprice || !productToEdit.value.stock) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    if (!productToEdit.value.saleprice || productToEdit.value.promotype !== "sale") {
      productToEdit.value.saleprice = productToEdit.value.baseprice
    }

    const { error } = await supabase
      .from('product')
      .update({
        imgurl: productToEdit.value.imgurl,
        nameproduct: productToEdit.value.nameproduct,
        baseprice: productToEdit.value.baseprice,
        saleprice: productToEdit.value.saleprice,
        stock: productToEdit.value.stock,
        categorytype: productToEdit.value.categorytype,
        promotype: productToEdit.value.promotype,
        is_featured: productToEdit.value.is_featured
      })
      .eq('productid', productToEdit.value.productid)

    if (error) {
      console.error("Update error:", error.message)
      alert("อัปเดตไม่สำเร็จ: " + error.message)
    } else {
      showEditModal.value = false
      saveWithExpiry(`product_${productToEdit.value.productid}`, productToEdit.value) // overwrite cache
      alert("อัปเดตสินค้าสำเร็จ")
    }
  } else {
    // Multiple edit (bulk update)
    const { error } = await supabase
      .from('product')
      .update({
        categorytype: productToEdit.value.categorytype,
        promotype: productToEdit.value.promotype,
        is_featured: !!productToEdit.value.is_featured
      })
      .in('productid', selectedRows.value)

    if (error) {
      console.error("Bulk update error:", error.message)
      alert("อัปเดตหลายสินค้าไม่สำเร็จ: " + error.message)
    } else {
      alert("อัปเดตหลายสินค้าสำเร็จ")
      showEditModal.value = false
      selectedRows.value = []  // clear selection after bulk edit
    }
  }

  fetchProducts(currentPage.value)
}

async function openEditMultiple() {
  if (!selectedRows.value.length) return

  // Fetch selected products from Supabase
  const { data, error } = await supabase
    .from('product')
    .select('productid, categorytype, promotype, is_featured')
    .in('productid', selectedRows.value)

  if (error) {
    console.error(error)
    return
  }

  // Take the first product for default values in the modal
  const firstProduct = data[0]
  productToEdit.value = { 
    categorytype: firstProduct.categorytype,
    promotype: firstProduct.promotype,
    is_featured: !!firstProduct.is_featured
  }
  isMultipleEdit.value = true
  showEditModal.value = true
}

function openDeleteMultiple() {
  showDeleteModal.value = true
}


async function confirmDelete() {
  try {
    if (selectedRows.value.length === 1) {
      const productid = selectedRows.value[0]

      // Get product info (need image_url to know if we should delete it)
      const { data: productData, error: productError } = await supabase
        .from("product")
        .select("imgurl")
        .eq("productid", productid)
        .single()

      if (productError) throw productError

      // Check if product exists in orderitem
      const { data: orderRefs, error: orderCheckError } = await supabase
        .from("orderitem")
        .select("order_item_id")
        .eq("productid", productid)

      if (orderCheckError) throw orderCheckError

      if (orderRefs && orderRefs.length > 0) {
        // Product is used in orderitem -> soft delete
        const { error: softDeleteError } = await supabase
          .from("product")
          .update({ isDelete: true })
          .eq("productid", productid)

        if (softDeleteError) throw softDeleteError
      } else {
        // Product is not referenced -> hard delete

        // 1. Delete product row
        const { error: hardDeleteError } = await supabase
          .from("product")
          .delete()
          .eq("productid", productid)

        if (hardDeleteError) throw hardDeleteError

        // 2. Delete image if not the default one
        const imageUrl = productData?.imgurl
        const defaultUrl =
          "https://cdjpebstofhdsmmqpzlw.supabase.co/storage/v1/object/public/product/no-image.jpg"

        if (imageUrl && imageUrl !== defaultUrl) {
          // Extract path from URL (after `/product/`)
          const imagePath = imageUrl.split("/product/")[1]

          if (imagePath) {
            const { error: storageError } = await supabase.storage
              .from("product")
              .remove([imagePath])

            if (storageError) throw storageError
          }
        }
      }
    } else {
      // Multiple delete
      for (const productid of selectedRows.value) {
        const { data: productData } = await supabase
          .from("product")
          .select("imgurl")
          .eq("productid", productid)
          .single()

        const { data: orderRefs } = await supabase
          .from("orderitem")
          .select("order_item_id")
          .eq("productid", productid)

        if (orderRefs && orderRefs.length > 0) {
          await supabase
            .from("product")
            .update({ isDelete: true })
            .eq("productid", productid)
        } else {
          await supabase.from("product").delete().eq("productid", productid)

          const imageUrl = productData?.imgurl
          const defaultUrl =
            "https://cdjpebstofhdsmmqpzlw.supabase.co/storage/v1/object/public/product/no-image.jpg"

          if (imageUrl && imageUrl !== defaultUrl) {
            const imagePath = imageUrl.split("/product/")[1]
            if (imagePath) {
              await supabase.storage.from("product").remove([imagePath])
            }
          }
        }
      }
    }

    // Refresh after delete
    fetchProducts(currentPage.value)
    showDeleteModal.value = false
    selectedRows.value = []
    alert("ลบลินค้าสำเร็จ")
  } catch (err) {
    console.error("ลบสินค้าไม่สำเร็จ:", err.message)
  }
}


onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="dashboard-container">
    <!-- ✅ ใช้ Sidebar ที่แยกออกมา -->
    <adminaside />
    <!-- Main Content -->
    <div class="main-content">
      <notification/>

      <div class="table-list">
        <h2>รายการสินค้า</h2>

        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="ค้นหา..." 
          />
        </div>

        <div v-if="selectedRows.length > 0" class="action-ribbon">
          <div class="action-ribbon-left">
            {{ selectedRows.length }} สินค้าที่ถูกเลือก
          </div>
          <div class="action-ribbon-right">
            <!-- ดูเพิ่มเติม only when 1 row selected -->
            <button 
              v-if="selectedRows.length === 1" 
              class="btn more" 
               @click="$router.push({ path: '/admin/product-detail', query: { id: selectedRows[0] } })">
              ดูเพิ่มเติม
            </button>

            <!-- Edit button -->
            <button class="btn edit" @click="selectedRows.length === 1 ? openEdit(selectedRows[0]) : openEditMultiple()">
              แก้ไข
            </button>

            <!-- Delete button -->
            <button class="btn delete" @click="openDeleteMultiple">
              ลบ
            </button>
          </div>
        </div>
        <table class="list-table">
          <thead>
            <tr>
              <th><input 
                type="checkbox"
                v-model="allSelected"
                :indeterminate="isIndeterminate"/>
              </th>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>ราคา</th>
              <th>ลดเหลือ</th>
              <th>จำนวนสต็อก</th>
              <th>ประเภทการขาย</th>
              <th>หมวดหมู่</th>
              <th>แสดงในหน้าหลัก</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, index) in filteredProducts" :key="index">
              <td>
                <input 
                  type="checkbox" 
                  :value="p.productid" 
                  :checked="selectedRows.includes(p.productid)"
                  @change="toggleSelection(p.productid)" 
                />
              </td>
              <td>{{ p.productid }}</td>
              <td :title="p.nameproduct">
                {{ p.nameproduct.length > 64 ? p.nameproduct.slice(0, 64) + '...' : p.nameproduct }}
              </td>
              <td>{{ new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(p.baseprice) }}฿</td>
              <td>{{ new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(p.saleprice) }}฿</td>
              <td>{{ p.stock }}</td>
              <td>{{ p.promotype }}</td>
              <td>{{ p.categorytype }}</td>
              <td><input type="checkbox" v-model="p.is_featured" disabled /></td>
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

                <!-- Edit Modal -->
        <div v-if="showEditModal" class="modal-overlay">
            <div class="modal-content">
              <h3>แก้ไขสินค้า</h3>

              <!-- Upload Box -->
              <label class="form-label" v-if="!isMultipleEdit">รูปสินค้า</label>
              <div class="upload-box" v-if="!isMultipleEdit">
                <input class="form-field" type="file" accept="image/*" @change="handleFileChange" />
                <div v-if="productToEdit.imgurl" class="preview">
                  <img :src="productToEdit.imgurl" alt="Product image" />
                </div>
                <p>ใส่รูปภาพ</p>
              </div>

              <label class="form-label" v-if="!isMultipleEdit">ชื่อ</label>
              <input v-model="productToEdit.nameproduct" placeholder="ชื่อสินค้า" v-if="!isMultipleEdit" class="form-field"/>


              <label class="form-label" v-if="!isMultipleEdit">ราคา</label>
              <input v-model.number="productToEdit.baseprice" placeholder="ราคา" type="number" v-if="!isMultipleEdit" class="form-field"/>

              <label class="form-label" v-if="!isMultipleEdit">ลดเหลือ</label>
              <input 
                v-model.number="productToEdit.saleprice" 
                placeholder="ลดเหลือ" 
                type="number" 
                :disabled="productToEdit.promotype !== 'sale'" 
                v-if="!isMultipleEdit"
                class="form-field"
              />

              <label class="form-label" v-if="!isMultipleEdit">จำนวน</label>
              <input v-model.number="productToEdit.stock" type="number" placeholder="จำนวน" class="form-field"  min="0"/>

              <label class="form-label">หมวดหมู่</label>
              <select v-model="productToEdit.categorytype" class="form-field">
                <option v-for="c in categories" :key="c.value" :value="c.value">
                  {{ c.label }}
                </option>
              </select>

              <label class="form-label">ประเภทการขาย</label>
              <select v-model="productToEdit.promotype" class="form-field">
                <option v-for="p in promoTypes" :key="p.value" :value="p.value" >
                  {{ p.label }}
                </option>
              </select>

              <div class="checkbox-field">
                <label style="font-weight: bold;">
                  แสดงในหน้าหลัก
                </label>
                <input type="checkbox" v-model="productToEdit.is_featured" style="margin-left: 1em; width: 10%;" />
              </div>

              <div class="modal-actions">
                <button class="btn-cancel" @click="showEditModal = false">ยกเลิก</button>
                <button class="btn-submit" @click="submitEdit">บันทึก</button>
              </div>
            </div>
        </div>

        <!-- Delete Confirm Modal -->
        <div v-if="showDeleteModal" class="modal-overlay">
          <div class="modal-content">
            <h3 style="color: #E73B3B;">Confirm Delete?</h3>
            <p>คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?</p>
            <div class="modal-actions">
              <button class="btn-cancel" @click="showDeleteModal = false" >Cancel</button>
              <button class="btn-danger" @click="confirmDelete">Yes</button>
            </div>
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
}

/* main content remains */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
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


.table-list {
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
  background-color: #f7f7f7;
  flex: 1;
}

.search-bar {
  margin-bottom: 10px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
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
.action-ribbon {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #597162;
  color: #EFF1F3;
  padding: 10px 20px;
  border-radius: 10px 10px 0 0;
  margin-top: 10px;
}

.action-ribbon .btn {
  margin-left: 10px;
  padding: 8px 42px;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-family: Prompt, sans-serif;
  font-weight: bold;
  cursor: pointer;
}
.action-ribbon-left {
  display: flex;
  flex-direction: row;
  gap: 15px;
}
.action-ribbon-right{
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.action-ribbon .btn.more {
  background: #6ACC91;
  color: #EFF1F3;
}

.action-ribbon .btn.edit {
  background: #CACC6A;
  color: #EFF1F3;
}

.action-ribbon .btn.delete {
  background: #E73B3B;
  color: #EFF1F3;
}

/* Modal */
.upload-box {
  border: 2px dashed #ccc;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  margin-bottom: 10px;
  position: relative;
}

.upload-box input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  top: 0;
  left: 0;
}

.upload-box .preview img {
  max-width: 100%;
  max-height: 100px;
  margin-top: 10px;
  border-radius: 4px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-bottom: 15px;
}

.form-label {
  font-weight: bold;
  margin-top: 10px;
  display: block;
}

.form-field {
  width: 100%;
  padding: 8px;
  margin: 5px 0 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.upload-box {
  border: 2px dashed #ccc;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  margin-bottom: 10px;
}

.checkbox-field {
  margin: 10px 0;
  display: flex;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn-danger {
  background: #E73B3B;
  color: #EFF1F3;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-cancel {
  background: #ccc;
  color: black;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-submit {
  background: #597162;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

</style>
