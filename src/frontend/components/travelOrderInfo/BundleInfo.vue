<script lang="ts" setup>
import { defineProps } from "vue";
import { CeTravelOrderInfo } from "../../../internal/types/ce_travel_order_info";
import RoomInfo from "./RoomInfo.vue";
import AdditionalProductCard from "./AdditionalProductCard.vue";

const props = defineProps<{
  bundleInfo: CeTravelOrderInfo["bundleInfo"];
}>();
</script>

<template>
  <div class="rooms-section">
    <div v-if="bundleInfo?.rooms">
      <RoomInfo :rooms="bundleInfo.rooms" />
    </div>
    <div v-if="bundleInfo?.additionalProducts">
      <div class="products-container">
        <AdditionalProductCard 
          v-for="product in bundleInfo.additionalProducts" 
          :key="product.id || product.productName" 
          :product="product" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h4 {
  margin-top: 0;
  color: #2c3e50;
}
</style>
