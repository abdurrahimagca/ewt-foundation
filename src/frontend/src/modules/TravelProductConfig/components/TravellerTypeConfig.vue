<script setup lang="ts">
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import ProductSelector from "@/modules/shared/components/ProductSelector.vue";

const store = useTravelProductConfig();
const swData = computed(
  () => storeToRefs(store).dataToEdit.value?.travellerTypeConfig,
);
</script>

<template>
  <div v-if="swData" class="ewt-form-group">
    <label class="ewt-form-label">Traveller Type Configuration</label>
    <div class="ewt-grid ewt-grid--2">
      <div class="ewt-form-group">
        <label class="ewt-form-label">Adult Start Age</label>
        <input
          v-model="swData.adultStartAge"
          type="number"
          class="ewt-input"
          placeholder="Adult Start Age"
        />
        <label class="ewt-form-label">Adult End Age</label>
        <input
          v-model="swData.adultEndAge"
          type="number"
          class="ewt-input"
          placeholder="Adult End Age"
        />
        <label class="ewt-form-label">Child Start Age</label>
        <input
          v-model="swData.childStartAge"
          type="number"
          class="ewt-input"
          placeholder="Child Start Age"
        />
        <label class="ewt-form-label">Child End Age</label>
        <input
          v-model="swData.childEndAge"
          type="number"
          class="ewt-input"
          placeholder="Child End Age"
        />
        <label class="ewt-form-label">Infant Start Age</label>
        <input
          v-model="swData.infantStartAge"
          type="number"
          class="ewt-input"
          placeholder="Infant Start Age"
        />
        <label class="ewt-form-label">Infant End Age</label>
        <input
          v-model="swData.infantEndAge"
          type="number"
          class="ewt-input"
          placeholder="Infant End Age"
        />
        <label class="ewt-form-label">Infant Product Stream</label>
        <ProductSelector
          v-model="swData.infantProduct"
          :product-id="swData.infantProductId"
          @update:modelValue="
            (s) => {
              if (s && swData) {
                swData.infantProduct = s;
                swData.infantProductId = s.id;
              }
            }
          "
        />
        <label class="ewt-form-label">Child Product Stream</label>
        <ProductSelector
          v-model="swData.childProduct"
          :product-stream-id="swData.childProductId"
          @update:modelValue="
            (s) => {
              if (s && swData) {
                swData.childProduct = s;
                swData.childProductId = s.id;
              }
            }
          "
        />
      </div>
    </div>
  </div>
</template>
