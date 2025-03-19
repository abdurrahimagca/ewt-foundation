<script lang="ts" setup>
import { defineProps } from "vue";
import ProductSelection from "../common/ProductSelection.vue";
 defineProps<{
  data: EntitySchema.Entities["ce_travel_product_config_generic_product_bundle"];
}>();
</script>
<template>
  <div>
    <input v-model="data.maxQuantity" />
    <input v-model="data.minQuantity" />
    <input v-model="data.maxQuantityAgainstParent" />
    <input v-model="data.minQuantityAgainstParent" />
    <input v-model="data.quantityStep" />
    <input v-model="data.sortOrder" />
    <input v-model="data.allowMultipleProducts" />
    <ProductSelection :initialProduct="data.productOptions" />
    
  </div>
</template>
