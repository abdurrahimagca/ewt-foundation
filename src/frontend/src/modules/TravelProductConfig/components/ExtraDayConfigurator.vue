<script setup lang="ts">
import { computed } from "vue";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { storeToRefs } from "pinia";
import { useSw } from "@/modules/shared/composables/useSw";
const store = useTravelProductConfig();
const swData = computed(() => {
  return storeToRefs(store).dataToEdit.value?.extraDaysConfigurator;
});
const { createSwEntity, deleteSwEntity } = useSw();

const handleDeleteResource = async () => {
  try {
    if (!swData.value || !store?.dataToEdit?.id) {
      throw new Error("swData (extraDaysConfigurator) is not defined");
    }
    const id = swData.value.id;
    store.dataToEdit.extraDaysConfiguratorId = null;
    store.dataToEdit.extraDaysConfigurator = null;

    await store.upsertResource();
    await deleteSwEntity("ce_extra_day_configurator", id);
  } catch (e) {
    console.error(e);
  }
};

const handleNewResource = async () => {
  try {
    const n = await createSwEntity("ce_extra_day_configurator");
    if (!n || !store.dataToEdit) {
      throw new Error("Failed to create resource exception");
    }
    store.dataToEdit.extraDaysConfiguratorId = n.id;
    store.dataToEdit.extraDaysConfigurator = n;
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div v-if="swData" class="ewt-card">
    <h4 class="ewt-form-title">Extra Days Configuration</h4>
    <div class="ewt-flex ewt-flex--between ewt-mb-3">
      <button
        v-if="swData"
        class="ewt-button ewt-button--danger"
        @click="handleDeleteResource"
      >
        Delete Extra Days Resource
      </button>
    </div>
    <div class="ewt-grid ewt-grid--2">
      <div class="ewt-form-group">
        <label class="ewt-form-label">Max Extra Post Days</label>
        <div class="ewt-form-control">
          <input
            v-model="swData.maxExtraPostDays"
            type="number"
            class="ewt-input"
            min="0"
            placeholder="Enter max post days"
          />
        </div>
      </div>

      <div class="ewt-form-group">
        <label class="ewt-form-label">Max Extra Pre Days</label>
        <div class="ewt-form-control">
          <input
            v-model="swData.maxExtraPreDays"
            type="number"
            class="ewt-input"
            min="0"
            placeholder="Enter max pre days"
          />
        </div>
      </div>

      <div class="ewt-form-group">
        <label class="ewt-form-label">Max Travellers Accepted</label>
        <div class="ewt-form-control">
          <input
            v-model="swData.maxTravellersAccepted"
            type="number"
            class="ewt-input"
            min="1"
            placeholder="Enter max travellers"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else="">
    <div class="ewt-empty-state">
      <h4 class="ewt-form-title">Extra Days Configuration</h4>
      <p class="ewt-txt ewt-mb-3">No extra days configuration found.</p>
      <button class="ewt-button ewt-button--primary" @click="handleNewResource">
        Create New Extra Days Resource
      </button>
    </div>
  </div>
</template>

<style scoped>
.ewt-grid {
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .ewt-grid--2 {
    grid-template-columns: 1fr;
  }
}
</style>
