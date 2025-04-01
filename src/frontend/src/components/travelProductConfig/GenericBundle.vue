<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import BundleProduct from "./BundleProduct.vue";
import ProductSelection from "../common/ProductSelection.vue";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";

const props = defineProps<{
  inheritedData?: EntitySchema.Entities["ce_generic_bundle"];
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
     if (product.some((p) => !p || !p.id)) {
      throw new Error("One of the products is invalid");
    }
    const entities = product.map((item) => {
      return new data.Classes.Entity(item.id, "product", item);
    });
    entities.forEach((item) => {
      props.inheritedData?.parentProducts?.add(item);
    });
    props.inheritedData?.parentProducts?.getIds().forEach((item) => {
      if (!entities.find((entity) => entity.id === item)) {
        props.inheritedData?.parentProducts?.remove(item);
      }
    });
    data
      .repository("ce_generic_bundle")
      .save(props.inheritedData as Entity<"ce_generic_bundle">);
    emit("update:data");
  } catch (e) {
    console.error("error on handling parent product change", e);
    notification.dispatch({
      title: "Error",
      message: "An error occurred while updating the parent product.",
      variant: "error",
    });
  }
}

async function handleGenericBundleChange() {
  try {
    await data
      .repository("ce_generic_bundle")
      .save(props.inheritedData as Entity<"ce_generic_bundle">);

    notification.dispatch({
      title: "Bundle Product Updated",
      message: "Bundle product updated successfully.",
      variant: "success",
    });
    emit("update:data");
  } catch (e) {
    console.error("error on handling generic bundle change", e);
    console.log("data is: ", JSON.stringify(props.inheritedData, null, 2));
    notification.dispatch({
      title: "Error",
      message: "An error occurred while updating the bundle product.",
      variant: "error",
    });
  }
}

async function addBundleProduct() {
  try {
    const repo = data.repository("ce_generic_bundle_product");
    const newData = await repo.create();
    if (newData === null) {
      throw new Error("Could not create new bundle product");
    }
    newData.matchParentQuantity = true;
    await repo.save(newData);
    if (!props.inheritedData?.bundleProducts) {
      throw new Error("Inherited data is undefined");
    }
    const result = await repo.get(newData.id);
    if (result === null) {
      throw new Error("Could not get new bundle product");
    }
    props.inheritedData?.bundleProducts?.add(result);

    handleGenericBundleChange();
  } catch (e) {
    console.error(e);
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
      <button class="ewt-button ewt-button-primary" @click="addBundleProduct">
        Add Bundle Product
      </button>

      <div class="ewt-bundle-products">
        <h4>Bundle Products</h4>
        <BundleProduct
          @update:data="handleGenericBundleChange"
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
