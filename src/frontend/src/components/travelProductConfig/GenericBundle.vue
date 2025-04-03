<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { useTravelProductConfigStore } from "../../store/useTravelProductBundleStore";
import ProductSelection from "../common/ProductSelection.vue";

const store = useTravelProductConfigStore();
const { entityData } = storeToRefs(store);

async function saveBundles() {
  try {
    const bundles = entityData.value?.genericBundles;
    if (!bundles || !(bundles instanceof EntityCollection)) {
      throw new Error("No valid genericBundles found");
    }

    await data.repository("ce_generic_bundle").saveAll(bundles);
    notification.dispatch({
      title: "Saved",
      message: "Generic bundles saved successfully",
      variant: "success",
    });
  } catch (e) {
    console.error(e);
    notification.dispatch({
      title: "Error",
      message: "Error saving generic bundles",
      variant: "error",
    });
  }
}

function handleParentProductChange(
  products: EntityCollection<"product">,
  bundle: Entity<"ce_generic_bundle">
) {
  bundle.parentProducts = products;
}

function handleBundleProductChange(
  products: EntityCollection<"product">,
  bundle: Entity<"ce_generic_bundle">
) {
  bundle.productOptions = products;
}
</script>

<template>
  <div v-if="entityData?.genericBundles?.length">
    <button class="ewt-btn ewt-btn--primary" @click="saveBundles">
      Save Bundles
    </button>

    <div
      v-for="bundle in entityData.genericBundles"
      :key="bundle.id"
      class="ewt-card-detail"
    >
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
        <input
          v-model="bundle.propagandaText"
          type="text"
          class="ewt-input"
        />
      </div>
    </div>
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
