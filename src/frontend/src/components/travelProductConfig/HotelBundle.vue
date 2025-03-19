<script lang="ts" setup>
import { defineProps } from "vue";
import GenericBundleProduct from "./GenericBundleProduct.vue";
defineProps<{
  data: EntitySchema.Entities["ce_travel_product_config_hotel_bundle"];
}>();
</script>
<template>
  <div>
    <input v-model="data.maxRoomSelection" />
    <input v-model="data.minRoomSelection" />
    <div v-if="data.genericProductBundle">
      <GenericBundleProduct :data="data.genericProductBundle" />
    </div>
  </div>
</template>
