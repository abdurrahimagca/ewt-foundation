<script lang="ts" setup>
import { defineProps } from "vue";
import GenericInfoDisplay from "../common/GenericInfoDisplay.vue";
defineProps<{
  bundleInfo: EntitySchema.Entities["ce_travel_order_bundle_info"];
}>();
</script>

<template>
  <div class="ewt-section-layout">
    <div v-if="bundleInfo?.rooms" class="rooms-section">
      <h3 class="ewt-section-title">Room Information</h3>
      <div class="ewt-grid-rooms">
        <div
          v-for="(room, index) in bundleInfo.rooms"
          :key="index"
          class="ewt-card-detail"
        >
          <div class="ewt-form-group">
            <label class="ewt-form-label"><strong>Room Name</strong></label>
            <input
              v-model="room.roomName"
              type="text"
              class="ewt-input"
              placeholder="Enter room name"
            />
          </div>
          <div class="ewt-room-details">
            <div class="ewt-form-group">
              <label class="ewt-form-label"><strong>Adults</strong></label>
              <input
                v-model="room.numberOfAdults"
                type="number"
                min="0"
                class="ewt-input"
              />
            </div>
            <div class="ewt-form-group">
              <label class="ewt-form-label"><strong>Children</strong></label>
              <input
                v-model="room.numberOfChildren"
                type="number"
                min="0"
                class="ewt-input"
              />
            </div>
            <div class="ewt-form-group">
              <label class="ewt-form-label"><strong>Quantity</strong></label>
              <input
                v-model="room.roomQuantity"
                type="number"
                min="1"
                class="ewt-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="bundleInfo?.additionalProducts" class="products-section">
      <h3 class="ewt-section-title">Additional Products</h3>
      <div class="ewt-grid-rooms">
        <div
          v-for="(product, index) in bundleInfo.additionalProducts"
          :key="index"
          class="ewt-card-detail"
        >
          <div class="ewt-product-header">
            <input
              v-model="product.productName"
              class="ewt-input ewt-input-name"
              placeholder="Product name"
            />
          </div>
          <div class="ewt-product-details">
            <div class="ewt-detail-row">
              <span class="ewt-detail-label">Price</span>
              <input
                v-model="product.productPrice"
                type="number"
                step="0.01"
                min="0"
                class="ewt-input ewt-input-right"
              />
            </div>
            <div class="ewt-detail-row">
              <span class="ewt-detail-label">Quantity</span>
              <input
                v-model="product.productQuantity"
                type="number"
                min="1"
                class="ewt-input ewt-input-right"
              />
            </div>
            <div class="ewt-detail-row ewt-total-row">
              <span class="ewt-detail-label">Total</span>
              <span class="ewt-detail-value">{{
                (product.productPrice * product.productQuantity).toFixed(2)
              }}</span>
            </div>
          </div>

          <div
            v-if="
              product.additionalInfo &&
              Object.keys(product.additionalInfo).length > 0
            "
            class="ewt-additional-info"
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
/* Remove all scoped styles since we're using shared styles.css */
</style>
