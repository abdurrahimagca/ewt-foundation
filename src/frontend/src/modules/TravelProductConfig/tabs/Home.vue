<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import ProductCollectionSelector from "@/modules/shared/components/ProductCollectionSelector.vue";

const store = useTravelProductConfig();
const swData = computed(() => storeToRefs(store).dataToEdit.value);
</script>

<template>
  <div v-if="swData">
    <h2 class="ewt-form-title">{{ swData.configurationIdentifier }}</h2>
    <label class="ewt-form-label">Associated Product</label>
    <p>
      This is the product that will be associated with the travel product
      configuration.
    </p>
    <div v-if="swData?.productsToApply">
      >
      <ProductCollectionSelector
        v-model="swData.productsToApply"
        :maxLimit="Infinity"
        :minLimit="0"
      />
    </div>

    <div class="ewt-grid ewt-grid--2">
      <div class="ewt-form-group">
        <div class="ewt-checkbox-group">
          <input
            v-model="swData.variantAware"
            type="checkbox"
            class="ewt-checkbox"
          />
          <label class="ewt-checkbox-label">Variant Aware</label>
        </div>
      </div>

      <div class="ewt-form-group">
        <div class="ewt-checkbox-group">
          <input
            v-model="swData.isDateConfigurable"
            type="checkbox"
            class="ewt-checkbox"
          />
          <label class="ewt-checkbox-label">Is Date Configurable</label>
        </div>
      </div>
    </div>

    <input
      v-model="swData.configurationName"
      type="text"
      placeholder="Configuration Name"
      class="ewt-input"
    />
  </div>
</template>

<style scoped>
/* All styles moved to global CSS */
</style>
