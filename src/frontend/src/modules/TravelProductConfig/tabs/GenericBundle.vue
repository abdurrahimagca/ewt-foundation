<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDataStore } from "../store/useDataStore";
import { data } from "@shopware-ag/meteor-admin-sdk";
import ProductSelector from "../components/ProductSelector.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import ProductOptionsMap from "../components/ProductOptionsMap.vue";
/*interface ce_generic_bundle {
    id: string;
    ceTravelProductConfigGenericBundlesId: string | null;
    availableOnMinParentQuantity: number | null;
    availableOnMaxParentQuantity: number | null;
    availableOnMinTravellers: number | null;
    availableOnMaxTravellers: number | null;
    availabilityOperator: Record<string, unknown> | null;
    matchParentQuantity: boolean | null;
    matchTravellers: boolean | null;
    isRequired: boolean | null;
    allowMultipleSelection: boolean | null;
    propagandaText: string | null;
    parentProductOptions: EntityCollection<"ce_product_options_map">;
    genericProductOptions: EntityCollection<"ce_product_options_map">;
  }
  interface ce_product_options_map {
    id: string;
    productOptionId: string | null;
    equivalentProductId: string | null;
    productOption: Entity<"product"> | null;
    equivalentProduct: Entity<"product"> | null;
    ceGenericBundleParentProductsId: string | null;
    ceGenericBundleProductOptionsId: string | null;
    ceRoomBundleRoomProductsId: string | null;
    ceRoomSupplementRuleSupplementProductsId: string | null;
  }*/
const createNewProductOptions = async (): Promise<
  Entity<"ce_product_options_map">
> => {
  const newProductOptions = await data
    .repository("ce_product_options_map")
    .create();
  if (!newProductOptions) {
    console.error("Failed to create new product options");
    return Promise.reject(new Error("Failed to create new product options"));
  }
  return newProductOptions;
};
const addGenericBundle = async () => {
  const newGenericBundle = await data.repository("ce_generic_bundle").create();
  const productOptions = await createNewProductOptions();
  const parentProductOptions = await createNewProductOptions();
  if (!productOptions || !parentProductOptions) {
    console.error("Failed to create new product options");
    return;
  }
  if (!newGenericBundle) {
    console.error("Failed to create new generic bundle");
    return;
  }
  newGenericBundle.parentProductOptions = parentProductOptions;
  newGenericBundle.genericProductOptions = productOptions;
  if (!newGenericBundle) {
    console.error("Failed to create new generic bundle");
    return;
  }
  newGenericBundle.availableOnMinTravellers = 1;
  ds?.add(newGenericBundle);
  await store.upsertResorce();
};
const store = useDataStore();
const ds = storeToRefs(store).travelProductConfigData.value?.genericBundles;
</script>
<template>
  <div class="ewt-card ewt-flex ewt-flex--between" style="margin-bottom: 2rem">
    <h3 class="ewt-title" style="margin: 0">Generic Bundles</h3>
    <button @click="addGenericBundle" class="ewt-btn ewt-btn--secondary">
      Add Generic Bundle Resource
    </button>
  </div>

  <div
    v-if="ds && ds.length > 0"
    v-for="d in ds"
    :key="d.id"
    class="generic-bundle-container"
  >
    <div class="generic-bundle-header ewt-flex ewt-flex--between">
      <h4 class="ewt-title" style="margin: 0; font-size: 1.5rem">
        Bundle Configuration
      </h4>
      <button @click="ds.remove(d.id)" class="ewt-btn ewt-btn--danger">
        Remove Bundle
      </button>
    </div>
    <div class="generic-bundle-content">
      <div class="ewt-card" style="margin-bottom: 1rem">
        <div>
          <ProductOptionsMap :ds="d.parentProductOptions" />
        </div>
        <div class="button-group">
          <button
            @click="
              async () => {
                const newProductOptions = await createNewProductOptions();
                d.parentProductOptions = newProductOptions;
              }
            "
            class="ewt-btn ewt-btn--secondary"
          >
            Add Parent Product Option
          </button>
        </div>
      </div>

      <div class="ewt-card" style="margin-bottom: 1rem">
        <p>generic product is {{ typeof d.genericProductOptions }}</p>
        <div>
          <ProductOptionsMap :ds="d.genericProductOptions" />
        </div>
        <div class="button-group">
          <button
            @click="
              async () => {
                const newProductOptions = await createNewProductOptions();
                d.genericProductOptions = newProductOptions;
              }
            "
            class="ewt-btn ewt-btn--secondary"
          >
            Add Generic Product Option
          </button>
        </div>
      </div>

      <div class="ewt-form-group">
        <input
          type="text"
          v-model="d.propagandaText"
          placeholder="Propaganda Text"
          class="ewt-input"
        />
      </div>

      <div class="ewt-grid ewt-grid--2">
        <div class="ewt-form-group">
          <label class="ewt-form-label">Available On Min Parent Quantity</label>
          <input
            v-model="d.availableOnMinParentQuantity"
            type="number"
            class="ewt-input"
          />
        </div>

        <div class="ewt-form-group">
          <label class="ewt-form-label">Available On Max Parent Quantity</label>
          <input
            v-model="d.availableOnMaxParentQuantity"
            type="number"
            class="ewt-input"
          />
        </div>

        <div class="ewt-form-group">
          <label class="ewt-form-label">Available On Min Travellers</label>
          <input
            v-model="d.availableOnMinTravellers"
            type="number"
            class="ewt-input"
          />
        </div>

        <div class="ewt-form-group">
          <label class="ewt-form-label">Available On Max Travellers</label>
          <input
            v-model="d.availableOnMaxTravellers"
            type="number"
            class="ewt-input"
          />
        </div>
      </div>

      <div class="ewt-grid ewt-grid--2">
        <div class="ewt-form-group">
          <div class="ewt-checkbox-group">
            <input
              v-model="d.matchParentQuantity"
              type="checkbox"
              class="ewt-checkbox"
            />
            <label class="ewt-checkbox-label">Match Parent Quantity</label>
          </div>
        </div>

        <div class="ewt-form-group">
          <div class="ewt-checkbox-group">
            <input
              v-model="d.matchTravellers"
              type="checkbox"
              class="ewt-checkbox"
            />
            <label class="ewt-checkbox-label">Match Travellers</label>
          </div>
        </div>

        <div class="ewt-form-group">
          <div class="ewt-checkbox-group">
            <input
              v-model="d.isRequired"
              type="checkbox"
              class="ewt-checkbox"
            />
            <label class="ewt-checkbox-label">Is Required</label>
          </div>
        </div>

        <div class="ewt-form-group">
          <div class="ewt-checkbox-group">
            <input
              v-model="d.allowMultipleSelection"
              type="checkbox"
              class="ewt-checkbox"
            />
            <label class="ewt-checkbox-label">Allow Multiple Selection</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.generic-bundle-container {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.generic-bundle-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.generic-bundle-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
