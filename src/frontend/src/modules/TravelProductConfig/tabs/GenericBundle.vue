<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { data } from "@shopware-ag/meteor-admin-sdk";
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
const addGenericBundle = async () => {
  const newGenericBundle = await data.repository("ce_generic_bundle").create();
  if (!newGenericBundle) {
    console.error("Failed to create new generic bundle");
    return;
  }
  newGenericBundle.availableOnMinTravellers = 1;
  swDatas?.add(newGenericBundle);
  await store.upsertResource();
};
const store = useTravelProductConfig();
const swDatas = storeToRefs(store).dataToEdit.value?.genericBundles;
</script>
<template>
  <div class="ewt-card ewt-flex ewt-flex--between" style="margin-bottom: 2rem">
    <h3 class="ewt-title" style="margin: 0">Generic Bundles</h3>
    <button @click="addGenericBundle" class="ewt-btn ewt-btn--secondary">
      Add Generic Bundle Resource
    </button>
  </div>

  <div
    v-if="swDatas"
    v-for="swData in swDatas"
    :key="swData.id"
    class="generic-bundle-container"
  >
    <div class="generic-bundle-header ewt-flex ewt-flex--between">
      <h4 class="ewt-title" style="margin: 0; font-size: 1.5rem">
        Bundle Configuration
      </h4>
      <button @click="swDatas.remove(swData.id)" class="ewt-btn ewt-btn--danger">
        Remove Bundle
      </button>
    </div>
    <div class="generic-bundle-content">
      <div class="ewt-card" style="margin-bottom: 1rem">
        <div v-if="swData.parentProductOptions">
          <ProductOptionsMap
            :label="'Parent Product Options'"
            :max-limit="20"
            :min-limit="1"
            :sw-data="swData.parentProductOptions"
          />
        </div>
      </div>

      <div class="ewt-card" style="margin-bottom: 1rem">
        <div v-if="swData.genericProductOptions">
          <ProductOptionsMap
            :label="'Generic Product Options'"
            :max-limit="20"
            :min-limit="1"
            :sw-data="swData.genericProductOptions"
          />
        </div>
      </div>

      <div class="ewt-form-group">
        <input
          type="text"
          v-model="swData.propagandaText"
          placeholder="Propaganda Text"
          class="ewt-input"
        />
      </div>

      <div class="ewt-grid ewt-grid--2">
        <div class="ewt-form-group">
          <label class="ewt-form-label">Available On Min Parent Quantity</label>
          <input
            v-model="swData.availableOnMinParentQuantity"
            type="number"
            class="ewt-input"
          />
        </div>

        <div class="ewt-form-group">
          <label class="ewt-form-label">Available On Max Parent Quantity</label>
          <input
            v-model="swData.availableOnMaxParentQuantity"
            type="number"
            class="ewt-input"
          />
        </div>

        <div class="ewt-form-group">
          <label class="ewt-form-label">Available On Min Travellers</label>
          <input
            v-model="swData.availableOnMinTravellers"
            type="number"
            class="ewt-input"
          />
        </div>

        <div class="ewt-form-group">
          <label class="ewt-form-label">Available On Max Travellers</label>
          <input
            v-model="swData.availableOnMaxTravellers"
            type="number"
            class="ewt-input"
          />
        </div>
      </div>

      <div class="ewt-grid ewt-grid--2">
        <div class="ewt-form-group">
          <div class="ewt-checkbox-group">
            <input
              v-model="swData.matchParentQuantity"
              type="checkbox"
              class="ewt-checkbox"
            />
            <label class="ewt-checkbox-label">Match Parent Quantity</label>
          </div>
        </div>

        <div class="ewt-form-group">
          <div class="ewt-checkbox-group">
            <input
              v-model="swData.matchTravellers"
              type="checkbox"
              class="ewt-checkbox"
            />
            <label class="ewt-checkbox-label">Match Travellers</label>
          </div>
        </div>

        <div class="ewt-form-group">
          <div class="ewt-checkbox-group">
            <input
              v-model="swData.isRequired"
              type="checkbox"
              class="ewt-checkbox"
            />
            <label class="ewt-checkbox-label">Is Required</label>
          </div>
        </div>

        <div class="ewt-form-group">
          <div class="ewt-checkbox-group">
            <input
              v-model="swData.allowMultipleSelection"
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
