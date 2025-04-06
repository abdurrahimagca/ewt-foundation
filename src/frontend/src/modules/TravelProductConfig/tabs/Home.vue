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
import ProductCollectionSelector from "../../shared/ProductCollectionSelector.vue";

const store = useTravelProductConfig();
const swData = storeToRefs(store).dataToEdit;
</script>

<template>
  <div v-if="swData">
    <h2 class="ewt-form-title">{{ swData.configurationIdentifier }}</h2>
    <label class="ewt-form-label">Associated Product</label>
    <p>
      This is the product that will be associated with the travel product
      configuration.
    </p>
    <div v-if="swData?.productsToApply?.productOptions">
      >
      <ProductCollectionSelector
        :minLimit="1"
        :maxLimit="Infinity"
        :collection="swData.productsToApply.productOptions"
        @addToCollection="
          (product) => {
            if (!swData || !swData.productsToApply?.productOptions) {
              throw new Error('Product collection is not defined');
            }
            swData.productsToApply.productOptions.add(product);
          }
        "
        @removeFromCollection="
          (id) => {
            if (!swData || !swData.productsToApply?.productOptions) {
              throw new Error('Product collection is not defined');
            }
            swData.productsToApply.productOptions.remove(id);
          }
        "
      />
    </div>
    <div v-else>
      <p>No product selected yet</p>
      <button
        class="ewt-button ewt-button--primary"
        @click="
          async () => {
            if (!swData) {
              throw new Error('swData is not defined');
            }
            const n = await store.createFreshEntity('ce_product_options_map');
            if (!n) {
              throw new Error('Failed to create new product');
            }

            swData.productsToApply = n;
          }
        "
      >
        <i class="fas fa-plus"></i> Add Product
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
