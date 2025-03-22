<script lang="ts" setup>
import { defineProps, ref, watch } from "vue";
import ProductSelection from "../common/ProductSelection.vue";
import { data } from "@shopware-ag/meteor-admin-sdk";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";

const props = defineProps<{
  inheritedData?: EntitySchema.Entities["ce_generic_product_bundle"];
}>();

const genericProductBundle = ref<
  EntitySchema.Entities["ce_generic_product_bundle"] | undefined | null
>(undefined);

if (props.inheritedData) {
  genericProductBundle.value = props.inheritedData;
}

(async () => {
  genericProductBundle.value = await data
    .repository("ce_generic_product_bundle")
    .create();
})();
function handleMultipleProductsChange(
  product:
    | EntitySchema.Entities["product"][]
    | EntitySchema.Entities["product"],
) {
  if (!props.inheritedData) {
    throw new Error("props must be valid");
  }
  if (!Array.isArray(product)) {
    throw new Error("Expected multiple products");
  }
  props.inheritedData.productOptionsId = product.map((p) => p.id);
  props.inheritedData.productOptions = product as EntityCollection<"product">;
}

watch(
  genericProductBundle,
  (newValue) => {
    if (newValue && props.inheritedData) {
      Object.assign(props.inheritedData, newValue);
    }
  },
  { deep: true },
);
</script>

<template>
  <div v-if="genericProductBundle" class="ewt-card-detail">
    <div class="ewt-grid-2">
      <div class="ewt-form-group">
        <label for="maxQuantity" class="ewt-form-label">Max Quantity</label>
        <input
          id="maxQuantity"
          v-model="genericProductBundle.maxQuantity"
          type="number"
          min="1"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="minQuantity" class="ewt-form-label">Min Quantity</label>
        <input
          id="minQuantity"
          v-model="genericProductBundle.minQuantity"
          type="number"
          min="1"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="maxQuantityAgainstParent" class="ewt-form-label"
          >Max Quantity Against Parent</label
        >
        <input
          id="maxQuantityAgainstParent"
          v-model="genericProductBundle.maxQuantityAgainstParent"
          type="number"
          min="1"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="minQuantityAgainstParent" class="ewt-form-label"
          >Min Quantity Against Parent</label
        >
        <input
          id="minQuantityAgainstParent"
          v-model="genericProductBundle.minQuantityAgainstParent"
          type="number"
          min="1"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="quantityStep" class="ewt-form-label">Quantity Step</label>
        <input
          id="quantityStep"
          v-model="genericProductBundle.quantityStep"
          type="number"
          min="1"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="sortOrder" class="ewt-form-label">Sort Order</label>
        <input
          id="sortOrder"
          v-model="genericProductBundle.sortOrder"
          type="number"
          class="ewt-input"
        />
      </div>
    </div>
    <div class="ewt-form-group">
      <label for="allowMultipleProducts" class="ewt-form-label"
        >Allow Multiple Products</label
      >
      <input
        id="allowMultipleProducts"
        v-model="genericProductBundle.allowMultipleProducts"
        type="checkbox"
      />
    </div>
    <div v-if="genericProductBundle.productOptions">
      <ProductSelection
        mode="multiple"
        :value="genericProductBundle.productOptions"
        :initialProduct="genericProductBundle.productOptions"
        @update:initialProduct="handleMultipleProductsChange($event)"
      />
    </div>
  </div>
</template>

<style scoped>
.generic-bundle-container {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

input[type="number"],
input[type="checkbox"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

input[type="checkbox"] {
  width: auto;
}
</style>
