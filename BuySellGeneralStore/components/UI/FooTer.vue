<script setup>
import { ref, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey);

const owner = ref(null);

async function fetchOwner() {
  const { data, error } = await supabase
    .from("owner")
    .select("name, phone, address")
    .eq("ownerid", 1)
    .single();

  if (!error) {
    const ownerData = {
      oname: data.name,
      ophone: data.phone,
      oaddress: data.address
    }

    owner.value = ownerData;
  } else {
    console.error("Error loading owner:", error);
  }
}

onMounted(() => {
  fetchOwner();
});
</script>

<template>
  <footer>
    <div v-if="owner">
      <div style="margin-left: 5em; color: #FAFAF5;">
        <div><h1>ร้าน {{ owner.oname }}</h1></div>
        <div style="font-weight: 500;">เบอร์โทร : {{ owner.ophone }}</div>
        <div style="font-weight: 500;">ที่อยู่ : {{ owner.oaddress }}</div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: #6acc91;
  width: 100%;
  min-height: 200px;
  margin-top: 12em;
  padding: 1.5em;
}
</style>