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
  <div class="ewt-container">
    <div class="ewt-app-header">
      <h3>Travel Order Info</h3>
    </div>

    <div v-if="isLoading" class="ewt-loading">
      <span class="ewt-icon">⌛</span> Loading...
    </div>

    <div v-if="error" class="ewt-error">
      <span class="ewt-icon">⚠️</span>
      {{ error }}
    </div>

    <div v-if="entityData" class="ewt-section-layout">
      <div class="ewt-card-detail">
        <h3 class="ewt-section-title">Identifier Code</h3>
        <p class="ewt-detail-value ewt-input-right">
          {{ entityData.identifierCode }}
        </p>
      </div>

      <div class="ewt-card-detail">
        <GenericInfoDisplay :data="entityData.genericInfo" title="Metadata" />
      </div>

      <div class="ewt-section">
        <h3 class="ewt-section-title">Travellers</h3>
        <TravellerCard :traveller="entityData.travellers" />
      </div>

      <div v-if="entityData.flightInfo" class="ewt-section">
        <h3 class="ewt-section-title">Flight Info</h3>
        <FlightCard :flightInfo="entityData.flightInfo" />
      </div>

      <div v-if="entityData.bundleInfo" class="ewt-section">
        <h3 class="ewt-section-title">Bundle Info</h3>
        <BundleInfo :bundleInfo="entityData.bundleInfo" />
      </div>

      <button @click="upsertUpdatedData" class="ewt-btn ewt-btn--primary">
        <span class="ewt-icon">💾</span>
        Save Changes
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Remove all scoped styles since we're now using shared styles.css */
</style>
