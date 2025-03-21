<script setup>
import { ref, onMounted } from "vue";
import { location } from "@shopware-ag/meteor-admin-sdk";
import Location from "./Location.vue";
import TravelOrderInfo from "./TravelOrderInfo.vue";
import ProductView from "./TravelProductBundle.vue";
const showTravelOrder = ref(false);
const showLocation = ref(false);
const showProductView = ref(false);

onMounted(() => {
  showTravelOrder.value = location.is("ce-traveller-view-tab-card");
  showLocation.value = location.is(location.MAIN_HIDDEN);
  showProductView.value = location.is("ce-product-view-tab-card");

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
  </div>
</template>
