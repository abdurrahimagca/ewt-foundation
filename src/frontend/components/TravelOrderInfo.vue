<script lang="ts" setup>
import { data, location } from "@shopware-ag/meteor-admin-sdk";
import { onMounted, ref } from "vue";
import TravellerCard from "./travelOrderInfo/TravellerCard.vue";
import FlightCard from "./travelOrderInfo/FlightCard.vue";
import RoomInfo from "./travelOrderInfo/RoomInfo.vue";
import GenericInfoDisplay from "./common/GenericInfoDisplay.vue";
import AdditionalProductCard from "./travelOrderInfo/AdditionalProductCard.vue";
import { z } from "zod";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import BundleInfo from "./travelOrderInfo/BundleInfo.vue";
import {
  CeTravelOrderInfo,
  ceTravelOrderInfoSchema,
} from "../../internal/types/ce_travel_order_info";
import { merge } from "lodash";

const orderId = ref<string | undefined>(undefined);
const error = ref<string | undefined>(undefined);
const isLoading = ref<boolean>(false);
const travelOrderInfo = ref<CeTravelOrderInfo[] | undefined>(undefined);
const entity = ref<EntityCollection<"ce_travel_order_info"> | null | undefined>(
  undefined,
);

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

    entity.value = await repo.search(criteria);
    if (entity.value === null) {
      throw new Error("no data found");
    }
    const parseResult = z
      .array(ceTravelOrderInfoSchema)
      .safeParse(entity.value);
    if (!parseResult.success) {
      error.value = JSON.stringify(parseResult.error, null, 2);
      throw new Error("Invalid data");
    }
    //  console.log(JSON.stringify(travelOrderInfo.value, null, 2));
    travelOrderInfo.value = parseResult.data;
  } catch (e) {
    error.value = e as string;
  } finally {
    isLoading.value = false;
    location.startAutoResizer();
  }
});

async function upsertUpdatedData() {
  error.value = "total wasted time here: avg 10";
}
</script>

<template>
  <div class="travel-order-container">
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!orderId" class="no-order">
      <p>No order ID found. Please switch tabs.</p>
    </div>
    <template v-else-if="travelOrderInfo">
      <div v-for="(travelOrderData, index) in travelOrderInfo" :key="index">
        <!-- Header Section -->
        <div class="section">
          <h2>Travel Order Information</h2>
          <p class="identifier">
            TravelOrderCode: {{ travelOrderData.identifierCode }}
          </p>
        </div>

        <!-- Generic Info Section -->
        <div v-if="travelOrderData.genericInfo" class="section">
          <h2>Generic Information</h2>
          <GenericInfoDisplay :data="travelOrderData.genericInfo" />
        </div>

        <!-- Travellers Section -->
        <div class="section">
          <h3>Travellers</h3>
          <TravellerCard
            :key="travelOrderData.id"
            :traveller="travelOrderData.travellers"
          />
        </div>

        <!-- Flight Information -->
        <div class="section" v-if="travelOrderData.flightInfo">
          <h3>Flight Details</h3>
          <FlightCard
            :flight-info="travelOrderData.flightInfo"
            @update="
              (updatedFlightInfo) =>
                (travelOrderData.flightInfo = updatedFlightInfo)
            "
          />
        </div>

        <!-- Bundle Information -->
        <div class="section" v-if="travelOrderData.bundleInfo">
          <h3>Bundle Information</h3>
          <BundleInfo :bundleInfo="travelOrderData.bundleInfo" />
        </div>

        <!-- Save Button -->
        <button @click="upsertUpdatedData">Save Changes</button>
      </div>
    </template>
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
</style>
