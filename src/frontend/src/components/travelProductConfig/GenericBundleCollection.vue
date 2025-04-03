<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { useTravelProductConfigStore } from "../../store/useTravelProductBundleStore";
import ProductSelection from "../common/ProductSelection.vue";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { computed } from "vue";

const store = useTravelProductConfigStore();
const { entityData } = storeToRefs(store);
const bundles = computed(() => entityData.value?.genericBundles ?? undefined);

async function save() {
  try {
    const repo = data.repository("ce_generic_bundle");
    if (!bundles.value) {
      throw new Error("Bundles are undefined");
    }
    await repo.saveAll(bundles.value);
    notification.dispatch({
      title: "Success",
      message: "Bundle product saved successfully.",
      variant: "success",
    });

    store.refreshState();
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "An error occurred while saving the bundle product.",
      variant: "error",
    });
    console.error("Error on saving bundle product", e);
  }
}

async function handleParentProductChange(
  products: Entity<"product">[],
  bundle: Entity<"ce_generic_bundle">,
) {
  try {
    const safeProducts = products.filter((p) => p && p.id);

    bundle.parentProducts = data.Classes.EntityCollection.fromCollection(
      bundle.parentProducts,
    );

    const currentIds = bundle.parentProducts.getIds();

    // Remove old
    currentIds.forEach((id) => {
      if (!safeProducts.some((p) => p.id === id)) {
        bundle.parentProducts.remove(id);
      }
    });

    // Add new
    safeProducts.forEach((product) => {
      if (!bundle.parentProducts.has(product.id)) {
        bundle.parentProducts.add(product);
      }
    });


    await data.repository("ce_generic_bundle").save(bundle);
    await store.refreshState();
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "An error occurred while updating the bundle product.",
      variant: "error",
    });
    console.error(`Error on saving bundle product: with ${bundle.id}`, e);
    console.error(`Error data: with ${JSON.stringify(bundle)}`, e);
  }
}

async function handleBundleProductChange(
  products: Entity<"product">[],
  bundle: Entity<"ce_generic_bundle">,
) {
  try {
    const safeProducts = products.filter((p) => p && p.id);

    bundle.productOptions = data.Classes.EntityCollection.fromCollection(
      bundle.productOptions,
    );

    const currentIds = bundle.productOptions.getIds();

    // Remove old
    currentIds.forEach((id) => {
      if (!safeProducts.some((p) => p.id === id)) {
        bundle.productOptions.remove(id);
      }
    });

    // Add new
    safeProducts.forEach((product) => {
      if (!bundle.productOptions.has(product.id)) {
        bundle.productOptions.add(product);
      }
    });

    await data.repository("ce_generic_bundle").save(bundle);
    await store.refreshState();
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "An error occurred while updating the bundle product.",
      variant: "error",
    });
    console.error(`Error on saving bundle product: with ${bundle.id}`, e);
    console.error(`Error data: with ${JSON.stringify(bundle)}`, e);
  }
}
</script>

<template>
  <div v-if="bundles && bundles.length">
    <div v-for="bundle in bundles" :key="bundle.id" class="ewt-card-detail">
      <div v-if="bundle.isNew()">New Bundle</div>
      <div>ID: {{ bundle.id }}</div>

      <ProductSelection
        mode="multiple"
        :initialProduct="bundle.parentProducts"
        @update:initialProduct="(val) => handleParentProductChange(val, bundle)"
      />
      <ProductSelection
        mode="multiple"
        :initialProduct="bundle.productOptions"
        @update:initialProduct="(val) => handleBundleProductChange(val, bundle)"
      />

      <div class="ewt-form-group">
        <label class="ewt-form-label">Available On Min Parent Quantity</label>
        <input
          v-model="bundle.availableOnMinParentQuantity"
          type="number"
          class="ewt-input"
        />
      </div>

      <div class="ewt-form-group">
        <label class="ewt-form-label">Available On Max Parent Quantity</label>
        <input
          v-model="bundle.availableOnMaxParentQuantity"
          type="number"
          class="ewt-input"
        />
      </div>

      <div class="rm-group">
        <label class="ewt-form-label">Is Parent Operator And?</label>
        <input
          v-model="bundle.isParentOperatorAnd"
          type="checkbox"
          class="ewt-checkbox"
        />
      </div>

      <div class="ewt-form-group">
        <label class="ewt-form-label">Match Parent Quantity</label>
        <input
          v-model="bundle.matchParentQuantity"
          type="checkbox"
          class="ewt-checkbox"
        />
      </div>

      <div class="ewt-form-group">
        <label class="ewt-form-label">Match Travellers</label>
        <input
          v-model="bundle.matchTravellers"
          type="checkbox"
          class="ewt-checkbox"
        />
      </div>

      <div class="ewt-form-group">
        <label class="ewt-form-label">Allow Multiple</label>
        <input
          v-model="bundle.allowMultipleSelection"
          type="checkbox"
          class="ewt-checkbox"
        />
      </div>

      <div class="ewt-form-group">
        <label class="ewt-form-label">Is Required</label>
        <input
          v-model="bundle.isRequired"
          type="checkbox"
          class="ewt-checkbox"
        />
      </div>

      <div class="ewt-form-group">
        <label class="ewt-form-label">Propaganda Text</label>
        <input v-model="bundle.propagandaText" type="text" class="ewt-input" />
      </div>
    </div>
    <button @click="save()" class="ewt-btn ewt-btn--primary">Save All</button>
  </div>
  <div v-else class="ewt-empty-state">No Generic Bundles Found</div>
</template>

<style scoped>
.ewt-card-detail {
  border: 1px solid #e5e7eb;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: white;
}
</style>
