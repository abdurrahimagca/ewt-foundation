<script setup lang="ts">
import { useSw } from "@/modules/shared/composables/useSw";
const { createSwEntity } = useSw();
const props = defineProps<{
  id: string;
}>();
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { notification } from "@shopware-ag/meteor-admin-sdk";
import ProductOptionsMap from "./ProductOptionsMap.vue";
const store = useTravelProductConfig();
const swData = computed(() => {
  return storeToRefs(store).dataToEdit.value?.hotelBundle?.roomOptions?.get(
    props.id,
  )?.roomSaleRule?.supplementRule;
});
const handleCreateSupplementProductsResource = async () => {
  try {
    if (!swData.value) throw new Error("Could not create new resource");
    const newSupplementProducts = await createSwEntity(
      "ce_product_options_map",
    );
    if (!newSupplementProducts) {
      throw new Error("Failed to create new supplement products");
    }
    swData.value.supplementProducts = newSupplementProducts;
  } catch (e) {
    console.error("Error creating supplement products resource:", e);
    notification.dispatch({
      title: "Error",
      message: "Could not create resoruce",
    });
  }
};
</script>

<template>
  <div v-if="swData" class="ewt-card">
    <h4 class="ewt-form-title">Supplement Configuration</h4>

    <div class="ewt-grid ewt-grid--2">
      <div class="ewt-form-group">
        <label class="ewt-form-label">Apply if Adult Count</label>
        <input
          v-model="swData.applyIfAdults"
          type="number"
          class="ewt-input"
          placeholder="Apply if adults"
        />
      </div>

      <div class="ewt-form-group">
        <label class="ewt-form-label">Apply if Children Count</label>
        <input
          v-model="swData.applyIfChildren"
          type="number"
          class="ewt-input"
          placeholder="Apply if children"
        />
      </div>
    </div>

    <div v-if="swData.supplementProducts" class="ewt-form-group">
      <label class="ewt-form-label">Supplement Products</label>
      <p class="ewt-txt ewt-mb-3">These products will be added to cart</p>
      <ProductOptionsMap
        :sw-data="swData.supplementProducts"
        :max-limit="Infinity"
        :min-limit="1"
        label="Supplement Products"
      />
      <div v-if="!swData.supplementProducts.productOptions">
        <p class="ewt-txt ewt-mb-3">No product selected yet. Please add one.</p>
        <button
          @click="handleCreateSupplementProductsResource"
          class="ewt-button ewt-button--primary"
        >
          <i class="fa-solid fa-plus"></i> Initialize Supplement Products
        </button>
      </div>
    </div>
  </div>
</template>
