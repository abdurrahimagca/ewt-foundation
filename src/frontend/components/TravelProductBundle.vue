<script setup lang="js">
import { ref, onMounted } from "vue";
import { location, data, notification } from "@shopware-ag/meteor-admin-sdk";

// Form state'lerini tanımlayalım
const productId = ref(null);
const formData = ref({
  product: null,
  bundles: [],
  childDiscount: {
    discountPercentage: 0,
    applyOnQuantity: 0,
    applyToQuantity: 0,
  },
});

// Seçili ürün için bundle yapısı
const selectedBundle = ref({
  bundleProduct: null,
  rules: {
    ruleName: "",
    ruleDescription: "",
    minQuantityAgainstParentProductQuantity: 0,
    validFromParentProductQuantity: 0,
    maxQuantityAgainstParentProductQuantity: 0,
  },
  hotelBundle: {
    minRoomSelection: 1,
    maxRoomSelection: 1,
    rooms: [],
  },
});

// Ürün listesi için state
const products = ref([]);

onMounted(async () => {
  location.startAutoResizer();

  // Mevcut ürün bilgisini al
  const productData = await data.get({
    id: "sw-product-detail__product",
    selectors: ["id"],
  });

  if (productData && productData.id) {
    productId.value = productData.id;
    // Burada mevcut config varsa yüklenebilir
    loadExistingConfig();
  }

  // Ürün listesini yükle
  await loadProducts();
});

const loadProducts = async () => {
  // Burada Shopware API'den ürün listesini çekebilirsiniz
  // Örnek implementasyon:
  try {
    const response = await data.get({
      id: "product-list",
      selectors: ["id", "name", "price"],
    });
    products.value = response || [];
  } catch (error) {
    console.error("Ürünler yüklenirken hata oluştu:", error);
  }
};

const loadExistingConfig = async () => {
  // Mevcut konfigürasyonu yükle
  try {
    const config = await data.get({
      id: `ce_travel_product_config-${productId.value}`,
      selectors: ["bundles", "childDiscount"],
    });
    if (config) {
      formData.value = config;
    }
  } catch (error) {
    console.error("Konfigurasyon yüklenirken hata oluştu:", error);
  }
};

const handleSubmit = async () => {
  try {
    await data.update({
      id: `ce_travel_product_config-${productId.value}`,
      data: formData.value,
    });

    // Başarılı mesajı göster
    notification.dispatch({
      title: "Success",
      message: "Travel product bundle configuration saved successfully",
      variant: "success",
    });
  } catch (error) {
    // Hata mesajı göster
    notification.dispatch({
      title: "Error",
      message: "Failed to save travel product bundle configuration",
      variant: "error",
    });
    console.error("Kayıt sırasında hata oluştu:", error);
  }
};
</script>

<template>
  <div class="travel-product-bundle">
    <h1>Travel Product Bundle Configuration</h1>

    <form @submit.prevent="handleSubmit" class="travel-form">
      <!-- Ana Ürün Seçimi -->
      <div class="form-group">
        <label>Bundle Product</label>
        <select v-model="selectedBundle.bundleProduct">
          <option
            v-for="product in products"
            :key="product.id"
            :value="product.id"
          >
            {{ product.name }}
          </option>
        </select>
      </div>

      <!-- Satış Kuralları -->
      <div class="form-group">
        <h3>Sale Rules</h3>
        <div>
          <label>Rule Name</label>
          <input type="text" v-model="selectedBundle.rules.ruleName" />
        </div>
        <div>
          <label>Rule Description</label>
          <textarea v-model="selectedBundle.rules.ruleDescription"></textarea>
        </div>
        <div>
          <label>Min Quantity</label>
          <input
            type="number"
            v-model="
              selectedBundle.rules.minQuantityAgainstParentProductQuantity
            "
          />
        </div>
      </div>

      <!-- Hotel Bundle Konfigürasyonu -->
      <div class="form-group">
        <h3>Hotel Configuration</h3>
        <div>
          <label>Min Room Selection</label>
          <input
            type="number"
            v-model="selectedBundle.hotelBundle.minRoomSelection"
          />
        </div>
        <div>
          <label>Max Room Selection</label>
          <input
            type="number"
            v-model="selectedBundle.hotelBundle.maxRoomSelection"
          />
        </div>
      </div>

      <!-- Child Discount -->
      <div class="form-group">
        <h3>Child Discount</h3>
        <div>
          <label>Discount Percentage</label>
          <input
            type="number"
            v-model="formData.childDiscount.discountPercentage"
            step="0.01"
          />
        </div>
        <div>
          <label>Apply On Quantity</label>
          <input
            type="number"
            v-model="formData.childDiscount.applyOnQuantity"
          />
        </div>
      </div>

      <button type="submit" class="submit-button">Save Configuration</button>
    </form>
  </div>
</template>

<style scoped>
.travel-product-bundle {
  padding: 20px;
}

.travel-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-button {
  background-color: #0071e1;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0058b3;
}
</style>
