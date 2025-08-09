<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed, ref } from "vue";
import { useSw } from "@/modules/shared/composables/useSw";
import { notification } from "@shopware-ag/meteor-admin-sdk"; // Import data
import ProductStreamSelector from "@/modules/shared/components/ProductStreamSelector.vue";
const { createSwEntity, deleteSwEntity } = useSw();
const store = useTravelProductConfig();
const swDatas = computed(
  () => storeToRefs(store).dataToEdit.value?.genericBundles,
);

const expandedBundles = ref<Set<string>>(new Set());

const toggleExpand = (id: string) => {
  if (expandedBundles.value.has(id)) {
    expandedBundles.value.delete(id);
  } else {
    expandedBundles.value.add(id);
  }
};

const handleNewGenericBundleResource = async () => {
  try {
    if (!swDatas.value || !store?.dataToEdit?.id) {
      throw new Error("swDatas (genericBundles collection) is not defined");
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
      message: e instanceof Error ? e.message : "Failed to create new resource",
    });
  }
};
const handleDeleteResource = async (id: string) => {
  try {
    await deleteSwEntity("ce_generic_bundle", id);
    swDatas.value?.remove(id);
  } catch (e) {
    console.error("Error removing generic bundle:", e);
    notification.dispatch({
      title: "error",
      message: "Failed to remove generic bundle",
    });
  }
};
</script>
<template>
  <div class="ewt-card ewt-flex ewt-flex--between ewt-mb-4">
    <h3 class="ewt-title ewt-mb-0">Generic Bundles</h3>
    <button
      @click="handleNewGenericBundleResource"
      class="ewt-button ewt-button--secondary"
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
    <div
      class="generic-bundle-header ewt-flex ewt-flex--between"
      @click="toggleExpand(swData.id)"
    >
      <div class="ewt-flex ewt-flex--center">
        <i
          :class="[
            'fa-solid',
            expandedBundles.has(swData.id)
              ? 'fa-chevron-down'
              : 'fa-chevron-right',
          ]"
        ></i>
        <h4 class="ewt-card-title">Bundle Configuration #{{ index + 1 }}</h4>
      </div>
      <div class="ewt-flex ewt-flex--center">
        <button
          @click.stop="handleDeleteResource(swData.id)"
          class="ewt-button ewt-button--danger"
        >
          Remove Bundle
        </button>
      </div>
    </div>

    <div v-show="expandedBundles.has(swData.id)" class="generic-bundle-content">
      <div class="ewt-card ewt-mb-3">
        <label class="ewt-form-label">Parent Stream</label>
        <ProductStreamSelector
          @update:model-value="
            (s) => {
              if (s) {
                swData.parentStreamId = s.id;
              }
            }
          "
          v-model="swData.parentStream"
        />
      </div>

      <div class="ewt-card ewt-mb-3">
        <label class="ewt-form-label">Bundle Stream</label>
        <ProductStreamSelector
          @update:model-value="
            (s) => {
              if (s) {
                swData.bundleStreamId = s.id;
              }
            }
          "
          v-model="swData.bundleStream"
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
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: none;
  border-radius: 8px;
}

.generic-bundle-header:hover {
}

.generic-bundle-header i {
  margin-right: 1rem;
  font-size: 1.2rem;
  color: var(--ewt-text-secondary);
  transition: none;
}

.generic-bundle-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  animation: none;
}

/* animations removed by request */

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.ewt-flex--center {
  align-items: center;
}
</style>
