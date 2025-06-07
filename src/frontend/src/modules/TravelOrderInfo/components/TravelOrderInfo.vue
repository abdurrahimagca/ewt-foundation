<script lang="ts" setup>
import { useSw } from "@/modules/shared/composables/useSw";
import { data, location } from "@shopware-ag/meteor-admin-sdk";
import { ref, onMounted, watch } from "vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import FlightInfo from "./FlightInfo.vue";
import Travellers from "./Travellers.vue";
import RoomProductInfos from "./RoomProductInfos.vue";
import EmergencyContact from "./EmergencyContact.vue";

const orderId = ref<string | undefined>(undefined);
const orderInfo = ref<Entity<"ce_travel_order_info"> | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const { fetchSwEntity, saveSwEntity } = useSw();

const sections = ref({
  flight: true,
  travellers: true,
  rooms: true,
  emergency: true,
});

const toggleSection = (section: keyof typeof sections.value) => {
  sections.value[section] = !sections.value[section];
};

onMounted(async () => {
  try {
    location.updateHeight(1000);
    isLoading.value = true;
    const result: any = await data.get({
      id: "sw-order-detail-base__order",
      selectors: ["id"],
    });

    if (result && result.id) {
      orderId.value = result.id;
    }
  } catch (e) {
    error.value = "Failed to load order ID";
  } finally {
    isLoading.value = false;
  }
});

watch(orderId, async (newValue) => {
  if (newValue) {
    try {
      isLoading.value = true;
      const criteria = new data.Classes.Criteria();
      criteria.addFilter({
        type: "equals",
        field: "orderId",
        value: newValue,
      });
      criteria.addAssociation("travellers");
      criteria.addAssociation("roomProductDetailedInfo");
      criteria.addAssociation("flightInfo");
      criteria.addAssociation("roomProductDetailedInfo.roomProduct");
      criteria.addAssociation("emergencyContactInfo");
      orderInfo.value = await fetchSwEntity("ce_travel_order_info", criteria);
    } catch (e) {
      error.value = "Failed to load order info";
    } finally {
      isLoading.value = false;
    }
  }
});

const handleSave = async () => {
  if (orderInfo.value) {
    try {
      isLoading.value = true;
      await saveSwEntity("ce_travel_order_info", orderInfo.value);
      error.value = null;
    } catch (e) {
      error.value = "Failed to save order info";
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<template>
  <div class="ewt-container ewt-container--full">
    <div class="ewt-card ewt-card--full">
      <div class="ewt-card-header ewt-flex ewt-flex--between ewt-flex--center">
        <div>
          <h2 class="ewt-card-title">Order Information</h2>
          <div class="ewt-meta-info">Order ID: {{ orderId }}</div>
        </div>
        <div class="ewt-actions">
          <button
            class="ewt-button ewt-button--primary"
            @click="handleSave"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="ewt-loading-spinner"></span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="ewt-loading">Loading...</div>
      <div v-else-if="error" class="ewt-error-text ewt-mb-3">{{ error }}</div>

      <div v-else-if="orderInfo" class="ewt-grid ewt-gap-4">
        <div
          class="ewt-collapsible"
          :class="{ 'ewt-collapsible--expanded': sections.flight }"
        >
          <div class="ewt-collapsible-header" @click="toggleSection('flight')">
            <h3 class="ewt-collapsible-title">Flight Information</h3>
            <span
              class="ewt-collapsible-icon"
              :class="{ expanded: sections.flight }"
              >▼</span
            >
          </div>
          <div
            class="ewt-collapsible-content"
            :class="{ expanded: sections.flight }"
          >
            <FlightInfo
              v-if="orderInfo.flightInfo"
              :flightInfo="orderInfo.flightInfo"
            />
          </div>
        </div>

        <div
          class="ewt-collapsible"
          :class="{ 'ewt-collapsible--expanded': sections.travellers }"
        >
          <div
            class="ewt-collapsible-header"
            @click="toggleSection('travellers')"
          >
            <h3 class="ewt-collapsible-title">Travellers Information</h3>
            <span
              class="ewt-collapsible-icon"
              :class="{ expanded: sections.travellers }"
              >▼</span
            >
          </div>
          <div
            class="ewt-collapsible-content"
            :class="{ expanded: sections.travellers }"
          >
            <Travellers
              v-if="orderInfo.travellers"
              :travellers="orderInfo.travellers"
            />
          </div>
        </div>

        <div
          class="ewt-collapsible"
          :class="{ 'ewt-collapsible--expanded': sections.rooms }"
        >
          <div class="ewt-collapsible-header" @click="toggleSection('rooms')">
            <h3 class="ewt-collapsible-title">Room Information</h3>
            <span
              class="ewt-collapsible-icon"
              :class="{ expanded: sections.rooms }"
              >▼</span
            >
          </div>
          <div
            class="ewt-collapsible-content"
            :class="{ expanded: sections.rooms }"
          >
            <RoomProductInfos
              v-if="orderInfo.roomProductDetailedInfo"
              :roomProductInfos="orderInfo.roomProductDetailedInfo"
            />
          </div>
        </div>

        <div
          class="ewt-collapsible"
          :class="{ 'ewt-collapsible--expanded': sections.emergency }"
        >
          <div
            class="ewt-collapsible-header"
            @click="toggleSection('emergency')"
          >
            <h3 class="ewt-collapsible-title">Emergency Contact Information</h3>
            <span
              class="ewt-collapsible-icon"
              :class="{ expanded: sections.emergency }"
              >▼</span
            >
          </div>
          <div
            class="ewt-collapsible-content"
            :class="{ expanded: sections.emergency }"
          >
            <EmergencyContact
              v-if="orderInfo.emergencyContactInfo"
              :emergencyContact="orderInfo.emergencyContactInfo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ewt-container--full {
  max-width: none;
  padding: 0;
}

.ewt-card--full {
  border-radius: 0;
  margin: 0;
  box-shadow: none;
}

.ewt-gap-4 {
  gap: 1.5rem;
}

.ewt-loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spinner 0.8s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.ewt-collapsible--expanded {
  box-shadow: var(--ewt-card-shadow);
}

.ewt-collapsible-icon {
  font-size: 0.75rem;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--ewt-text-secondary);
}

.ewt-collapsible-icon.expanded {
  transform: rotate(180deg);
}
</style>
