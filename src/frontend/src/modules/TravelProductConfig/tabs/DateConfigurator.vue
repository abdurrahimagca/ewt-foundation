<script setup lang="ts">


import { computed } from "vue";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { storeToRefs } from "pinia";
import { notification } from "@shopware-ag/meteor-admin-sdk";
import { useSw } from "@/modules/shared/composables/useSw";
const { createSwEntity } = useSw();
const store = useTravelProductConfig();
// Format date for Turkish display (DD/MM/YYYY)
const formatDateTurkish = (isoDate: string | null) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
const formatDateForInput = (isoDate: string | null) => {
  if (!isoDate) return "";
  return new Date(isoDate).toISOString().split("T")[0];
};

const swData = computed(() => {
  return storeToRefs(store).dataToEdit.value?.dateConfigurator;
});

const acceptFrom = computed({
  get: () => formatDateForInput(swData.value?.acceptFrom || null),
  set: (value) => {
    if (swData.value) {
      swData.value.acceptFrom = value ? new Date(value).toISOString() : "";
    }
  },
});

const acceptTo = computed({
  get: () => formatDateForInput(swData.value?.acceptTo || null),
  set: (value) => {
    if (swData.value) {
      swData.value.acceptTo = value ? new Date(value).toISOString() : "";
    }
  },
});

const handleNewResource = async () => {
  try {
    const n = await createSwEntity("ce_date_configurator");
    if (!n || !store.dataToEdit) {
      throw new Error("Failed to create resource expection");
    }
    store.dataToEdit.dateConfigurator = n;
  } catch (e) {
    notification.dispatch({
      title: "error",
      message: "Failed create date config",
    });
    console.error(e);
  }
};
</script>

<template>
  <div v-if="swData" class="ewt-container">
    <div class="ewt-form-group">
      <h2 class="ewt-form-title">Date Configuration</h2>

      <div class="ewt-grid ewt-grid--2">
        <div>
          <label class="ewt-form-label">Accept From Date</label>
          <div class="ewt-date-field">
            <input
              type="date"
              v-model="acceptFrom"
              class="ewt-input"
              :min="new Date().toISOString().split('T')[0]"
            />
            <span class="ewt-date-display" v-if="swData.acceptFrom">
              {{ formatDateTurkish(swData.acceptFrom) }}
            </span>
          </div>
        </div>

        <div>
          <label class="ewt-form-label">Accept To Date</label>
          <div class="ewt-date-field">
            <input
              type="date"
              v-model="acceptTo"
              class="ewt-input"
              :min="acceptFrom"
            />
            <span class="ewt-date-display" v-if="swData.acceptTo">
              {{ formatDateTurkish(swData.acceptTo) }}
            </span>
          </div>
        </div>

        <div>
          <label class="ewt-form-label">Maximum Days</label>
          <input
            type="number"
            v-model="swData.maxDays"
            class="ewt-input"
            min="0"
          />
        </div>

        <div>
          <label class="ewt-form-label">Minimum Days</label>
          <input
            type="number"
            v-model="swData.minDays"
            class="ewt-input"
            min="0"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <button
      @click="handleNewResource"
      class="ewt-button ewt-button--primary"
      type="button"
    >
      Create New Date Configurator Resource
    </button>
  </div>
</template>

<style scoped>
.ewt-date-field {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ewt-date-display {
  font-size: 0.9em;
  color: #666;
}
</style>
