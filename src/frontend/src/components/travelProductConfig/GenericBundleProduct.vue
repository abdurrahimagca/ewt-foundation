<script lang="ts" setup>
import { defineProps } from "vue";
import BundleProduct from "./BundleProduct.vue";
import { data } from "@shopware-ag/meteor-admin-sdk";

const props = defineProps<{
  inheritedData?: EntitySchema.Entities["ce_generic_product_bundle"];
}>();

async function addBundleProduct() {
  try {
    const repo = data.repository("ce_generic_bundle_product");
    
    const newBundleProduct = await repo.create();
    if (newBundleProduct === null) {
      throw new Error("Could not create new bundle product");
    }
    if (props.inheritedData) {
      const repo = data.repository("ce_generic_bundle_product");
    
      const newBundleProduct = await repo.create();
      const parentProduct = await data.repository("product").create();
      if (parentProduct === null) {
        throw new Error("Could not create new parent product");
      }
      if (newBundleProduct === null) {
        throw new Error("Could not create new bundle product");
      }
      newBundleProduct.parentProduct = parentProduct;
      props.inheritedData.bundleProducts.push(newBundleProduct);

    }
  } catch (e) {
    console.error(e);
  }
}

function removeBundleProduct(id: string) {
  if (props.inheritedData?.bundleProducts) {
    props.inheritedData.bundleProducts.remove(id);
  }
}
</script>

<template>
  <div v-if="inheritedData" class="ewt-card-detail">
    <div class="form-layout">
      <div class="ewt-grid-2">
        <div class="ewt-form-group">
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
        <button @click="addBundleProduct" class="ewt-btn ewt-btn--secondary">
          Add Bundle Product
        </button>

        <div v-if="inheritedData.bundleProducts" class="bundle-products-list">
          <div
            v-for="bundleProduct in inheritedData.bundleProducts"
            :key="bundleProduct.id"
            class="bundle-product-item"
          >
            <BundleProduct :inheritedData="bundleProduct" />
            <button
              @click="() => removeBundleProduct(bundleProduct.id)"
              class="ewt-btn ewt-btn--danger"
            >
              Remove
            </button>
          </div>
        </div>
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
