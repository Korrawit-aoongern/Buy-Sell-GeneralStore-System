<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { createClient } from "@supabase/supabase-js";
import adminaside from "~/components/admin/adminaside.vue";

const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
);

const route = useRoute();
const showNotifications = ref(false);

function toggleNotification() {
  showNotifications.value = !showNotifications.value;
}
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const productToDelete = ref(null)
const productToEdit = ref(null)
const imgFile = ref(null)
const product = ref(null);
const errorMsg = ref("");

// cache helpers
function saveWithExpiry(key, value) {
  const now = new Date();
  const item = { value, expiry: now.getTime() + 24 * 60 * 60 * 1000 };
  localStorage.setItem(key, JSON.stringify(item));
}
function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  const item = JSON.parse(itemStr);
  if (Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

function openEdit() {
  productToEdit.value = { ...product.value } // copy current product
  showEditModal.value = true
}
function openDelete() {
  productToDelete.value = product.value.id
  showDeleteModal.value = true
}
function handleFileChange(event) {
  imgFile.value = event.target.files[0]
}

async function uploadProductImage() {
  if (!imgFile.value) return productToEdit.value.image // keep old if no new

  try {
    const fileName = `product_${Date.now()}`
    const { error: storageError } = await supabase.storage
      .from("product")
      .upload(fileName, imgFile.value)

    if (storageError) throw storageError

    const { data: urlData } = supabase.storage
      .from("product")
      .getPublicUrl(fileName)

    return urlData.publicUrl
  } catch (err) {
    console.error("Upload image error:", err)
    return productToEdit.value.image
  }
}

async function submitEdit() {
  if (!productToEdit.value.name || !productToEdit.value.baseprice || !productToEdit.value.quantity) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน")
    return
  }

  const imgUrl = await uploadProductImage()
  productToEdit.value.image = imgUrl

  if (!productToEdit.value.saleprice || productToEdit.value.promotype !== "sale") {
    productToEdit.value.saleprice = productToEdit.value.baseprice
  }

  const { error } = await supabase
    .from("product")
    .update({
      nameproduct: productToEdit.value.name,
      baseprice: productToEdit.value.baseprice,
      saleprice: productToEdit.value.saleprice,
      stock: productToEdit.value.quantity,
      categorytype: productToEdit.value.categorytype,
      promotype: productToEdit.value.promotype,
      is_featured: productToEdit.value.is_featured,
      imgurl: productToEdit.value.image,
    })
    .eq("productid", productToEdit.value.id)

  if (error) {
    console.error("Update error:", error.message)
    alert("อัปเดตไม่สำเร็จ: " + error.message)
  } else {
    alert("อัปเดตสินค้าสำเร็จ")
    product.value = { ...productToEdit.value } // update UI
    showEditModal.value = false
  }
}
async function confirmDelete() {
  if (!productToDelete.value) return;

  const DEFAULT_IMG =
    "https://cdjpebstofhdsmmqpzlw.supabase.co/storage/v1/object/public/product/no-image.jpg";

  try {
    // 1. Check if product is referenced in orderitem
    const { data: refs, error: refError } = await supabase
      .from("orderitem")
      .select("order_item_id")
      .eq("productid", productToDelete.value);

    if (refError) throw refError;

    if (refs && refs.length > 0) {
      // SOFT DELETE
      const { error: updateError } = await supabase
        .from("product")
        .update({ isDelete: true })
        .eq("productid", productToDelete.value);

      if (updateError) throw updateError;

      alert("สินค้านี้มีออเดอร์อยู่ → ทำเครื่องหมายเป็นลบแล้ว (soft delete)");
    } else {
      // HARD DELETE
      const { error: deleteError } = await supabase
        .from("product")
        .delete()
        .eq("productid", productToDelete.value);

      if (deleteError) throw deleteError;

      // delete image if not default
      if (product.value?.image && product.value.image !== DEFAULT_IMG) {
        const path = product.value.image.split("/").pop();
        await supabase.storage.from("product").remove([path]);
      }

      alert("ลบสินค้าสำเร็จ (hard delete)");
    }

    showDeleteModal.value = false;
    window.location.href = "/admin/all-products";
  } catch (err) {
    console.error("Delete error:", err.message);
    alert("ลบสินค้าไม่สำเร็จ: " + err.message);
  }
}

async function fetchProduct(id) {
  try {
    const cached = getWithExpiry(`product_${id}`);
    if (cached) {
      product.value = cached;
      return;
    }

    const { data, error } = await supabase
      .from("product")
      .select(
        "productid, nameproduct, baseprice, saleprice, stock, promotype, categorytype, is_featured, imgurl"
      )
      .eq("productid", id)
      .single();

    if (error || !data) throw error || new Error("ไม่พบสินค้า");

    // transform into UI-friendly structure
    const transformed = {
      id: data.productid,
      name: data.nameproduct,
      categorytype: data.categorytype,
      quantity: data.stock,
      baseprice: data.baseprice,
      saleprice: data.saleprice,
      promotype: data.promotype,
      is_featured: !!data.is_featured,
      image:
        data.imgurl ||
        "https://cdjpebstofhdsmmqpzlw.supabase.co/storage/v1/object/public/product/no-image.jpg",
    };

    product.value = transformed;
    saveWithExpiry(`product_${id}`, transformed);
  } catch (err) {
    console.error(err);
    errorMsg.value = "ไม่สามารถโหลดข้อมูลสินค้าได้";
  }
}

onMounted(() => {
  const id = Number(route.query.id); // ✅ ensure numeric
  if (id) fetchProduct(id);
  else errorMsg.value = "กรุณาเลือกสินค้าที่ต้องการดูจากหน้าสินค้าทั้งหมด";
});
</script>

<template>
  <div class="dashboard-container">
    <adminaside />

    <div class="main-content">
      <header class="topbar">
        <div class="notification" @click="toggleNotification">
          <Icon
            name="material-symbols:notifications-rounded"
            style="color: black; width: 32px; height: 32px"
          />
        </div>
        <div v-if="showNotifications" class="notification-card">
          <div class="notification-header">Notifications</div>
          <!-- example notifications -->
          <div class="notification-list">
            <div class="notification-item">
              <div class="red-dot"></div>
              <div class="notification-text">
                <div class="notification-title">สินค้าของคุณใกล้จะหมดสต๊อก</div>
                <div class="notification-desc">หูฟังเหลือ 1 ชิ้น</div>
              </div>
            </div>
            <div class="notification-item">
              <div class="red-dot"></div>
              <div class="notification-text">
                <div class="notification-title">คำสั่งซื้อใหม่</div>
                <div class="notification-desc">ออเดอร์ #1234 รอการยืนยัน</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="content">
        <h2 class="title">รายละเอียดสินค้า</h2>

        <div v-if="errorMsg"><p>{{ errorMsg }}</p></div>

        <div v-else-if="product">
          <div class="product-header">
            <h3>#{{ product.id }} {{ product.name }}</h3>
            <div class="actions">
              <button class="btn-edit" @click="openEdit">แก้ไข</button>
              <button class="btn-delete" @click="openDelete">ลบ</button>
            </div>
          </div>

          <div class="product-detail">
            <!-- Left -->
            <div class="left">
              <div class="card">
                <h4>รายละเอียด</h4>
                <p><b>ชื่อสินค้า:</b> {{ product.name }}</p>
                <p><b>จำนวน:</b> {{ product.quantity }}</p>
              </div>
              <div class="card image-card">
                <h4>รูปสินค้า</h4>
                <img :src="product.image" alt="Product Image" style="width: 100%; background-size: auto;" />
              </div>
            </div>

            <!-- Right -->
            <div class="right">
              <div class="card">
                <h4>Type</h4>
                <p><b>หมวดหมู่สินค้า:</b> {{ product.categorytype }}</p>
                <p><b>ประเภทการขาย:</b> {{ product.promotype }}</p>
                <label style="display: flex;">
                  แสดงในหน้าหลัก <input type="checkbox" v-model="product.is_featured" disabled style="width: 20%;" />
                </label>
              </div>
              <div class="card">
                <h4>ราคา</h4>
                <p>
                  <b>ราคา:</b>
                  {{ new Intl.NumberFormat("th-TH",{minimumFractionDigits:2}).format(product.baseprice) }}฿
                </p>
                <p>
                  <b>ส่วนลดเปอร์เซ็น:</b>
                  {{
                    product.baseprice > 0
                      ? (((product.baseprice - product.saleprice) / product.baseprice) * 100).toFixed(0)
                      : 0
                  }}%
                </p>
                <p>
                  <b>ราคาหลังลด:</b>
                  {{ new Intl.NumberFormat("th-TH",{minimumFractionDigits:2}).format(product.saleprice) }}฿
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else><p>กำลังโหลด...</p></div>
      </div>
    </div>
    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h3>แก้ไขสินค้า</h3>

        <label class="form-label">รูปสินค้า</label>
        <div class="upload-box">
          <input type="file" accept="image/*" @change="handleFileChange" />
          <div v-if="productToEdit.image" class="preview">
            <img :src="productToEdit.image" alt="Product image" />
          </div>
          <p>ใส่รูปภาพ</p>
        </div>

        <label class="form-label">ชื่อ</label>
        <input v-model="productToEdit.name" placeholder="ชื่อสินค้า" />

        <label class="form-label">ราคา</label>
        <input v-model.number="productToEdit.baseprice" type="number" placeholder="ราคา" />

        <label class="form-label">ลดเหลือ</label>
        <input 
          v-model.number="productToEdit.saleprice" 
          type="number" 
          placeholder="ลดเหลือ"
          :disabled="productToEdit.promotype !== 'sale'" 
        />

        <label class="form-label">จำนวน</label>
        <input v-model.number="productToEdit.quantity" type="number" placeholder="จำนวน" />

        <label class="form-label">หมวดหมู่</label>
        <select v-model="productToEdit.categorytype">
          <option value="foods">อาหาร</option>
          <option value="stationary">เครื่องเขียน</option>
          <option value="kitchen">ของใช้ในครัว</option>
          <option value="bathroom">ของใช้ในห้องนํ้า</option>
          <option value="decoration">ของตกแต่งบ้าน</option>
          <option value="personal">ของใช้ส่วนตัว</option>
          <option value="technology">เทคโนโลยี</option>
          <option value="outdoors">ของใช้กลางแจ้ง</option>
          <option value="general">ของใช้ในบ้านทั่วไป</option>
        </select>

        <label class="form-label">ประเภทการขาย</label>
        <select v-model="productToEdit.promotype">
          <option value="sale">สินค้าลดราคา</option>
          <option value="hot">สินค้าขายดี</option>
          <option value="normal">สินค้าปกติ</option>
        </select>

        <div class="checkbox-field">
          <label style="font-weight: bold;">แสดงในหน้าหลัก</label>
          <input type="checkbox" v-model="productToEdit.is_featured" style="margin-left: 1em; width: 10%;" />
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="showEditModal = false">ยกเลิก</button>
          <button class="btn-submit" @click="submitEdit">บันทึก</button>
        </div>
      </div>
    </div>
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3 style="color: #E73B3B;">Confirm Delete?</h3>
        <p>คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDeleteModal = false">Cancel</button>
          <button class="btn-danger" @click="confirmDelete">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: 'prompt', sans-serif;
}

.dashboard-container {
  display: flex;
  height: 100vh;
}

/* Main Content */
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

.notification {
  height: 32px;
  cursor: pointer;
}

.notification-card {
  position: absolute;
  top: 75px;
  right: 20px;
  background: #fff;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 1000;
}

.notification-header {
  font-size: 14px;
  font-weight: bold;
  padding: 10px 15px;
  border-bottom: 1px solid #E5E5E5;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 15px;
  border-bottom: 1px solid #E5E5E5;
}

.red-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  margin-top: 5px;
  margin-right: 10px;
}

.notification-text {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.notification-desc {
  font-size: 13px;
  color: #555;
}

.content {
  padding: 20px;
}

.title {
  font-size: 20px;
  margin-bottom: 15px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  background-color: white;
  padding: 1.2em;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.actions button{
  margin-left: 10px;
  padding: 0.5em 6em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-edit {
  background: #CACC6A;
  font-family: Prompt, sans-serif;
  color: white;
}

.btn-delete {
  background: #D9534F;
  font-family: Prompt, sans-serif;
  color: white;
}

.product-detail {
  display: flex;
  gap: 20px;
}

.left, .right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
}

.image-card img {
  border-radius: 5px;
  margin-top: 10px;
}
</style>
