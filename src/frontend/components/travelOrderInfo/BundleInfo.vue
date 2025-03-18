<script lang="ts" setup>
import { defineProps } from "vue";
import GenericInfoDisplay from "../common/GenericInfoDisplay.vue";
const props = defineProps<{
  bundleInfo: EntitySchema.Entities["ce_travel_order_bundle_info"];
}>();
</script>

<template>
  <div class="rooms-section">
    <div v-if="bundleInfo?.rooms">
      <div v-for="(room, index) in bundleInfo.rooms" :key="index" class="room-card">
        <div class="input-group">
          <label><strong>Room Name</strong></label>
          <input v-model="room.roomName" type="text" />
        </div>
        <div class="input-group">
          <label><strong>Adults:</strong></label>
          <input v-model="room.numberOfAdults" type="number" />
        </div>
        <div class="input-group">
          <label><strong>Children:</strong></label>
          <input v-model="room.numberOfChildren" type="number" />
        </div>
        <div class="input-group">
          <label><strong>Quantity:</strong></label>
          <input v-model="room.roomQuantity" type="number" />
        </div>
      </div>
    </div>
    <div v-if="bundleInfo?.additionalProducts">
      <div v-for="(product, index) in bundleInfo.additionalProducts" :key="index">
        <div class="products-container">
          <div class="product-card">
            <div class="product-header">
              <input v-model="product.productName" class="product-name-input" />
            </div>
            <div class="product-details">
              <div class="detail-row">
                <span class="detail-label">Price:</span>
                <input v-model="product.productPrice" type="number" step="0.01" />
              </div>
              <div class="detail-row">
                <span class="detail-label">Quantity:</span>
                <input v-model="product.productQuantity" type="number" />
              </div>
              <div class="detail-row">
                <span class="detail-label">Total:</span>
                <span class="detail-value">{{
                  (product.productPrice * product.productQuantity).toFixed(2)
                }}</span>
              </div>
            </div>
            <div
              v-if="
                product.additionalInfo &&
                Object.keys(product.additionalInfo).length > 0
              "
              class="additional-info"
            >
          
              <GenericInfoDisplay
                :data="product.additionalInfo"
                title="Additional Information"
              />
            </div>
          </div>
        </div>
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

.input-group {
  margin-bottom: 12px;
}

.input-group label {
  display: block;
  margin-bottom: 4px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #189EFF;
}

.product-name-input {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.detail-row input {
  width: 120px;
  text-align: right;
}
</style>
