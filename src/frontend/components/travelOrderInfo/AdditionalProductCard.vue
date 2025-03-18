<script lang="ts" setup>
import GenericInfoDisplay from "../common/GenericInfoDisplay.vue";

defineProps<{
  product: EntitySchema.Entities["ce_additional_generic_product_info"];
}>();

</script>

<template>
  <div class="product-card">
    <div class="product-header">
      <h4>{{ product.productName }}</h4>
    </div>
    <div class="product-details">
      <div class="detail-row">
        <span class="detail-label">Price:</span>
        <span class="detail-value">{{ product.productPrice.toFixed(2) }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Quantity:</span>
        <span class="detail-value">{{ product.productQuantity }}</span>
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
        product.additionalInfo && Object.keys(product.additionalInfo).length > 0
      "
      class="additional-info"
    >
      <GenericInfoDisplay
        :data="product.additionalInfo"
        title="Additional Information"
      />
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
}

.product-header {
  margin-bottom: 12px;
}

.product-header h4 {
  margin: 0;
  color: #2c3e50;
}

.product-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  margin-bottom: 8px;
}

.detail-label {
  font-weight: 600;
  width: 100px;
  color: #495057;
}

.detail-value {
  color: #212529;
}

.additional-info {
  margin-top: 16px;
  border-top: 1px solid #e9ecef;
  padding-top: 16px;
}
</style>
