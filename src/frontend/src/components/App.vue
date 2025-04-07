<script setup>
import { ref, onMounted } from "vue";
import { location } from "@shopware-ag/meteor-admin-sdk";
import Location from "./Location.vue";
import TravelOrderInfo from "./TravelOrderInfo.vue";
import ProductView from "./TravelProductBundle.vue";
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
      <div class="ewt-flex ewt-flex--between ewt-flex--center">
        <div class="ewt-header-nav">
          <h3>EWT Foundation</h3>
          <div class="ewt-badge ewt-badge--info">v1.0</div>
        </div>
        <div class="ewt-flex ewt-flex--center">
          <span class="ewt-badge">Admin Dashboard</span>
        </div>
      </div>
    </header>
    <div class="ewt-main-content">
      <Location v-if="showLocation" />
      <TravelOrderInfo v-if="showTravelOrder" />
      <ProductView v-if="showProductView" />
      <Main v-if="showTravelProductConfig" />
    </div>
  </div>
</template>

<style scoped>
.ewt-app-header-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ewt-app-header .ewt-badge {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(8px);
  font-size: 0.85rem;
  padding: 0.35rem 0.75rem;
}

.ewt-main-content {
  flex: 1;
  padding: 1.5rem;
}

.ewt-header-nav .ewt-badge {
  font-size: 0.75rem;
  margin-left: 0.5rem;
}
</style>
