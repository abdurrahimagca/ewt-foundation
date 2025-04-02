<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import BundleProduct from "./BundleProduct.vue";
import ProductSelection from "../common/ProductSelection.vue";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";

const props = defineProps<{
  inheritedData?: Entity<"ce_generic_bundle">;
}>();
const emit = defineEmits<{
  (e: "update:data"): void;
}>();

function handleParentProductChange(
  product:
    | EntitySchema.Entities["product"]
    | EntitySchema.Entities["product"][],
) {
  try {
    if (!Array.isArray(product)) {
      throw new Error("Product must be array");
    }
    if (!props.inheritedData?.parentProducts) {
      throw new Error("Inherited data is undefined");
    }
    props.inheritedData.parentProductId = product.map((p) => p.id);
    props.inheritedData.parentProducts = product as EntityCollection<"product">;
    data
      .repository("ce_generic_bundle")
      .save(props.inheritedData as Entity<"ce_generic_bundle">);
    // emit("update:data");
  } catch (e) {
    console.error("error on handling parent product change", e);
    notification.dispatch({
      title: "Error",
      message: "An error occurred while updating the parent product.",
      variant: "error",
    });
  }
}

</script>

<template>
  <div v-if="inheritedData" class="ewt-card-detail">
    <div class="form-layout">
      <div class="ewt-grid-2">
        <div class="ewt-form-group">
          <label class="ewt-form-label">Parent Product (for bundle)</label>
          <p>
            Each bundle product can have its own parent. This is for the
            top-level product, typically a Tour Product.
          </p>
          <ProductSelection
            :initialProduct="inheritedData.parentProducts"
            @update:initialProduct="handleParentProductChange"
            mode="multiple"
          />
          <label for="maxQuantity" class="ewt-form-label"
            >Available On Max Parent Quantity</label
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
            >Available On Min Parent Quantity</label
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

      <div class="ewt-bundle-products">
        <h4>Bundle Products</h4>
        <BundleProduct
     
        
          @update:data="emit('update:data')"
          :inheritedData="inheritedData.bundleProducts"
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
