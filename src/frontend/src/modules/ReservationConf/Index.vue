<script lang="ts" setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { location } from "@shopware-ag/meteor-admin-sdk";
import { useReservationConf } from "./store/useReservationConf";
import ReservationConfCard from "./components/ReservationConfCard.vue";

const reservationConfStore = useReservationConf();
const { items, isLoading, error, hasItems } = storeToRefs(
  reservationConfStore,
);

const handleSave = (id: string) => {
  reservationConfStore.saveResource(id);
};

const handleDelete = (id: string) => {
  reservationConfStore.deleteResource(id);
};

onMounted(async () => {
  location.startAutoResizer();
  try {
    await reservationConfStore.init();
  } catch (e) {
    console.error(e);
  } finally {
    location.stopAutoResizer();
  }
});
</script>

<template>
  <div class="ewt-container">
    <header class="ewt-header">
      <div class="ewt-flex ewt-flex--between ewt-flex--center">
        <h1 class="ewt-title">
          <i class="fa-solid fa-clipboard-check"></i>
          Reservation Configuration
        </h1>
        <div class="ewt-button-group">
          <button
            class="ewt-button ewt-button--secondary"
            @click="reservationConfStore.searchResource"
            :disabled="isLoading"
          >
            <i class="fa-solid fa-rotate"></i>
            Refresh
          </button>
          <button
            class="ewt-button ewt-button--primary"
            @click="reservationConfStore.createNewResource"
            :disabled="isLoading"
          >
            <i class="fa-solid fa-plus"></i>
            New Configuration
          </button>
        </div>
      </div>
    </header>

    <div v-if="isLoading && hasItems" class="ewt-inline-loading">
      <i class="fa-solid fa-rotate fa-spin"></i>
      <span>Updating configurations…</span>
    </div>

    <div v-if="error" class="ewt-card ewt-card--danger">
      <div class="ewt-flex ewt-flex--center">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span class="ewt-error-text">{{ error }}</span>
      </div>
    </div>

    <div v-if="isLoading && !hasItems" class="ewt-loading">
      <div class="ewt-loading-spinner"></div>
      <p>Loading reservation configurations…</p>
    </div>

    <div v-if="!hasItems && !isLoading" class="ewt-empty-state ewt-card">
      <div
        class="ewt-flex ewt-flex--center"
        style="flex-direction: column; gap: 1rem"
      >
        <i
          class="fa-solid fa-clipboard"
          style="font-size: 3rem; color: var(--ewt-text-secondary)"
        ></i>
        <h3>No configurations found</h3>
        <p class="ewt-text-center">
          Create reservation configurations to define how bookings are handled.
        </p>
        <button
          class="ewt-button ewt-button--primary"
          @click="reservationConfStore.createNewResource"
        >
          <i class="fa-solid fa-plus"></i>
          Create configuration
        </button>
      </div>
    </div>

    <div v-if="hasItems" class="ewt-card-list">
      <ReservationConfCard
        v-for="(config, index) in items"
        :key="config.id"
        :reservation-conf="config"
        :loading="reservationConfStore.isEntityLoading(config.id)"
        :index="index"
        @save="handleSave"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<style scoped>
.ewt-card-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ewt-inline-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ewt-text-secondary);
  margin-bottom: 1rem;
  font-size: 0.95rem;
}
</style>
