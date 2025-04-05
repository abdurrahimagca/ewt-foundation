<script setup>
import { ref, onMounted } from "vue";
import { location } from "@shopware-ag/meteor-admin-sdk";
import Location from "./Location.vue";
import TravelOrderInfo from "./TravelOrderInfo.vue";
import ProductView from "./TravelProductBundle.vue";
import TravelProductConfigMain from "./newTravelProductConfig/TravelProductConfigMain.vue";
const showTravelOrder = ref(false);
const showLocation = ref(false);
const showProductView = ref(false);
const showTravelProductConfig = ref(false);
import Main from "../modules/TravelProductConfig/Main.vue";

onMounted(() => {
  showTravelOrder.value = location.is("ce-traveller-view-tab-card");
  showLocation.value = location.is(location.MAIN_HIDDEN);
  showProductView.value = location.is("ce-product-view-tab-card");
  showTravelProductConfig.value = location.is("ewtf-travel-product-config");
  if (showLocation.value) {
    location.startAutoResizer();
  }
});
</script>

<template>
  <div class="ewt-app-container">
    <header class="ewt-app-header">
      <h3>EWT Foundation App</h3>
    </header>
    <Location v-if="showLocation" />
    <TravelOrderInfo v-if="showTravelOrder" />
    <ProductView v-if="showProductView" />
    <Main v-if="showTravelProductConfig" />
  </div>
</template>
