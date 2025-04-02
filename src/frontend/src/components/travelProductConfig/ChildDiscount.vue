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
          <label for="childDiscountPercentage" class="ewt-form-label"
            >Child Discount Percentage</label
          >
          <input
            id="childDiscountPercentage"
            v-model="inheritedData.childDiscountPercentage"
            type="number"
            min="0"
            step="0.01"
            class="ewt-input"
          />
        </div>
        <div class="ewt-form-group">
          <label for="infantsDiscountPercentage" class="ewt-form-label"
            >Infants Discount Percentage</label
          >
          <input
            id="infantsDiscountPercentage"
            v-model="inheritedData.infantsDiscountPercentage"
            type="number"
            min="0"
            step="0.01"
            class="ewt-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>
