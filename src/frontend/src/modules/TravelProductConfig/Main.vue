<script lang="ts" setup>
import HotelBundle from "./tabs/HotelBundle.vue";
import Home from "./tabs/Home.vue";
import GenericBundle from "./tabs/GenericBundle.vue";
import { ref, computed } from "vue";

import { useTravelProductConfig } from "./store/useTravelProductConfig";
import { storeToRefs } from "pinia";
import DataTable from "./components/DataTable.vue";
import DateConfigurator from "./tabs/DateConfigurator.vue";
import ChildDiscount from "./components/ChildDiscount.vue";
const store = useTravelProductConfig();
const isEditMode = storeToRefs(store).isEditing;
const isLoading = storeToRefs(store).isLoading;
const tabs = [
  {
    name: "home",
    component: Home,
    label: "Home",
    icon: "fa-solid fa-home",
  },
  {
    name: "hotelBundle",
    component: HotelBundle,
    label: "Hotel Bundle",
    icon: "fa-solid fa-hotel",
  },
  {
    name: "genericBundle",
    component: GenericBundle,
    label: "Generic Bundle",
    icon: "fa-solid fa-box",
  },
  {
    name: "dateConfigurator",
    component: DateConfigurator,
    label: "Date Configurator",
    icon: "fa-solid fa-calendar",
  },
  {
    name: "childDiscount",
    component: ChildDiscount,
    label: "Child Discount",
    icon: "fa-solid fa-child",
  },
];

const currentTab = ref("home");

const activeComponent = computed(
  () => tabs.find((tab) => tab.name === currentTab.value)?.component,
);

const switchTab = (tabName: string) => {
  currentTab.value = tabName;
};

const currentResource = computed(() => storeToRefs(store).dataToEdit.value?.id);

const handleDelete = async () => {
  if (!currentResource.value) return;
  if (!confirm("Are you sure you want to delete this configuration?")) return;
  await store.deleteResource(currentResource.value);
};

const handleCancel = () => {
  if (
    confirm(
      "Are you sure you want to cancel? Any unsaved changes will be lost.",
    )
  ) {
    store.cancelEdit();
  }
};
</script>

<template>
  <div v-if="isEditMode">
    <div class="ewt-container">
      <header class="ewt-header">
        <div class="ewt-flex ewt-flex--between ewt-flex--center">
          <h1 class="ewt-title">Travel Product Config</h1>
          <div class="ewt-button-group">
            <button
              class="ewt-button ewt-button--secondary"
              @click="handleCancel"
            >
              <i class="fa-solid fa-xmark"></i>
              Cancel
            </button>
            <button class="ewt-button ewt-button--danger" @click="handleDelete">
              <i class="fa-solid fa-trash"></i>
              Delete
            </button>
            <button
              class="ewt-button ewt-button--primary"
              @click="store.upsertResource"
            >
              <i class="fa-solid fa-save"></i>
              Save Changes
            </button>
          </div>
        </div>
      </header>

      <nav class="ewt-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          class="ewt-button"
          :class="{ 'ewt-button--active': currentTab === tab.name }"
          @click="switchTab(tab.name)"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </nav>

      <main class="ewt-content">
        <component :is="activeComponent" />
      </main>
    </div>
  </div>
  <div v-else-if="isLoading" class="ewt-loading">
    <div class="ewt-loading-spinner"></div>
    <p>Loading travel product configuration...</p>
    <small class="ewt-loading-hint">This may take a few moments</small>
  </div>
  <div v-else>
    <DataTable />
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
}

.ewt-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.75rem;
  background: var(--ewt-bg);
  border-radius: 8px;
  border: 1px solid var(--ewt-border);
}

.ewt-tabs .ewt-button {
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
}

.ewt-tabs .ewt-button i {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.ewt-button-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.ewt-content {
  background: white;
  border-radius: 8px;
  border: 1px solid var(--ewt-border);
  padding: 1.5rem;
}

.ewt-flex--center {
  align-items: center;
}

.ewt-button-group .ewt-button {
  min-width: 100px;
}
</style>
