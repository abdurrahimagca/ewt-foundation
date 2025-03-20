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
  <div v-if="genericProductBundle" class="generic-bundle-container">
    <div class="form-group">
      <label for="maxQuantity">Max Quantity</label>
      <input
        id="maxQuantity"
        v-model="genericProductBundle.maxQuantity"
        type="number"
      />
    </div>
    <div class="form-group">
      <label for="minQuantity">Min Quantity</label>
      <input
        id="minQuantity"
        v-model="genericProductBundle.minQuantity"
        type="number"
      />
    </div>
    <div class="form-group">
      <label for="maxQuantityAgainstParent">Max Quantity Against Parent</label>
      <input
        id="maxQuantityAgainstParent"
        v-model="genericProductBundle.maxQuantityAgainstParent"
        type="number"
      />
    </div>
    <div class="form-group">
      <label for="minQuantityAgainstParent">Min Quantity Against Parent</label>
      <input
        id="minQuantityAgainstParent"
        v-model="genericProductBundle.minQuantityAgainstParent"
        type="number"
      />
    </div>
    <div class="form-group">
      <label for="quantityStep">Quantity Step</label>
      <input
        id="quantityStep"
        v-model="genericProductBundle.quantityStep"
        type="number"
      />
    </div>
    <div class="form-group">
      <label for="sortOrder">Sort Order</label>
      <input
        id="sortOrder"
        v-model="genericProductBundle.sortOrder"
        type="number"
      />
    </div>
    <div class="form-group">
      <label for="allowMultipleProducts">Allow Multiple Products</label>
      <input
        id="allowMultipleProducts"
        v-model="genericProductBundle.allowMultipleProducts"
        type="checkbox"
      />
    </div>
    <ProductSelection
      mode="multiple"
      :value="genericProductBundle.productOptions"
      :initialProduct="genericProductBundle.productOptions"
      @update:initialProduct="handleMultipleProductsChange($event)"
    />
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
