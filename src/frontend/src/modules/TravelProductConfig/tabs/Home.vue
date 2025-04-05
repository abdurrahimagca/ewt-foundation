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
    metaInformation: string | null;
    variantAware: boolean | null;
    isDateConfigurable: boolean | null;
    dateConfiguratorId: string | null;
    dateConfigurator: Entity<"ce_date_configurator"> | null;
  }*/

import { storeToRefs } from "pinia";
import { useDataStore } from "../store/useDataStore";
const store = useDataStore();
const d = storeToRefs(store).travelProductConfigData;
</script>

<template>
  <div v-if="d">
    <input
      type="text"
      v-model="d.metaInformation"
      placeholder="Meta Information"
      class="ewt-input"
    />
  </div>
</template>
