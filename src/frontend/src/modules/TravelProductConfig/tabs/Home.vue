<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import ProductStreamSelector from "@/modules/shared/components/ProductStreamSelector.vue";
import TravellerTypeConfig from "../components/TravellerTypeConfig.vue";
import { useSw } from "@/modules/shared/composables/useSw";

const { createSwEntity } = useSw();
const store = useTravelProductConfig();
const swData = computed(() => storeToRefs(store).dataToEdit.value);
const createNewTravellerTypeConfig = async () => {
  const newTravellerTypeConfig = await createSwEntity("ce_traveller_type_config");
  if (newTravellerTypeConfig === null) {
    throw new Error("Could not create new traveller type config");
  }
  if (!swData.value) {
    throw new Error("Data to edit is null");
  }
  swData.value.travellerTypeConfig = newTravellerTypeConfig;
  swData.value.travellerTypeConfigId = newTravellerTypeConfig.id;
  
};
</script>

<template>
  <div v-if="swData" class="ewt-home-container">
    <section class="ewt-section">
      <h2 class="ewt-section-title">Main Configuration</h2>
      <p>Identifier: {{ swData.configurationIdentifier }}</p>
      <div class="ewt-card ewt-mb-4">
        <div class="ewt-form-group">
          <label class="ewt-form-label">Configuration Name</label>
          <input
            v-model="swData.configurationName"
            type="text"
            placeholder="Enter configuration name"
            class="ewt-input"
          />
        </div>

        <div class="ewt-form-group">
          <label class="ewt-form-label">Associated Product</label>
          <ProductStreamSelector
            v-model="swData.applyProductsStream"
            @update:modelValue="
              (s) => {
                if (s && swData) {
                  swData.applyProductsStream = s;
                  swData.applyProductsStreamId = s.id;
                }
              }
            "
          />
        </div>
      </div>
    </section>

    <section class="ewt-section">
      <h2 class="ewt-section-title">Traveller Type Configuration</h2>
      <TravellerTypeConfig />
    </section>
    <section v-if="!swData.travellerTypeConfig" class="ewt-section">
      <button
        class="ewt-button ewt-button--primary"
        @click="createNewTravellerTypeConfig"
      >
        Create Traveller Type Config
      </button>
    </section>
  </div>
</template>

<style scoped>
.ewt-home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.ewt-section {
  margin-bottom: 2rem;
}

.ewt-section-title {
  font-size: 1.5rem;
  color: var(--ewt-text);
  margin-bottom: 1rem;
  font-weight: 600;
}

.ewt-info-text {
  color: var(--ewt-text-secondary);
  font-size: 0.875rem;
}

.ewt-flex--wrap {
  flex-wrap: wrap;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .ewt-section-title {
    font-size: 1.25rem;
  }

  .ewt-form-group {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .ewt-section-title {
    font-size: 1.125rem;
  }

  .ewt-form-group {
    padding: 0.75rem;
  }
}
</style>
