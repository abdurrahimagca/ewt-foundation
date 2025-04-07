<script setup lang="ts">
import { computed } from "vue";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { storeToRefs } from "pinia";
const store = useTravelProductConfig();
import { useSw } from "@/modules/shared/composables/useSw";
const {createSwEntity} = useSw();
const swData = computed(() => {
  return storeToRefs(store).dataToEdit.value?.childDiscount;
});
const handleNewResource = async () => {
  try {
    const n = await createSwEntity("ce_custom_child_discount");
    if (!n || !store.dataToEdit) {
      console.error("Failed to create new child discount resource");
      return;
    }
    store.dataToEdit.childDiscount = n;
  } catch (error) {
    console.error("Error creating new child discount resource:", error);
  }
};
</script>

<template>
  <div v-if="swData" class="ewt-form-group">
    <label class="ewt-form-label">Child Discount Percentage</label>
    <div class="ewt-form-control">
      <input
        type="number"
        v-model="swData.childDiscountPercentage"
        placeholder="Enter child discount"
      />
    </div>
  </div>
  <div v-if="swData" class="ewt-form-group">
    <label class="ewt-form-label">Infants Discount Percentage</label>
    <div class="ewt-form-control">
      <input
        type="number"
        v-model="swData.infantsDiscountPercentage"
        placeholder="Enter child discount amount"
      />
    </div>
  </div>
  <div v-else>
    <button
      @click="handleNewResource"
      class="ewt-button ewt-button--primary"
      type="button"
    >
      Create New Child Discount Resource
    </button>
  </div>
</template>
