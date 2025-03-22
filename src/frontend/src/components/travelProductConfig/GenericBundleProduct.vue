<script lang="ts" setup>
import { defineProps} from "vue";
import ProductSelection from "../common/ProductSelection.vue";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";

const props = defineProps<{
  inheritedData?: EntitySchema.Entities["ce_generic_product_bundle"];
}>();

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
  const ids = product.map((product) => product.id);
  if (!props.inheritedData.productOptionsIds) {
    props.inheritedData.productOptionsIds = [];
  }
  props.inheritedData.productOptionsIds = ids;
  props.inheritedData.productOptions = product as EntityCollection<"product">;
}
</script>

<template>
  <div v-if="inheritedData" class="ewt-card-detail">
    <div class="form-layout">
      <div class="ewt-grid-2">
        <div class="ewt-form-group">
          <label for="maxQuantity" class="ewt-form-label"
            >Avaliable On Max Parent Quantity</label
          >
          <input
            id="maxQuantity"
            v-model="inheritedData.availableOnMaxParentQuantity"
            type="number"
            min="1"
            class="ewt-input"
          />
        </div>
        <div class="ewt-form-group">
          <label for="minQuantity" class="ewt-form-label"
            >Avaliable On Min Parent Quantity</label
          >
          <input
            id="minQuantity"
            v-model="inheritedData.availableOnMinParentQuantity"
            type="number"
            min="1"
            class="ewt-input"
          />
        </div>
      </div>
      <div class="ewt-form-group ewt-checkbox-group">
        <div class="ewt-checkbox-wrapper">
          <input
            id="allowMultipleProducts"
            v-model="inheritedData.allowMultipleProducts"
            type="checkbox"
            class="ewt-checkbox"
          />
          <label for="allowMultipleProducts" class="ewt-checkbox-label">
            Allow Multiple Products
          </label>
        </div>

        <div class="ewt-checkbox-wrapper">
          <input
            id="disableIfChild"
            v-model="inheritedData.disableIfChild"
            type="checkbox"
            class="ewt-checkbox"
          />
          <label for="disableIfChild" class="ewt-checkbox-label">
            Disable If Child
          </label>
        </div>
      </div>
      <div v-if="inheritedData.productOptions">
        <ProductSelection
          mode="multiple"
          :initialProduct="inheritedData.productOptions"
          @update:initialProduct="handleMultipleProductsChange($event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
}

.ewt-grid-2 {
  max-width: 800px;
}
</style>
