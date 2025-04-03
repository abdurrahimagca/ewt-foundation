<script lang="ts" setup>
import { defineProps } from "vue";
import ProductSelection from "../common/ProductSelection.vue";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
const props = defineProps<{
  inheritedData: Entity<"ce_room_supplement_rule">;
}>();
function updateInitialProduct(product: EntityCollection<"product">) {
  try {
    props.inheritedData.supplementProducts = product;
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div class="ewt-card-detail">
    <div class="ewt-grid-2">
      <div class="ewt-form-group">
        <label for="applyIfAdults" class="ewt-form-label"
          >Apply if Adults</label
        >
        <input
          id="applyIfAdults"
          v-model="inheritedData.applyIfAdults"
          type="number"
          min="0"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="applyIfChildren" class="ewt-form-label"
          >Apply if Children</label
        >
        <input
          id="applyIfChildren"
          v-model="inheritedData.applyIfChildren"
          type="number"
          min="0"
          class="ewt-input"
        />
      </div>
    </div>

    <div class="ewt-form-group">
      <label for="supplementName" class="ewt-form-label">Supplement Name</label>
      <input
        id="supplementName"
        v-model="inheritedData.supplementName"
        type="text"
        class="ewt-input"
      />
    </div>

    <div class="ewt-form-group">
      <label class="ewt-form-label">Supplement Product</label>
      <p class="ewt-help-text">
        This product will be added if these conditions are met on cart of this
        <strong>particular</strong> room product.
      </p>
      <div v-if="inheritedData.supplementProducts">
        <ProductSelection
          :initialProduct="inheritedData.supplementProducts"
          @update:initial-product="updateInitialProduct"
          mode="single"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Remove all styles as they're now in styles.css */
</style>
