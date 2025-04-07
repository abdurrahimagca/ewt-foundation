<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import { useSw } from "@/modules/shared/composables/useSw";
import { notification } from "@shopware-ag/meteor-admin-sdk";
import ProductOptionsMap from "../components/ProductOptionsMap.vue";
const { createSwEntity } = useSw();
const store = useTravelProductConfig();
const swData = computed(() => storeToRefs(store).dataToEdit.value);

const handleNewResource = async () => {
  try {
    if (!swData.value) throw new Error("swData is not defined");
    const n = await createSwEntity("ce_product_options_map");
    if (!n) throw new Error("Failed to create new product");
    swData.value.productsToApply = n;
  } catch (e) {
    console.error("Error creating new resource:", e);
    notification.dispatch({
      title: "error",
      message: "Failed to create new resource",
    });
  }
};
</script>

<template>
  <div v-if="swData">
    <h2 class="ewt-form-title">{{ swData.configurationIdentifier }}</h2>
    <label class="ewt-form-label">Associated Product</label>
    <p>
      This is the product that will be associated with the travel product
      configuration.
    </p>
    <div v-if="swData?.productsToApply">
      >
      <ProductOptionsMap
        :swData="swData.productsToApply"
        label="Product Options"
        :maxLimit="1"
        :minLimit="1"
      />
    </div>
    <div v-else>
      <p>No product selected yet</p>
      <button class="ewt-button ewt-button--primary" @click="handleNewResource">
        <i class="fa-solid fa-plus"></i> Add Product
      </button>
    </div>

    <div class="ewt-grid ewt-grid--2">
      <div class="ewt-form-group">
        <div class="ewt-checkbox-group">
          <input
            v-model="swData.variantAware"
            type="checkbox"
            class="ewt-checkbox"
          />
          <label class="ewt-checkbox-label">Variant Aware</label>
        </div>
      </div>

      <div class="ewt-form-group">
        <div class="ewt-checkbox-group">
          <input
            v-model="swData.isDateConfigurable"
            type="checkbox"
            class="ewt-checkbox"
          />
          <label class="ewt-checkbox-label">Is Date Configurable</label>
        </div>
      </div>
    </div>

    <input
      v-model="swData.configurationName"
      type="text"
      placeholder="Configuration Name"
      class="ewt-input"
    />
  </div>
</template>

<style scoped>
/* All styles moved to global CSS */
</style>
