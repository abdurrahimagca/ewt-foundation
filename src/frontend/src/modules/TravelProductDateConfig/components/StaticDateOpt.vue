<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { computed } from "vue";

const props = defineProps<{
  staticDate: Entity<"ce_static_date_opt"> | null;
}>();

const formatDate = (date: Date | string | null) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
};

const parseDate = (dateString: string) => {
  return new Date(dateString);
};

const calculatedDuration = computed(() => {
  if (!props.staticDate?.startDate || !props.staticDate?.endDate) {
    return 0;
  }

  const start =
    typeof props.staticDate.startDate === "string"
      ? new Date(props.staticDate.startDate)
      : props.staticDate.startDate;
  const end =
    typeof props.staticDate.endDate === "string"
      ? new Date(props.staticDate.endDate)
      : props.staticDate.endDate;

  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
});

const isValidDateRange = computed(() => {
  if (!props.staticDate?.startDate || !props.staticDate?.endDate) {
    return true; // No validation error if dates are not set
  }

  const start =
    typeof props.staticDate.startDate === "string"
      ? new Date(props.staticDate.startDate)
      : props.staticDate.startDate;
  const end =
    typeof props.staticDate.endDate === "string"
      ? new Date(props.staticDate.endDate)
      : props.staticDate.endDate;

  return start <= end;
});

const isDurationMismatch = computed(() => {
  if (!props.staticDate?.durationInDays || calculatedDuration.value === 0) {
    return false;
  }
  return (
    Math.abs(calculatedDuration.value - props.staticDate.durationInDays) > 0
  );
});

const updateStartDate = (event: Event) => {
  if (props.staticDate) {
    (props.staticDate.startDate as any) = parseDate(
      (event.target as HTMLInputElement).value,
    );
  }
};

const updateEndDate = (event: Event) => {
  if (props.staticDate) {
    (props.staticDate.endDate as any) = parseDate(
      (event.target as HTMLInputElement).value,
    );
  }
};

const syncDurationFromDates = () => {
  if (props.staticDate && calculatedDuration.value > 0) {
    props.staticDate.durationInDays = calculatedDuration.value;
  }
};
</script>

<template>
  <div class="ewt-static-date-container">
    <div class="ewt-card-header">
      <h3 class="ewt-card-title">
        <i class="fa-solid fa-calendar-check"></i>
        Static Date Configuration
      </h3>
    </div>

    <div v-if="!staticDate" class="ewt-empty-state">
      <div class="ewt-card ewt-card--secondary">
        <div class="ewt-text-center">
          <i
            class="fa-solid fa-calendar-xmark"
            style="
              font-size: 2rem;
              color: var(--ewt-text-secondary);
              margin-bottom: 1rem;
            "
          ></i>
          <h4>No Static Date Configuration Found</h4>
          <p>Static date configuration is not available.</p>
        </div>
      </div>
    </div>

    <div v-else class="ewt-static-date-content">
      <!-- Date Configuration -->
      <div class="ewt-collapsible">
        <div class="ewt-collapsible-header">
          <h4 class="ewt-collapsible-title">
            <i class="fa-solid fa-calendar-days"></i>
            Travel Dates
          </h4>
        </div>
        <div class="ewt-collapsible-content expanded">
          <div class="ewt-form-row">
            <div class="ewt-form-col">
              <label class="ewt-form-label">
                <i class="fa-solid fa-calendar-plus"></i>
                Start Date
              </label>
              <input
                type="date"
                class="ewt-input ewt-input--date"
                :class="{ 'ewt-input--error': !isValidDateRange }"
                :value="formatDate(staticDate.startDate || null)"
                @input="updateStartDate"
                @change="syncDurationFromDates"
              />
              <div class="ewt-input-hint">
                The departure or start date of the travel
              </div>
            </div>
            <div class="ewt-form-col">
              <label class="ewt-form-label">
                <i class="fa-solid fa-calendar-minus"></i>
                End Date
              </label>
              <input
                type="date"
                class="ewt-input ewt-input--date"
                :class="{ 'ewt-input--error': !isValidDateRange }"
                :value="formatDate(staticDate.endDate || null)"
                @input="updateEndDate"
                @change="syncDurationFromDates"
                :min="formatDate(staticDate.startDate || null)"
              />
              <div class="ewt-input-hint">
                The return or end date of the travel
              </div>
            </div>
          </div>

          <!-- Validation Errors -->
          <div v-if="!isValidDateRange" class="ewt-card ewt-card--danger">
            <div class="ewt-flex ewt-flex--center">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span class="ewt-error-text"
                >End date must be after or equal to start date</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Duration Configuration -->
      <div class="ewt-collapsible">
        <div class="ewt-collapsible-header">
          <h4 class="ewt-collapsible-title">
            <i class="fa-solid fa-hourglass-half"></i>
            Duration Settings
          </h4>
        </div>
        <div class="ewt-collapsible-content expanded">
          <div class="ewt-form-group">
            <label class="ewt-form-label">
              <i class="fa-solid fa-clock"></i>
              Duration in Days
            </label>
            <input
              type="number"
              class="ewt-input"
              :class="{ 'ewt-input--error': isDurationMismatch }"
              v-model="staticDate.durationInDays"
              min="1"
              placeholder="e.g., 7"
            />
            <div class="ewt-input-hint">
              Total number of days for this travel package
            </div>
          </div>

          <!-- Duration Information -->
          <div class="ewt-card ewt-card--secondary">
            <div class="ewt-duration-info">
              <div class="ewt-flex ewt-flex--between ewt-flex--center">
                <div>
                  <strong>Calculated Duration:</strong>
                  <span class="ewt-duration-value"
                    >{{ calculatedDuration }} days</span
                  >
                </div>
                <button
                  v-if="calculatedDuration > 0 && isDurationMismatch"
                  class="ewt-button ewt-button--primary ewt-button--sm"
                  @click="syncDurationFromDates"
                  title="Sync duration with selected dates"
                >
                  <i class="fa-solid fa-sync"></i>
                  Sync Duration
                </button>
              </div>
              <small class="ewt-meta-info">
                <i class="fa-solid fa-info-circle"></i>
                This is automatically calculated from your start and end dates
              </small>
            </div>
          </div>

          <!-- Duration Mismatch Warning -->
          <div v-if="isDurationMismatch" class="ewt-card ewt-card--warning">
            <div class="ewt-flex ewt-flex--center">
              <i class="fa-solid fa-exclamation-triangle"></i>
              <span class="ewt-warning-text">
                Duration mismatch: Manual duration ({{
                  staticDate.durationInDays
                }}
                days) differs from calculated duration ({{ calculatedDuration }}
                days)
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="ewt-collapsible">
        <div class="ewt-collapsible-header">
          <h4 class="ewt-collapsible-title">
            <i class="fa-solid fa-clipboard-list"></i>
            Configuration Summary
          </h4>
        </div>
        <div class="ewt-collapsible-content expanded">
          <div class="ewt-summary-grid">
            <div class="ewt-summary-item">
              <div class="ewt-summary-label">
                <i class="fa-solid fa-play"></i>
                Start Date
              </div>
              <div class="ewt-summary-value">
                {{
                  staticDate.startDate
                    ? formatDate(staticDate.startDate)
                    : "Not set"
                }}
              </div>
            </div>
            <div class="ewt-summary-item">
              <div class="ewt-summary-label">
                <i class="fa-solid fa-stop"></i>
                End Date
              </div>
              <div class="ewt-summary-value">
                {{
                  staticDate.endDate
                    ? formatDate(staticDate.endDate)
                    : "Not set"
                }}
              </div>
            </div>
            <div class="ewt-summary-item">
              <div class="ewt-summary-label">
                <i class="fa-solid fa-calendar-days"></i>
                Total Duration
              </div>
              <div class="ewt-summary-value">
                {{ staticDate.durationInDays || 0 }} days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ewt-static-date-container {
  width: 100%;
}

.ewt-static-date-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ewt-duration-info {
  padding: 0.75rem;
}

.ewt-duration-value {
  margin-left: 0.5rem;
  font-weight: 600;
  color: var(--ewt-primary);
}

.ewt-card--danger {
  background-color: #fef2f2;
  border-color: var(--ewt-danger);
  color: var(--ewt-danger);
}

.ewt-card--warning {
  background-color: #fffbeb;
  border-color: var(--ewt-warning);
  color: #92400e;
}

.ewt-warning-text {
  font-size: 0.875rem;
}

.ewt-empty-state h4 {
  color: var(--ewt-text);
  margin: 0.5rem 0;
}

.ewt-form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.ewt-form-col {
  flex: 1;
  min-width: 0;
}

@media (max-width: 768px) {
  .ewt-form-row {
    flex-direction: column;
    gap: 0.5rem;
  }
}

.ewt-input-hint {
  font-size: 0.75rem;
  color: var(--ewt-text-secondary);
  margin-top: 0.25rem;
}

.ewt-card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.ewt-collapsible-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
}

.ewt-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.ewt-summary-item {
  padding: 1rem;
  background: var(--ewt-bg);
  border-radius: var(--ewt-input-radius);
  border: 1px solid var(--ewt-border);
}

.ewt-summary-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--ewt-text-secondary);
  margin-bottom: 0.5rem;
}

.ewt-summary-value {
  font-size: 1rem;
  font-weight: 500;
  color: var(--ewt-text);
}
</style>
