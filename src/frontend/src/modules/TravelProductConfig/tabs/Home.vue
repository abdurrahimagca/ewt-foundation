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
import { useDataStore } from "../store/useDataStore";
import ProductSelector from "../components/ProductSelector.vue";
const store = useDataStore();
const d = storeToRefs(store).travelProductConfigData;
</script>

<template>
  <div v-if="d && d !== null">
    <label class="ewt-form-label">Assocatied Product</label>
    <p>
      This is the product that will be associated with the travel product
      configuration.
    </p>
    <ProductSelector
      :initial-product="d.product ? [d.product] : null"
      :limit="1"
      @handle:commit-changes="
        (p) => {
          if (d && d !== null) {
            d.productId = p[0].id;
            d.product = p[0];
          }
        }
      "
    />
    <label class="ewt-form-label">Meta Information</label>
    <p>
      This just for adminstration purposes. It helps to distinct each Resource
    </p>
    <input
      type="text"
      v-model="d.metaInformation"
      placeholder="Meta Information"
      class="ewt-input"
    />
    <div class="ewt-form-group">
      <label class="ewt-form-label">Variant Aware</label>
      <div class="ewt-checkbox-group">
        <input v-model="d.variantAware" type="checkbox" class="ewt-checkbox" />
        <span class="ewt-checkbox-label">Yes</span>
      </div>
    </div>
    <div class="ewt-form-group">
      <label class="ewt-form-label">Is Date Configurable</label>
      <div class="ewt-checkbox-group">
        <input
          v-model="d.isDateConfigurable"
          type="checkbox"
          class="ewt-checkbox"
        />
        <span class="ewt-checkbox-label">Yes</span>
      </div>
    </div>
  </div>
</template>
