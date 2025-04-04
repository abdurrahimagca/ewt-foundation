<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { data, location } from "@shopware-ag/meteor-admin-sdk";
import HotelBundle from "./travelProductConfig/HotelBundle.vue";
import ChildDiscount from "./travelProductConfig/ChildDiscount.vue";
import { useTravelProductConfig } from "../composables/useTravelProductBundle";
import { useTravelProductConfigStore } from "../store/useTravelProductBundleStore";
import GenericBundle from "./travelProductConfig/GenericBundle.vue";

const activeTab = ref("hotel");

const tabs = [
  { id: "hotel", label: "Hotel Bundle" },
  { id: "generic", label: "Generic Bundles" },
  { id: "child", label: "Child Discount" },
];

const store = useTravelProductConfigStore();

onMounted(async () => {
  ///** store */
  const postResult: any = await data.get({
    id: "sw-product-detail__product",
    selectors: ["id"],
  });
  if (!postResult.id) {
    throw new Error("no id found");
  }

  store.productId = postResult.id;
  const postExisting = await store.fetchData(postResult.id);
  if (!postExisting) {
    await store.createData(store.productId ?? "");
  }

  //*end of store*/

  location.startAutoResizer();
});

function handleTabChange(tabId: string) {
  const currentScrollPosition = window.scrollY;
  activeTab.value = tabId;
  setTimeout(() => {
    window.scrollTo({ top: currentScrollPosition, behavior: "instant" });
  }, 0);
}
</script>

<template>
  <div class="ewt-container">
    <div class="ewt-app-header">
      <h3>Travel Product Configuration</h3>
    </div>

    <div class="ewt-flex top-bar">
      <div class="ewt-button-group primary-actions">
        <button @click="store.refreshState" class="ewt-btn ewt-btn--primary">
          Save Changes
        </button>
        <button
          @click="store.deleteDataFromRepo"
          class="ewt-btn ewt-btn--danger"
        >
          Delete Configuration
        </button>
      </div>
    </div>

    <div v-if="store.isLoading" class="ewt-loading">
      Loading configuration...
    </div>

    <div v-else-if="store.error" class="ewt-error">
      {{ store.error }}
    </div>

    <div v-else-if="store.entityData" class="ewt-section">
      <div class="ewt-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="ewt-tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="handleTabChange(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="ewt-tab-content">
        <div v-if="activeTab === 'hotel'" class="ewt-tab-pane">
          <!--   <div v-if="entityData.hotelBundle">
           <HotelBundle
              @update:data="upsertUpdatedData"
              :inheritedData="entityData.hotelBundle"
            />
          </div>
          <div v-else class="ewt-empty-state">
            <p>No hotel bundle configured</p>
            <button @click="addHotelBundle" class="ewt-btn ewt-btn--secondary">
              Add Hotel Bundle
            </button>
          </div> -->
          uh oh wait bu i got
          {{ JSON.stringify(store.entityData.hotelBundle) }}
        </div>

        <div v-if="activeTab === 'generic'" class="ewt-tab-pane">
          <GenericBundle />

          <button
            @click="store.addGenericBundleProduct"
            class="ewt-btn ewt-btn--secondary"
          >
            Add Generic Bundle
          </button>
        </div>

        <div v-if="activeTab === 'child'" class="ewt-tab-pane">
          <!--  <div v-if="entityData.childDiscount">
            <ChildDiscount
              @update:data="upsertUpdatedData"
              :inheritedData="entityData.childDiscount"
            />
          </div>
          <div v-else class="ewt-empty-state">
            <p>No child discount configured</p>
            <button
              @click="addChildDiscount"
              class="ewt-btn ewt-btn--secondary"
            >
              Add Child Discount
            </button>
         
          </div>
           -->
        </div>
      </div>
    </div>

    <pre>{{ store.entityData }}</pre>
  </div>
</template>

<style scoped>
.top-bar {
  justify-content: space-between;
  margin: 20px 0;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  gap: 16px;
}

.ewt-button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.primary-actions {
  flex-shrink: 0;
}

.icon {
  margin-right: 6px;
}

.ewt-tabs {
  display: flex;
  gap: 4px;
  padding: 0 4px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.ewt-tab-button {
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ewt-tab-button:hover {
  color: #4f46e5;
}

.ewt-tab-button.active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
}

.tab-icon {
  font-size: 16px;
}

.ewt-tab-content {
  position: relative;
  min-height: 300px;
  overflow: visible;
}

.ewt-tab-pane {
  position: relative;
}

.ewt-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* Make the debug output collapsible and styled */
pre {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: auto;
  margin-top: 24px;
  font-size: 12px;
  color: #374151;
}
</style>
