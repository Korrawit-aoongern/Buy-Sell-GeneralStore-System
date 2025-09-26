<script setup>
import { ref } from 'vue'
import adminaside from '~/components/admin/adminaside.vue'
import notification from "~/components/admin/notification.vue";
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)

// Form fields
const nameproduct = ref('')
const baseprice = ref(null)
const saleprice = ref(null)
const stock = ref(null)
const categorytype = ref('')
const promotype = ref('')
const is_featured = ref(false)
const imgFile = ref(null)

// Select options
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

const promoTypes = [
  { label: "สินค้าลดราคา", value: "sale" },
  { label: "สินค้าขายดี", value: "hot" },
  { label: "สินค้าปกติ", value: "normal" }
]

// Handle image selection
const imgPreview = ref(null) // for live preview

function handleFileChange(event) {
  imgFile.value = event.target.files[0]
  if (imgFile.value) {
    imgPreview.value = URL.createObjectURL(imgFile.value) // generate temporary URL
  } else {
    imgPreview.value = null
  }
}

async function uploadProductImage() {
  if (!imgFile.value) {
    // No file uploaded: use default image
    const defaultImgUrl = 'https://cdjpebstofhdsmmqpzlw.supabase.co/storage/v1/object/public/product/no-image.jpg'; // replace with your actual public URL
    return defaultImgUrl;
  }

  try {
    const fileName = `product_${Date.now()}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("product")
      .upload(fileName, imgFile.value);

    if (storageError) throw storageError;

    const { data: urlData } = supabase.storage
      .from("product")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (err) {
    console.error("Upload image error:", err);
    // fallback to default image if upload fails
    return 'https://cdjpebstofhdsmmqpzlw.supabase.co/storage/v1/object/public/product/no-image.jpg';
  }
}

// Submit form to insert product
async function submitProduct() {
  if (!nameproduct.value || !baseprice.value || !stock.value || !categorytype.value || !promotype.value) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }

  // Upload image or use default
  const imgUrl = await uploadProductImage();

  // Warn user if default image is used
  if (!imgFile.value) {
    alert('คุณไม่ได้อัปโหลดรูปสินค้า ระบบจะใช้รูปภาพเริ่มต้นแทน');
  }

  const finalSalePrice = (promotype.value === 'sale')
  ? saleprice.value
  : baseprice.value;

  // ✅ Validation
  if (promotype.value === 'sale') {
    if (saleprice.value == null || isNaN(saleprice.value)) {
      alert("กรุณากรอกราคาลดที่ถูกต้อง");
      return;
    }
    if (saleprice.value >= baseprice.value || saleprice.value < 0) {
      alert("ราคาลดต้องน้อยกว่าราคาปกติ และมากกว่าหรือเท่ากับ 0");
      return;
    }
  }


  const { data, error } = await supabase
    .from('product')
    .insert([{
      ownerid: 1,
      nameproduct: nameproduct.value,
      baseprice: baseprice.value,
      saleprice: finalSalePrice,
      stock: stock.value,
      categorytype: categorytype.value,
      promotype: promotype.value,
      is_featured: is_featured.value,
      imgurl: imgUrl
    }]);

  if (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า: " + error.message);
  } else {
    alert("เพิ่มสินค้าสำเร็จ!");
    // Reset form
    nameproduct.value = '';
    baseprice.value = null;
    saleprice.value = null;
    stock.value = null;
    categorytype.value = '';
    promotype.value = '';
    is_featured.value = false;
    imgFile.value = null;
    imgPreview.value = null;
  }
}

</script>

<template>
  <div class="dashboard-container">
    <adminaside />
    <div class="main-content">
      <notification/>

      <div class="page-header">
        <h2>เพิ่มสินค้า</h2>
        <div class="actions">
          <button class="btn cancel" @click="$router.back()">ยกเลิก</button>
          <button class="btn confirm" @click="submitProduct">ยืนยัน</button>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-section">
          <h3>รายละเอียด</h3>
          <label>ชื่อสินค้า</label>
          <input v-model="nameproduct" type="text" />
          <label>จำนวน</label>
          <input v-model.number="stock" type="number" min="0"/>
        </div>

        <div class="form-section">
          <h3>ประเภท</h3>
          <label>หมวดหมู่สินค้า</label>
          <select v-model="categorytype" class="form-field">
            <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>

          <label>ประเภทการขาย</label>
          <select v-model="promotype" class="form-field">
            <option v-for="p in promoTypes" :key="p.value" :value="p.value">{{ p.label }}</option>
          </select>

          <label style="display: flex; align-items: center;">
            แสดงในหน้าหลัก
            <input type="checkbox" v-model="is_featured" style="margin-left: 5px; width:10%" />
          </label>
        </div>

        <div class="form-section">
          <h3>ราคา</h3>
          <label>ราคา</label>
          <input v-model.number="baseprice" type="number" min="0"/>
          <label>ราคาหลังลด</label>
          <input v-model.number="saleprice" type="number" :disabled="promotype !== 'sale'" min="0"/>
        </div>

        <div class="form-section full-width">
          <h3>ใส่รูปสินค้า</h3>
          <div class="upload-box">
            <input type="file" accept="image/*" @change="handleFileChange" />
            
            <!-- Preview -->
            <div v-if="imgPreview" class="preview">
              <img :src="imgPreview" alt="Preview Image" />
            </div>
            
            <!-- Placeholder icon & text -->
            <div v-else class="upload-placeholder">
              <Icon name="mdi:upload" style="font-size: 32px;" />
              <p>ใส่รูปภาพ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
body {
  font-family: 'Prompt', sans-serif;
}

.dashboard-container {
  display: flex;
  height: 100vh;
}

/* Sidebar นำเข้าแล้วจาก <adminaside /> */

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  background-color: #f9f9f3;
}

/* Topbar */
.topbar {
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 0 20px;
  box-sizing: border-box;
}

.notification {
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
  z-index: 1000;
}

.notification-header {
  font-weight: bold;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.red-dot {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  margin-top: 5px;
  margin-right: 10px;
}

.notification-title {
  font-weight: bold;
  font-size: 14px;
}

.notification-desc {
  font-size: 13px;
  color: #555;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 0.5em 6em;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-family: Prompt, sans-serif;
}

.cancel {
  background-color: #f44336;
  color: white;
}

.confirm {
  background-color: #4caf50;
  color: white;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.form-section {
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.form-section h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.form-section label {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
}

.form-section input[type="text"],
.form-section input[type="number"] {
  padding: 8px;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* Full width row for image upload */
.full-width {
  grid-column: span 3;
}

.upload-box {
  position: relative;
  border: 2px dashed #ccc;
  padding: 1em;
  text-align: center;
  cursor: pointer;
}

.upload-box input[type="file"] {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
