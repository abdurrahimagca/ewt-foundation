<script lang="ts" setup>
import { data } from "@shopware-ag/meteor-admin-sdk";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { location } from "@shopware-ag/meteor-admin-sdk";
import DateRange from "./DateRange.vue";
import StaticDateOpt from "./StaticDateOpt.vue";
import { useDateConfig } from "../store/useDateConfig";

const dateConfigStore = useDateConfig();
const { data: dateConfigData, isLoading, error } = storeToRefs(dateConfigStore);

onMounted(async () => {
  location.startAutoResizer();
  try {
    const result: any = await data.get({
      id: "sw-product-detail__product",
      selectors: ["id"],
    });
    if (!result || !result.id) {
      dateConfigStore.error = "Product ID is required";
      return;
    }
    await dateConfigStore.init(result.id);
  } catch (error) {
    console.error(error);
  } finally {
    location.stopAutoResizer();
  }
});
</script>

<template>
  <div class="ewt-container">
    <header class="ewt-header">
      <div class="ewt-flex ewt-flex--between ewt-flex--center">
        <h1 class="ewt-title">
          <i class="fa-solid fa-calendar-days"></i>
          Date Configuration
        </h1>
        <div class="ewt-button-group" v-if="dateConfigData">
          <button
            class="ewt-button ewt-button--primary"
            @click="dateConfigStore.saveResource"
            :disabled="isLoading"
          >
            <i class="fa-solid fa-save"></i>
            Save Configuration
          </button>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="ewt-loading">
      <div class="ewt-loading-spinner"></div>
      <p>Loading date configuration...</p>
      <small class="ewt-loading-hint">This may take a few moments</small>
    </div>

    <!-- Error State -->
    <div v-if="error" class="ewt-card ewt-card--danger">
      <div class="ewt-flex ewt-flex--center">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span class="ewt-error-text">{{ error }}</span>
      </div>
    </div>

    <div v-if="dateConfigData">
      <button
        class="ewt-button ewt-button--primary"
        @click="dateConfigStore.deleteResource"
      >
        <i class="fa-solid fa-trash"></i>
        Delete Date Configuration
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!dateConfigData && !isLoading && !error" class="ewt-empty-state">
      <div class="ewt-card">
        <div
          class="ewt-flex ewt-flex--center"
          style="flex-direction: column; gap: 1rem"
        >
          <i
            class="fa-solid fa-calendar-xmark"
            style="font-size: 3rem; color: var(--ewt-text-secondary)"
          ></i>
          <h3>No Date Configuration Found</h3>
          <p class="ewt-text-center">
            Create a date configuration to manage travel product availability
            and scheduling.
          </p>
          <button
            class="ewt-button ewt-button--primary"
            @click="dateConfigStore.createNewResource('dateRange')"
          >
            <i class="fa-solid fa-plus"></i>
            Create Date Configuration Date Range
          </button>
          <button
            class="ewt-button ewt-button--primary"
            @click="dateConfigStore.createNewResource('staticDate')"
          >
            <i class="fa-solid fa-plus"></i>
            Create Date Configuration Static Date
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="dateConfigData?.dateRange && dateConfigData?.isDateRange"
      class="ewt-content"
    >
      <DateRange :dateRange="dateConfigData.dateRange" />
    </div>
    <div
      v-if="dateConfigData?.staticDate && dateConfigData?.isStaticDate"
      class="ewt-content"
    >
      <StaticDateOpt :staticDate="dateConfigData.staticDate" />
    </div>
  </div>
</template>

<style scoped>
.ewt-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.ewt-loading-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 1rem;
  border: 3px solid var(--ewt-border);
  border-top: 3px solid var(--ewt-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.ewt-loading-hint {
  color: var(--ewt-text-secondary);
  margin-top: 0.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.ewt-header {
  margin-bottom: 2rem;
}

.ewt-header .ewt-title {
  margin: 0;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ewt-card--danger {
  background-color: #fef2f2;
  border-color: var(--ewt-danger);
  color: var(--ewt-danger);
}

.ewt-empty-state h3,
.ewt-empty-state h4 {
  color: var(--ewt-text);
  margin: 0.5rem 0;
}

.ewt-meta-info {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--ewt-text-secondary);
  line-height: 1.4;
}
</style>
