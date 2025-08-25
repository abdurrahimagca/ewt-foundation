<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { computed } from "vue";
import { DateRangeType } from "../types/dateType";
import DateRangeInput from "./DateRangeInput.vue";

const props = defineProps<{
  dateRange: Entity<"ce_date_range"> | null;
}>();

const emit = defineEmits<{
  (e: "update:dateRange", value: Entity<"ce_date_range"> | null): void;
}>();

const durationInDays = computed({
  get: () => props.dateRange?.dateRangeData?.durationInDays ?? 0,
  set: (value: number) => {
    if (props.dateRange?.dateRangeData) {
      props.dateRange.dateRangeData.durationInDays = value;
      emit("update:dateRange", props.dateRange);
    }
  },
});
const updateRange = (value: DateRangeType["dateRange"]) => {
  if (!props.dateRange) {
    return;
  }

  // Initialize dateRangeData if it doesn't exist
  if (!props.dateRange.dateRangeData) {
    props.dateRange.dateRangeData = {
      dateRange: value,
      durationInDays: 0,
    };
  } else {
    props.dateRange.dateRangeData.dateRange = value;
  }

  emit("update:dateRange", props.dateRange);
};
</script>

<template>
  <div class="ewt-date-range-container">
    <div v-if="!dateRange" class="ewt-empty-state">
      <div class="ewt-card ewt-card--secondary">
        <div class="ewt-text-center">
          <i class="fa-solid fa-calendar-xmark ewt-empty-icon"></i>
          <h4 class="ewt-empty-title">No Date Range Configuration Found</h4>
          <p class="ewt-empty-description">
            Date range configuration is not available for this product.
          </p>
        </div>
      </div>
    </div>

    <div v-else class="ewt-date-range-content">
      <!-- Header -->
      <div class="ewt-section-header">
        <div class="ewt-header-content">
          <h3 class="ewt-section-title">
            <i class="fa-solid fa-calendar-days"></i>
            Date Range Configuration
          </h3>
          <p class="ewt-section-description">
            Configure available date ranges and duration limits for this travel
            product
          </p>
        </div>
      </div>

      <!-- Duration Settings -->
      <div class="ewt-card">
        <div class="ewt-card-header">
          <h4 class="ewt-card-title">
            <i class="fa-solid fa-hourglass-half"></i>
            Duration Limits
          </h4>
        </div>
        <div class="ewt-card-body">
          <div class="ewt-form-row">
            <div class="ewt-form-col">
              <label class="ewt-form-label">
                <i class="fa-solid fa-clock"></i>
                Duration (Days)
              </label>
              <input
                type="number"
                class="ewt-input"
                v-model="durationInDays"
                min="1"
                placeholder="e.g., 30"
              />
              <div class="ewt-input-hint">
                Number of days allowed for booking
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ewt-card">
        <div class="ewt-card-header">
          <h4 class="ewt-card-title">
            <i class="fa-solid fa-clock"></i>
            Padding
          </h4>
        </div>
      </div>

      <!-- Date Ranges -->
      <div class="ewt-card">
        <div class="ewt-card-header">
          <h4 class="ewt-card-title">
            <i class="fa-solid fa-calendar-check"></i>
            Available Date Ranges
          </h4>
        </div>
        <div class="ewt-card-body">
          <DateRangeInput
            :range="dateRange?.dateRangeData?.dateRange"
            @update:range="updateRange"
          />
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.ewt-date-range-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.ewt-date-range-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ewt-section-header {
  margin-bottom: 1rem;
}

.ewt-header-content {
  text-align: center;
  padding: 2rem 1rem;
}

.ewt-section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--ewt-text, #212529);
}

.ewt-section-title i {
  color: var(--ewt-primary, #007bff);
  font-size: 1.5rem;
}

.ewt-section-description {
  margin: 0;
  color: var(--ewt-text-secondary, #6c757d);
  font-size: 1rem;
  line-height: 1.5;
}

.ewt-card {
  background: var(--ewt-bg, #fff);
  border: 1px solid var(--ewt-border, #e9ecef);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: var(--ewt-transition, all 0.2s ease);
}

.ewt-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ewt-card--secondary {
  background: var(--ewt-bg-secondary, #f8f9fa);
  border-color: var(--ewt-border-light, #f1f3f4);
}

.ewt-card-header {
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid var(--ewt-border, #e9ecef);
  margin-bottom: 1.5rem;
}

.ewt-card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ewt-text, #212529);
}

.ewt-card-title i {
  color: var(--ewt-primary, #007bff);
}

.ewt-card-body {
  padding: 0 1.5rem 1.5rem;
}

.ewt-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
}

.ewt-form-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ewt-form-label {
  font-weight: 500;
  color: var(--ewt-text, #212529);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.ewt-form-label i {
  color: var(--ewt-primary, #007bff);
  font-size: 0.75rem;
}

.ewt-input {
  padding: 0.75rem;
  border: 1px solid var(--ewt-border, #ced4da);
  border-radius: 8px;
  font-size: 0.875rem;
  transition: var(--ewt-transition, all 0.2s ease);
  background: var(--ewt-bg, #fff);
  color: var(--ewt-text, #212529);
}

.ewt-input:focus {
  outline: none;
  border-color: var(--ewt-primary, #007bff);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.ewt-input-hint {
  font-size: 0.75rem;
  color: var(--ewt-text-secondary, #6c757d);
  margin-top: 0.25rem;
  line-height: 1.3;
}

.ewt-empty-state {
  padding: 2rem;
}

.ewt-text-center {
  text-align: center;
  padding: 3rem 2rem;
}

.ewt-empty-icon {
  font-size: 3rem;
  color: var(--ewt-text-secondary, #6c757d);
  opacity: 0.5;
  margin-bottom: 1.5rem;
}

.ewt-empty-title {
  color: var(--ewt-text, #212529);
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.ewt-empty-description {
  color: var(--ewt-text-secondary, #6c757d);
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .ewt-form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .ewt-section-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .ewt-header-content {
    padding: 1.5rem 1rem;
  }

  .ewt-card-header,
  .ewt-card-body {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .ewt-text-center {
    padding: 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .ewt-section-title {
    font-size: 1.25rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ewt-header-content {
    padding: 1rem;
  }

  .ewt-card-header,
  .ewt-card-body {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>
