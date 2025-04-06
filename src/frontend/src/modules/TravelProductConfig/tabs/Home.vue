<script setup lang="ts">
/* interface ce_travel_product_config {
    id: string;
    productId: string | null;
    product: Entity<"product"> | null;
    hotelBundleId: string | null;
    hotelBundle: Entity<"ce_hotel_bundle"> | null;
    childDiscountId: string | null;
    childDiscount: Entity<"ce_custom_child_discount"> | null;
    genericBundles: EntityCollection<"ce_generic_bundle"> | null; 
    dateConfiguratorId: string | null;
    dateConfigurator: Entity<"ce_date_configurator"> | null;
  }*/

import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
const store = useTravelProductConfig();
const swData = storeToRefs(store).dataToEdit;
</script>

<template>
  <div v-if="swData">
    <h2 class="ewt-form-title">{{ swData.configurationIdentifier }}</h2>
    <label class="ewt-form-label">Assocatied Product</label>
    <p>
      This is the product that will be associated with the travel product
      configuration.
    </p>
    <ProductSelector
      :swData="swData?.productsToApply"
      :label="'Select Product'"
      :maxLimit="20"
      :minLimit="1"
    />

    <div class="ewt-form-group">
      <label class="ewt-form-label">Variant Aware</label>
      <div class="ewt-checkbox-group">
        <input
          v-model="swData.variantAware"
          type="checkbox"
          class="ewt-checkbox"
        />
        <span class="ewt-checkbox-label">Yes</span>
      </div>
    </div>
    <div class="ewt-form-group">
      <label class="ewt-form-label">Is Date Configurable</label>
      <div class="ewt-checkbox-group">
        <input
          v-model="swData.isDateConfigurable"
          type="checkbox"
          class="ewt-checkbox"
        />
        <span class="ewt-checkbox-label">Yes</span>
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
