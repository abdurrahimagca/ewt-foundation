<script lang="ts" setup>
import { defineProps } from "vue";
import { CeTravelOrderInfo } from "../../../internal/types/ce_travel_order_info";

const props = defineProps<{
  rooms: EntitySchema.Entities["ce_travel_order_bundle_info_room_selection"][];
}>();
</script>

<template>
  <div class="rooms-section">
    <div v-for="(room, index) in rooms" :key="index" class="room-card">
      <p><strong>Adults:</strong> {{ room.numberOfAdults }}</p>
      <p><strong>Children:</strong> {{ room.numberOfChildren }}</p>
      <p><strong>Quantity:</strong> {{ room.roomQuantity }}</p>
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
