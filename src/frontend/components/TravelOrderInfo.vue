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
    <h2>Travel Order Info</h2>
    <button @click="upsertUpdatedData" class="save-button">Save Changes</button>
  </div>
  <div v-if="isLoading" class="loading">Loading...</div>
  <div v-if="error" class="error">{{ error }}</div>
  <div v-if="entityData" class="section">
    <h3>Identifier Code:</h3>
    <p>{{ entityData.identifierCode }}</p>
    <GenericInfoDisplay :data="entityData.genericInfo" title="Metadata" />
    <h3>Travellers</h3>
    <TravellerCard :traveller="entityData.travellers" />
    <div v-if="entityData.flightInfo">
      <h3>Flight Info</h3>
      <FlightCard :flightInfo="entityData.flightInfo" />
    </div>
    <div v-if="entityData.bundleInfo">
      <h3>Bundle Info</h3>
      <BundleInfo :bundleInfo="entityData.bundleInfo" />
    </div>
  </div>
</template>

<style scoped>
.travel-order-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section {
  margin-bottom: 24px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 16px;
}

h3 {
  color: #2c3e50;
  margin-bottom: 16px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.error {
  color: #dc3545;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  text-align: center;
}

.no-order {
  text-align: center;
  padding: 20px;
}

.identifier {
  color: #6c757d;
  font-size: 0.9em;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .products-container {
    grid-template-columns: 1fr;
  }
}

.save-button {
  background-color: #189eff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 16px;
}

.save-button:hover {
  background-color: #0080ff;
}
</style>
