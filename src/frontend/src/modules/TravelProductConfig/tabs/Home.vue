<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import ProductStreamSelector from "@/modules/shared/components/ProductStreamSelector.vue";
import DateConfigurator from "../components/DateConfigurator.vue";
import ExtraDayConfigurator from "../components/ExtraDayConfigurator.vue";

const store = useTravelProductConfig();
const swData = computed(() => storeToRefs(store).dataToEdit.value);
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

        <div class="ewt-flex ewt-flex--wrap">
          <div class="ewt-checkbox-group">
            <input
              v-model="swData.isDateConfigurable"
              type="checkbox"
              class="ewt-checkbox"
              id="isDateConfigurable"
            />
            <label for="isDateConfigurable" class="ewt-checkbox-label">
              Date Configurable
            </label>
          </div>

          <div class="ewt-checkbox-group">
            <input
              v-model="swData.allowExtraDays"
              type="checkbox"
              class="ewt-checkbox"
              id="allowExtraDays"
            />
            <label for="allowExtraDays" class="ewt-checkbox-label">
              Allow Extra Days
            </label>
          </div>
        </div>
      </div>
    </section>

    <section class="ewt-section">
      <div class="ewt-info-text ewt-mb-3">
        Configure date settings for this product
      </div>
      <DateConfigurator />
    </section>

    <section class="ewt-section">
      <div class="ewt-info-text ewt-mb-3">
        Configure extra days settings for this product
      </div>
      <ExtraDayConfigurator />
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
