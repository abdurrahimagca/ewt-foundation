<script setup lang="ts">
import { computed } from "vue";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { storeToRefs } from "pinia";
import { notification } from "@shopware-ag/meteor-admin-sdk";
import { useSw } from "@/modules/shared/composables/useSw";
const { createSwEntity, deleteSwEntity } = useSw();
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
const deleteResource = async () => {
  try {
    if (!swData.value || !store?.dataToEdit?.id) {
      throw new Error("swData (dateConfigurator) is not defined");
    }
    const id = swData.value.id;
    store.dataToEdit.dateConfiguratorId = null;
    store.dataToEdit.dateConfigurator = null;

    await store.upsertResource();
    await deleteSwEntity("ce_date_configurator", id);
  } catch (e) {
    notification.dispatch({
      title: "error",
      message: "Failed to delete date configurator",
    });
    console.error(e);
  }
};
</script>

<template>
  <div v-if="swData" class="ewt-card">
    <div class="ewt-form-section">
      <div class="ewt-flex ewt-flex--between ewt-mb-3">
        <button
          v-if="swData"
          class="ewt-button ewt-button--danger"
          @click="deleteResource"
        >
          Delete Date Configurator Resource
        </button>
      </div>
      <h4 class="ewt-form-title">Date Configuration</h4>

      <div class="ewt-grid ewt-grid--2">
        <div class="ewt-form-group">
          <label class="ewt-form-label">Accept From Date</label>
          <div class="ewt-date-field">
            <input
              type="date"
              v-model="acceptFrom"
              class="ewt-input ewt-input--date"
              :min="new Date().toISOString().split('T')[0]"
            />
            <span v-if="swData.acceptFrom" class="ewt-date-display">
              {{ formatDateTurkish(swData.acceptFrom) }}
            </span>
          </div>
        </div>

        <div class="ewt-form-group">
          <label class="ewt-form-label">Accept To Date</label>
          <div class="ewt-date-field">
            <input
              type="date"
              v-model="acceptTo"
              class="ewt-input ewt-input--date"
              :min="acceptFrom"
            />
            <span v-if="swData.acceptTo" class="ewt-date-display">
              {{ formatDateTurkish(swData.acceptTo) }}
            </span>
          </div>
        </div>

        <div class="ewt-form-group">
          <label class="ewt-form-label">Maximum Days</label>
          <div class="ewt-form-control">
            <input
              type="number"
              v-model="swData.maxDays"
              class="ewt-input"
              min="0"
              placeholder="Enter maximum days"
            />
          </div>
        </div>

        <div class="ewt-form-group">
          <label class="ewt-form-label">Minimum Days</label>
          <div class="ewt-form-control">
            <input
              type="number"
              v-model="swData.minDays"
              class="ewt-input"
              min="0"
              placeholder="Enter minimum days"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="ewt-empty-state">
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
.ewt-form-section {
  padding: 1.5rem;
}

.ewt-date-field {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ewt-input--date {
  padding: 0.75rem;
  font-family: inherit;
}

.ewt-date-display {
  font-size: 0.875rem;
  color: var(--ewt-text-secondary);
  background: var(--ewt-bg);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.ewt-empty-state {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

@media (max-width: 768px) {
  .ewt-grid--2 {
    grid-template-columns: 1fr;
  }

  .ewt-form-section {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .ewt-form-section {
    padding: 0.75rem;
  }

  .ewt-form-title {
    font-size: 1.25rem;
  }
}
</style>
