<script lang="ts" setup>
import { data, location, notification } from "@shopware-ag/meteor-admin-sdk";
import { onMounted, ref } from "vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import GenericInfoDisplay from "./common/GenericInfoDisplay.vue";
import TravellerCard from "./travelOrderInfo/TravellerCard.vue";
import FlightCard from "./travelOrderInfo/FlightCard.vue";
import BundleInfo from "./travelOrderInfo/BundleInfo.vue";

const orderId = ref<string | undefined>(undefined);
const error = ref<string | undefined>(undefined);
const isLoading = ref<boolean>(false);
const entityData = ref<Entity<"ce_travel_order_info"> | undefined>(undefined);

onMounted(async () => {
  try {
    isLoading.value = true;

    const result: any = await data.get({
      id: "sw-order-detail-base__order",
      selectors: ["id"],
    });

    if (result) {
      orderId.value = result.id as string;
    }

    const repo = data.repository("ce_travel_order_info");
    if (!orderId.value) {
      throw new Error("OrderId Not Found!");
    }

    const criteria = new data.Classes.Criteria();
    criteria.addFilter(data.Classes.Criteria.equals("orderId", orderId.value));
    criteria.addAssociation("travellers");
    criteria.addAssociation("bundleInfo");
    criteria.addAssociation("flightInfo");
    criteria.addAssociation("bundleInfo.rooms");
    criteria.addAssociation("bundleInfo.additionalProducts");

    const repoSearchResult = await repo.search(criteria);
    if (repoSearchResult === null || repoSearchResult.first() === null) {
      throw new Error("no data found");
    }
    const firstResult = repoSearchResult.first();

    if (firstResult !== null) {
      entityData.value = firstResult;
    } else {
      throw new Error("No valid entity data found");
    }
  } catch (e) {
    error.value = e as string;
  } finally {
    isLoading.value = false;
    location.startAutoResizer();
  }
});

async function upsertUpdatedData() {
  try {
    const repo = data.repository("ce_travel_order_info");
    if (!entityData.value) {
      throw new Error("No entity data found");
    }
    await repo.save(entityData.value);
    notification.dispatch({
      title: "Success",
      message: "Data saved successfully",
    });
  } catch (e) {
    error.value = e as string;
  }
}
</script>

<template>
  <div class="travel-order-container">
    <div class="header">
      <h2>Travel Order Info</h2>
    </div>

    <div v-if="isLoading" class="status-message loading">
      <span class="loading-spinner">⌛</span> Loading...
    </div>

    <div v-if="error" class="status-message error">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>

    <div v-if="entityData" class="content">
      <div class="info-card">
        <h3>Identifier Code</h3>
        <p class="identifier-code">{{ entityData.identifierCode }}</p>
      </div>

      <div class="info-card">
        <GenericInfoDisplay :data="entityData.genericInfo" title="Metadata" />
      </div>

      <div class="info-section">
        <h3>Travellers</h3>
        <TravellerCard :traveller="entityData.travellers" />
      </div>

      <div v-if="entityData.flightInfo" class="info-section">
        <h3>Flight Info</h3>
        <FlightCard :flightInfo="entityData.flightInfo" />
      </div>

      <div v-if="entityData.bundleInfo" class="info-section">
        <h3>Bundle Info</h3>
        <BundleInfo :bundleInfo="entityData.bundleInfo" />
      </div>
      <button @click="upsertUpdatedData" class="save-button">
        <span class="save-icon">💾</span>
        Save Changes
      </button>
    </div>
  </div>
</template>

<style scoped>
.travel-order-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  height: auto;
  border-radius: 12px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e1e1e1;
}

h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
}

h3 {
  color: #2c3e50;
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.save-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #4a90e2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.save-button:hover {
  background-color: #357abd;
  transform: translateY(-1px);
}

.save-icon {
  font-size: 1.1rem;
}

.status-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-weight: 500;
}

.loading {
  background-color: #e3f2fd;
  color: #1976d2;
}

.error {
  background-color: #ffebee;
  color: #d32f2f;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #f0f0f0;
}

.info-section {
  background: transparent;
  padding: 24px;
  border-radius: 12px;
}

.identifier-code {
  font-family: monospace;
  font-size: 1.1rem;
  color: #666;
  margin: 8px 0 0 0;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  display: inline-block;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .travel-order-container {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    text-align: center;
  }

  .products-container {
    grid-template-columns: 1fr;
  }
}
</style>
