<script setup lang="ts">
import Supplement from "./Supplement.vue";
import { useSw } from "@/modules/shared/composables/useSw";

const { createSwEntity } = useSw();
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
import { notification } from "@shopware-ag/meteor-admin-sdk";
const store = useTravelProductConfig();
async function handleCreateSupplementRuleResource() {
  try {
    if (!swData.value) throw new Error("SwData is null");
    const newSupplementRule = await createSwEntity("ce_room_supplement_rule");
    if (newSupplementRule === null) {
      throw new Error("Could not create new supplement rule");
    }
    swData.value.supplementRule = newSupplementRule;
  } catch (e) {
    console.log(e);
    notification.dispatch({
      title: "Error",
      message: "Couldnt create Resoruce",
    });
  }
}
</script>
<template>
  <div v-if="swData" class="ewt-form-group">
    <h4 class="ewt-form-title">Occupancy Configuration</h4>

    <div class="ewt-grid ewt-grid--2">
      <!-- Adults -->
      <div class="ewt-form-group">
        <label class="ewt-form-label">Adults</label>
        <div class="ewt-flex">
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Minimum</label>
            <input
              v-model="swData.minAdults"
              type="number"
              class="ewt-input"
              placeholder="Min adults"
            />
          </div>
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Maximum</label>
            <input
              v-model="swData.maxAdults"
              type="number"
              class="ewt-input"
              placeholder="Max adults"
            />
          </div>
        </div>
      </div>

      <!-- Children -->
      <div class="ewt-form-group">
        <label class="ewt-form-label">Children</label>
        <div class="ewt-flex">
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Minimum</label>
            <input
              v-model="swData.minChildren"
              type="number"
              class="ewt-input"
              placeholder="Min children"
            />
          </div>
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Maximum</label>
            <input
              v-model="swData.maxChildren"
              type="number"
              class="ewt-input"
              placeholder="Max children"
            />
          </div>
        </div>
      </div>

      <!-- Infants -->
      <div class="ewt-form-group">
        <label class="ewt-form-label">Infants</label>
        <div class="ewt-flex">
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Minimum</label>
            <input
              v-model="swData.minInfants"
              type="number"
              class="ewt-input"
              placeholder="Min infants"
            />
          </div>
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Maximum</label>
            <input
              v-model="swData.maxInfants"
              type="number"
              class="ewt-input"
              placeholder="Max infants"
            />
          </div>
        </div>
      </div>

      <!-- Total Persons and Pets -->
      <div class="ewt-form-group">
        <label class="ewt-form-label">Maximum Total Persons</label>
        <input
          v-model="swData.maxTotalPersons"
          type="number"
          class="ewt-input"
          placeholder="Max total persons"
        />
      </div>
    </div>
    <div v-if="swData.supplementRule">
      <Supplement :id="props.id" />
    </div>
    <div v-else>
      <button
        class="ewt-button ewt-button--primary"
        @click="handleCreateSupplementRuleResource"
      >
        <span class="ewt-button--secondary"
          >Initialize Supplement Rule Resource</span
        >
      </button>
    </div>
  </div>
</template>
