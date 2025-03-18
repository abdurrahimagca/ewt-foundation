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

const orderId = ref<string | undefined>(undefined);
const error = ref<string | undefined>(undefined);
const isLoading = ref<boolean>(false);
const travelOrderInfo = ref<
  EntitySchema.Entities["ce_travel_order_info"][] | null
>(null);

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

    const resultOfEntitySearch = await repo.search(criteria);
    if (resultOfEntitySearch === null) {
      throw new Error("no data found");
    }
    travelOrderInfo.value = resultOfEntitySearch;
    console.log(JSON.stringify(travelOrderInfo.value, null, 2));
  } catch (e) {
    error.value = e as string;
  } finally {
    isLoading.value = false;
    location.startAutoResizer();
  }
});

function isEntityCollection(
  value: any,
): value is EntityCollection<"ce_travel_order_info"> {
  return (
    value && value.entity && value.source && value.context && value.criteria
  );
}

async function upsertUpdatedData() {
  if (!travelOrderInfo.value || !orderId.value || travelOrderInfo.value.length === 0 || error.value) {
    return;
  }

  if (!isEntityCollection(travelOrderInfo.value)) {
    throw new Error("Invalid travel order info data");
  }

  const repo = data.repository("ce_travel_order_info");
  await repo.saveAll(travelOrderInfo.value);
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
        <div class="section">
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
          <FlightCard :flight-info="travelOrderData.flightInfo" />
        </div>

        <!-- Bundle Information -->
        <div class="section" v-if="travelOrderData.bundleInfo">
          <h3>Bundle Information</h3>
          <div v-for="(item, index) in travelOrderData.bundleInfo" :key="index">
            <div v-if="item.rooms">
              <RoomInfo :rooms="item.rooms" />
            </div>
            <div v-if="item.additionalProducts">
              <div class="products-container">
                <AdditionalProductCard
                  v-for="product in item.additionalProducts"
                  :key="product.id"
                  :product="product"
                />
              </div>
            </div>
          </div>
        </div>
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
