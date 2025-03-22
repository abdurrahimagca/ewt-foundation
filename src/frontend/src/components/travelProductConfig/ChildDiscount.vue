<script lang="ts" setup>
import { defineProps } from "vue";
defineProps<{
  inheritedData?: EntitySchema.Entities["ce_custom_child_discount"];
}>();
</script>

<template>
  <div v-if="inheritedData">
    <h3>Custom Child Discount</h3>
    <div class="ewt-card-detail">
      <div class="ewt-grid-2">
        <div class="ewt-form-group">
          <label for="childDiscount" class="ewt-form-label"
            >Appy On Quantity</label
          >
          <input
            id="childDiscount"
            v-model="inheritedData.applyOnQuantity"
            type="number"
            min="0"
            class="ewt-input"
          />
        </div>
        <div class="ewt-form-group">
          <label for="applyToQuantity" class="ewt-form-label"
            >Apply to Quantity</label
          >
          <input
            id="applyToQuantity"
            v-model="inheritedData.applyToQuantity"
            type="number"
            min="0"
            class="ewt-input"
          />
        </div>
        <div class="ewt-form-group">
          <label for="discountPercentage" class="ewt-form-label"
            >Discount Percentage</label
          >
          <input
            id="discountPercentage"
            v-model="inheritedData.discountPercentage"
            type="number"
            min="0"
            class="ewt-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>
