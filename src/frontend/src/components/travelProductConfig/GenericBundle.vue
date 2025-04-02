<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import BundleProduct from "./BundleProduct.vue";
import ProductSelection from "../common/ProductSelection.vue";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { nextTick } from "vue";
const props = defineProps<{
  inheritedData: Entity<"ce_generic_bundle">;
}>();
const emit = defineEmits<{
  (e: "update:data"): void;
}>();

async function createBundleProduct() {
  try {
    
    const repo = data.repository("ce_generic_bundle_product");

    if (!props.inheritedData) {
      throw new Error("Inherited data is undefined");
    }

    const newEntity = await repo.create();
    if (!newEntity) throw new Error("Could not create bundle product");

    newEntity.matchParentQuantity = true;
    newEntity.allowMultipleSelection = false;
    newEntity.isRequired = false;
    newEntity.matchTravellersCount = false;

    props.inheritedData.bundleProducts.add(newEntity);

    const updated = EntityCollection.fromCollection(
      props.inheritedData.bundleProducts,
    );

    props.inheritedData.bundleProducts = updated;

    await data
      .repository("ce_generic_bundle_product")
      .saveAll(props.inheritedData.bundleProducts);
    await data.repository("ce_generic_bundle").save(props.inheritedData);

    await nextTick();

    emit("update:data");

    notification.dispatch({
      title: "Success",
      message: "New bundle product created.",
      variant: "success",
    });
  } catch (e) {
    console.error("Error on creating bundle product:", e);
    notification.dispatch({
      title: "Error",
      message: "An error occurred while creating the bundle product.",
      variant: "error",
    });
  }
}

async function handleParentProductChange(
  product: EntityCollection<"product"> | Entity<"product">,
) {
  try {
    if (!(product instanceof EntityCollection)) {
      throw new Error("Product must be an EntityCollection");
    }
    if (!props.inheritedData?.parentProducts) {
      throw new Error("Inherited data is undefined");
    }

    const updated = EntityCollection.fromCollection(product);
    updated.forEach((product) => {
      product.ceGenericBundleParentProductsId = props.inheritedData.id;
    });
    props.inheritedData.parentProducts = updated;
    await data.repository("ce_generic_bundle").save(props.inheritedData);
    notification.dispatch({
      title: "Success",
      message: "Parent product updated successfully.",
      variant: "success",
    });
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
  <button class="ewt-button ewt-button--primary" @click="createBundleProduct">
    Add Bundle Product
  </button>
  <p>is inheritedData null {{ inheritedData === null }}</p>
  <div v-if="inheritedData && inheritedData !== null" class="ewt-card-detail">
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
        <div
          v-for="bundleProduct in inheritedData.bundleProducts"
          :key="bundleProduct.id"
        >
          <BundleProduct
            :inheritedData="bundleProduct"
            @update:data="emit('update:data')"
          />
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
