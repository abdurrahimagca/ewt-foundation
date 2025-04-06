<script lang="ts" setup>
import HotelBundle from "./tabs/HotelBundle.vue";
import Home from "./tabs/Home.vue";
import GenericBundle from "./tabs/GenericBundle.vue";
import { ref, computed } from "vue";

import { useTravelProductConfig } from "./store/useTravelProductConfig";
import { storeToRefs } from "pinia";
import DataTable from "./components/DataTable.vue";
const store = useTravelProductConfig();
const isEditMode = storeToRefs(store).isEditing;
const isLoading = storeToRefs(store).isLoading;
const tabs = [
  {
    name: "home",
    component: Home,
    label: "Home",
    icon: "mdi-home",
  },
  {
    name: "hotelBundle",
    component: HotelBundle,
    label: "Hotel Bundle",
    icon: "mdi-hotel",
  },
  {
    name: "genericBundle",
    component: GenericBundle,
    label: "Generic Bundle",
    icon: "mdi-package-variant-closed",
  },
];

const currentTab = ref("home");

const activeComponent = computed(
  () => tabs.find((tab) => tab.name === currentTab.value)?.component,
);

const switchTab = (tabName: string) => {
  currentTab.value = tabName;
};
</script>

<template>
  <div v-if="isEditMode">
    <div class="ewt-container">
      <header class="ewt-header">
        <h1 class="ewt-title">Travel Product Config</h1>
        <p class="ewt-txt">
          Configure your travel products with our easy-to-use interface
        </p>
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
        <button
          class="ewt-button ewt-button--primary"
          @click="store.upsertResource"
        >
          <i class="fas fa-plus"></i> Save
        </button>
      </main>
    </div>
  </div>
  <div v-else-if="isLoading">
    <div class="ewt-loading">
      <p>Loading...</p>
    </div>
  </div>
  <div v-else>
    <DataTable />
  </div>
  <pre>
    <code>
      {{ JSON.stringify(store.dataToEdit, null, 2) }}
    </code>
  </pre>
</template>
