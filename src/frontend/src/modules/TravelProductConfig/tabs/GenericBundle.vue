<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import ProductOptionsMap from "../components/ProductOptionsMap.vue";
import ParentOperator from "../../shared/components/ParentOperator.vue";
import { computed } from "vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { useSw } from "@/modules/shared/composables/useSw";
import { notification } from "@shopware-ag/meteor-admin-sdk";
const { createSwEntity } = useSw();

const handleNewGenericBundleResource = async () => {
  try {
    if (!swDatas.value) {
      throw new Error("swDatas is not defined");
    }
    const newGenericBundle = await createSwEntity("ce_generic_bundle");
    if (!newGenericBundle) {
      throw new Error("Failed to create new generic bundle");
    }
    newGenericBundle.availableOnMinTravellers = 1;
    swDatas.value.add(newGenericBundle);
  } catch (e) {
    console.error("Error creating new resource:", e);
    notification.dispatch({
      title: "error",
      message: "Failed to create new resource",
    });
  }
};
const handleDeleteResource = async (id: string) => {
  try {
    if (!swDatas.value?.remove(id)) {
      throw new Error("Failed to remove generic bundle");
    }
  } catch (e) {
    console.error("Error removing generic bundle:", e);
    notification.dispatch({
      title: "error",
      message: "Failed to remove generic bundle",
    });
  }
};
const store = useTravelProductConfig();
const swDatas = computed(
  () => storeToRefs(store).dataToEdit.value?.genericBundles,
);

const transformProductForLogicStatement = (
  p: EntityCollection<"product"> | undefined | null,
) => {
  if (!p) {
    return [];
  }
  return Object.values(p)
    .filter(
      (product): product is Entity<"product"> =>
        product !== null &&
        typeof product === "object" &&
        "id" in product &&
        "productNumber" in product &&
        "name" in product,
    )
    .map((product) => ({
      id: product.id || "",
      productNumber: product.productNumber || "",
      name: product.name || "",
    }));
};
</script>
<template>
  <div class="ewt-card ewt-flex ewt-flex--between" style="margin-bottom: 2rem">
    <h3 class="ewt-title" style="margin: 0">Generic Bundles</h3>
    <button
      @click="handleNewGenericBundleResource"
      class="ewt-btn ewt-btn--secondary"
    >
      Add Generic Bundle Resource
    </button>
  </div>

  <div
    v-if="swDatas"
    v-for="(swData, index) in swDatas"
    :key="swData.id"
    class="generic-bundle-container"
  >
    <div class="generic-bundle-header ewt-flex ewt-flex--between">
      <h4 class="ewt-title" style="margin: 0; font-size: 1.5rem">
        Bundle Configuration #{{ index + 1 }}
      </h4>
      <button
        @click="handleDeleteResource(swData.id)"
        class="ewt-btn ewt-btn--danger"
      >
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
        <button
          @click="
            async () => {
              try {
                const newProductOption = await createSwEntity(
                  'ce_product_options_map',
                );
                if (!newProductOption) {
                  throw new Error('Failed to create new product option');
                }
                swData.parentProductOptions = newProductOption;
              } catch (e) {
                console.error('Error creating new product option:', e);
                notification.dispatch({
                  title: 'error',
                  message: 'Failed to create new product option',
                });
              }
            }
          "
          class="ewt-btn ewt-btn--secondary"
          style="margin-top: 1rem"
        >
          Add Parent Product Option
        </button>
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
        <button
          @click="
            async () => {
              try {
                const newProductOption = await createSwEntity(
                  'ce_product_options_map',
                );
                if (!newProductOption) {
                  throw new Error('Failed to create new product option');
                }
                swData.genericProductOptions = newProductOption;
              } catch (e) {
                console.error('Error creating new product option:', e);
                notification.dispatch({
                  title: 'error',
                  message: 'Failed to create new product option',
                });
              }
            }
          "
          class="ewt-btn ewt-btn--secondary"
          style="margin-top: 1rem"
        >
          Add Generic Product Option
        </button>
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

      <label class="ewt-form-label">Availability Operator</label>
      <h2 style="color: red">EXPREMENTIAL DO NOT USE NOW</h2>
      <div class="ewt-checkbox-group">
        <ParentOperator
          :products="
            transformProductForLogicStatement(
              swData?.parentProductOptions?.productOptions || null,
            )
          "
        />
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
