<script setup lang="ts">
const props = defineProps<{
  id: string;
}>();
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import ProductStreamSelector from "@/modules/shared/components/ProductStreamSelector.vue";
const store = useTravelProductConfig();
const swData = computed(() => {
  return storeToRefs(store).dataToEdit.value?.hotelBundle?.roomOptions?.get(
    props.id,
  )?.roomSaleRule?.supplementRule;
});
</script>

<template>
  <div v-if="swData" class="ewt-card">
    <h4 class="ewt-form-title">Supplement Configuration</h4>

    <div class="ewt-grid ewt-grid--2">
      <div class="ewt-form-group">
        <label class="ewt-form-label">Apply if Adult Count</label>
        <input
          v-model="swData.applyIfAdults"
          type="number"
          class="ewt-input"
          placeholder="Apply if adults"
        />
      </div>

      <div class="ewt-form-group">
        <label class="ewt-form-label">Apply if Children Count</label>
        <input
          v-model="swData.applyIfChildren"
          type="number"
          class="ewt-input"
          placeholder="Apply if children"
        />
      </div>
    </div>

    <label class="ewt-form-label">Supplement Products</label>
    <p class="ewt-txt ewt-mb-3">These products will be added to cart</p>
    <ProductStreamSelector
      v-model="swData.supplementProductsStream"
      @update:modelValue="
        (s) => {
          if (s && swData) {
            swData.supplementProductsStream = s;
            swData.supplementProductsStreamId = s.id;
          }
        }
      "
    />
  </div>
</template>
