<script setup lang="ts">
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import ProductSelector from "./ProductSelector.vue";
import ProductCollectionSelector from "../../../modules/shared/ProductCollectionSelector.vue";
defineProps<{
  ds?: Entity<"ce_product_options_map"> | null;
}>();
</script>
<template>
    <p>Product Options Selection</p>
      <ProductCollectionSelector
        :collection="ds?.productOption ? ds.productOption : null"
        @addToCollection="(productOption) => {
            if (ds?.productOption) {
              ds.productOption.add(productOption);
            }
          }"
        "
        @removeFromCollection="
          (id) => {
            if (ds?.productOption) {
              ds.productOption.remove(id);
            }
          }
        "
      />
</template>
