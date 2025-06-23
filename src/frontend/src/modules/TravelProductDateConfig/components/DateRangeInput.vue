<script lang="ts" setup>
import { DateRangeType } from "../types/dateType";
import { computed } from "vue";

const props = defineProps<{
  range?: unknown;
}>();

const emit = defineEmits<{
  (e: "update:range", value: DateRangeType["dateRange"]): void;
}>();

const computedRange = computed(() => {
  if (!props.range) {
    return [];
  }

  if (Array.isArray(props.range)) {
    return props.range.map((item: any) => ({
      startFrom:
        item.startFrom instanceof Date
          ? item.startFrom.toISOString()
          : item.startFrom,
      endTo: item.endTo instanceof Date ? item.endTo.toISOString() : item.endTo,
    }));
  }

  if (
    typeof props.range === "object" &&
    props.range !== null &&
    "dateRange" in (props.range as any)
  ) {
    const dateRangeData = (props.range as any).dateRange;
    if (Array.isArray(dateRangeData)) {
      return dateRangeData.map((item: any) => ({
        startFrom:
          item.startFrom instanceof Date
            ? item.startFrom.toISOString()
            : item.startFrom,
        endTo:
          item.endTo instanceof Date ? item.endTo.toISOString() : item.endTo,
      }));
    }
  }

  return [];
});

const addRange = () => {
  const newRange = [
    ...computedRange.value,
    {
      startFrom: new Date().toISOString(),
      endTo: new Date().toISOString(),
    },
  ];

  emit("update:range", newRange);
};

const removeRange = (index: number) => {
  const newRange = computedRange.value.filter((_, i) => i !== index);
  emit("update:range", newRange);
};

const updateStartDate = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const newRange = [...computedRange.value];
  newRange[index] = {
    ...newRange[index],
    startFrom: new Date(target.value).toISOString(),
  };
  emit("update:range", newRange);
};

const updateEndDate = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const newRange = [...computedRange.value];
  newRange[index] = {
    ...newRange[index],
    endTo: new Date(target.value).toISOString(),
  };
  emit("update:range", newRange);
};

const formatDateForInput = (dateString: string) => {
  if (!dateString) {
    return new Date().toISOString().split("T")[0];
  }
  return new Date(dateString).toISOString().split("T")[0];
};
</script>

<template>
  <div class="ewt-date-range-input">
    <div
      v-for="(item, index) in computedRange"
      :key="index"
      class="ewt-date-range-item"
    >
      <div class="ewt-date-inputs">
        <div class="ewt-input-group">
          <label class="ewt-form-label">
            <i class="fa-solid fa-calendar-plus"></i>
            Start Date
          </label>
          <input
            type="date"
            class="ewt-input ewt-input--date"
            :value="formatDateForInput(item.startFrom)"
            @input="updateStartDate(index, $event)"
          />
        </div>

        <div class="ewt-input-group">
          <label class="ewt-form-label">
            <i class="fa-solid fa-calendar-minus"></i>
            End Date
          </label>
          <input
            type="date"
            class="ewt-input ewt-input--date"
            :value="formatDateForInput(item.endTo)"
            @input="updateEndDate(index, $event)"
            :min="formatDateForInput(item.startFrom)"
          />
        </div>

        <div class="ewt-actions">
          <button
            @click="removeRange(index)"
            class="ewt-button ewt-button--danger ewt-button--sm"
            type="button"
          >
            <i class="fa-solid fa-trash"></i>
            Remove
          </button>
        </div>
      </div>
    </div>

    <div v-if="computedRange.length === 0" class="ewt-empty-state">
      <div class="ewt-empty-content">
        <i class="fa-solid fa-calendar-xmark ewt-empty-icon"></i>
        <p class="ewt-empty-text">No date ranges configured</p>
      </div>
    </div>

    <div class="ewt-add-section">
      <button
        @click="addRange"
        class="ewt-button ewt-button--primary"
        type="button"
      >
        <i class="fa-solid fa-plus"></i>
        Add Date Range
      </button>
    </div>
  </div>
</template>

<style scoped>
.ewt-date-range-input {
  width: 100%;
}

.ewt-date-range-item {
  background: var(--ewt-bg-secondary, #f8f9fa);
  border: 1px solid var(--ewt-border, #e9ecef);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: var(--ewt-transition, all 0.2s ease);
}

.ewt-date-range-item:hover {
  border-color: var(--ewt-primary, #007bff);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.ewt-date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1.5rem;
  align-items: end;
}

.ewt-input-group {
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
}

.ewt-input {
  padding: 0.75rem;
  border: 1px solid var(--ewt-border, #ced4da);
  border-radius: 6px;
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

.ewt-input--date {
  font-family: inherit;
}

.ewt-actions {
  display: flex;
  align-items: end;
}

.ewt-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--ewt-transition, all 0.2s ease);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.ewt-button--primary {
  background-color: var(--ewt-primary, #007bff);
  color: white;
}

.ewt-button--primary:hover {
  background-color: var(--ewt-primary-dark, #0056b3);
  transform: translateY(-1px);
}

.ewt-button--danger {
  background-color: var(--ewt-danger, #dc3545);
  color: white;
}

.ewt-button--danger:hover {
  background-color: var(--ewt-danger-dark, #c82333);
  transform: translateY(-1px);
}

.ewt-button--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.ewt-empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--ewt-text-secondary, #6c757d);
}

.ewt-empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.ewt-empty-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.ewt-empty-text {
  margin: 0;
  font-size: 0.875rem;
}

.ewt-add-section {
  padding-top: 1rem;
  border-top: 1px solid var(--ewt-border, #e9ecef);
}

@media (max-width: 768px) {
  .ewt-date-inputs {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .ewt-actions {
    justify-content: center;
  }

  .ewt-date-range-item {
    padding: 1rem;
  }
}
</style>
