<script lang="ts" setup>
import { defineProps } from "vue";
import GenericInfoDisplay from "../common/GenericInfoDisplay.vue";
defineProps<{
  bundleInfo: EntitySchema.Entities["ce_travel_order_bundle_info"];
}>();
</script>

<template>
  <div class="bundle-info">
    <div v-if="bundleInfo?.rooms" class="rooms-section">
      <h3 class="section-title">Room Information</h3>
      <div class="rooms-grid">
        <div
          v-for="(room, index) in bundleInfo.rooms"
          :key="index"
          class="room-card"
        >
          <div class="input-group">
            <label><strong>Room Name</strong></label>
            <input
              v-model="room.roomName"
              type="text"
              placeholder="Enter room name"
            />
          </div>
          <div class="room-details">
            <div class="input-group">
              <label><strong>Adults</strong></label>
              <input v-model="room.numberOfAdults" type="number" min="0" />
            </div>
            <div class="input-group">
              <label><strong>Children</strong></label>
              <input v-model="room.numberOfChildren" type="number" min="0" />
            </div>
            <div class="input-group">
              <label><strong>Quantity</strong></label>
              <input v-model="room.roomQuantity" type="number" min="1" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="bundleInfo?.additionalProducts" class="products-section">
      <h3 class="section-title">Additional Products</h3>
      <div class="products-grid">
        <div
          v-for="(product, index) in bundleInfo.additionalProducts"
          :key="index"
          class="product-card"
        >
          <div class="product-header">
            <input
              v-model="product.productName"
              class="product-name-input"
              placeholder="Product name"
            />
          </div>
          <div class="product-details">
            <div class="detail-row">
              <span class="detail-label">Price</span>
              <input
                v-model="product.productPrice"
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            <div class="detail-row">
              <span class="detail-label">Quantity</span>
              <input v-model="product.productQuantity" type="number" min="1" />
            </div>
            <div class="detail-row total-row">
              <span class="detail-label">Total</span>
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
</template>

<style scoped>
.bundle-info {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section-title {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
}

.rooms-grid,
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.room-card,
.product-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.room-card:hover,
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.room-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.product-header {
  margin-bottom: 20px;
}

.product-name-input {
  font-size: 1.1rem;
  font-weight: 500;
  padding: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.detail-label {
  color: #666;
  font-size: 0.9rem;
}

.total-row {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e1e1e1;
}

.detail-value {
  font-weight: 600;
  color: #2c3e50;
}

.additional-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e1e1e1;
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
  border-color: #189eff;
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
