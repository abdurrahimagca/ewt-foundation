<script setup lang="ts">
import ProductSelector from "@/modules/shared/components/ProductSelector.vue";

const props = defineProps<{
  id: string;
}>();
const swData = computed(() => {
  return storeToRefs(store).dataToEdit.value?.hotelBundle?.roomOptions?.get(
    props.id,
  )?.roomSaleRule;
});
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import { storeToRefs } from "pinia";
const store = useTravelProductConfig();
</script>
<template>
  <div v-if="swData" class="ewt-form-group">
    <h4 class="ewt-form-title">Occupancy Configuration</h4>

    <div class="ewt-grid ewt-grid--2">
      <!-- Adults -->
      <div class="ewt-fieldset">
        <h5 class="ewt-fieldset-title">Adults</h5>
        <div class="ewt-form-row compact">
          <div class="ewt-form-col">
            <label class="ewt-form-label">Minimum</label>
            <input
              v-model="swData.minAdults"
              type="number"
              min="0"
              class="ewt-input ewt-input--sm ewt-input--number"
              placeholder="Min adults"
            />
          </div>
          <div class="ewt-form-col">
            <label class="ewt-form-label">Maximum</label>
            <input
              v-model="swData.maxAdults"
              type="number"
              min="0"
              class="ewt-input ewt-input--sm ewt-input--number"
              placeholder="Max adults"
            />
          </div>
        </div>
      </div>

      <!-- Children -->
      <div class="ewt-fieldset">
        <h5 class="ewt-fieldset-title">Children</h5>
        <div class="ewt-form-row compact">
          <div class="ewt-form-col">
            <label class="ewt-form-label">Minimum</label>
            <input
              v-model="swData.minChildren"
              type="number"
              min="0"
              class="ewt-input ewt-input--sm ewt-input--number"
              placeholder="Min children"
            />
          </div>
          <div class="ewt-form-col">
            <label class="ewt-form-label">Maximum</label>
            <input
              v-model="swData.maxChildren"
              type="number"
              min="0"
              class="ewt-input ewt-input--sm ewt-input--number"
              placeholder="Max children"
            />
          </div>
        </div>
      </div>

      <!-- Infants -->
      <div class="ewt-fieldset">
        <h5 class="ewt-fieldset-title">Infants</h5>
        <div class="ewt-form-row compact">
          <div class="ewt-form-col">
            <label class="ewt-form-label">Minimum</label>
            <input
              v-model="swData.minInfants"
              type="number"
              min="0"
              class="ewt-input ewt-input--sm ewt-input--number"
              placeholder="Min infants"
            />
          </div>
          <div class="ewt-form-col">
            <label class="ewt-form-label">Maximum</label>
            <input
              v-model="swData.maxInfants"
              type="number"
              min="0"
              class="ewt-input ewt-input--sm ewt-input--number"
              placeholder="Max infants"
            />
          </div>
        </div>
      </div>

      <!-- Total Persons -->
      <div class="ewt-fieldset">
        <h5 class="ewt-fieldset-title">Total Persons</h5>
        <div class="ewt-form-row compact">
          <div class="ewt-form-col">
            <label class="ewt-form-label">Minimum</label>
            <input
              v-model="swData.minTotalPersons"
              type="number"
              min="0"
              class="ewt-input ewt-input--sm ewt-input--number"
              placeholder="Min total"
            />
          </div>
          <div class="ewt-form-col">
            <label class="ewt-form-label">Maximum</label>
            <input
              v-model="swData.maxTotalPersons"
              type="number"
              min="0"
              class="ewt-input ewt-input--sm ewt-input--number"
              placeholder="Max total"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Supplement Product -->
    <div class="ewt-form-group ewt-form-group--subtle ewt-mt-4">
      <label class="ewt-form-label">Supplement Product</label>
      <ProductSelector
        v-model="swData.supplementProduct"
        @update:modelValue="
          (s) => {
            if (s && swData) {
              swData.supplementProduct = s;
              swData.supplementProductId = s.id;
            }
          }
        "
      />
    </div>
  </div>
</template>
