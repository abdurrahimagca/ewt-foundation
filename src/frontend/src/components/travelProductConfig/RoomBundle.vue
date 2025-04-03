<script lang="ts" setup>
import { defineProps, onMounted } from "vue";
import ProductSelection from "../common/ProductSelection.vue";
import RoomRule from "./RoomRules.vue";
import { data } from "@shopware-ag/meteor-admin-sdk";
import { ref } from "vue";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";

const props = defineProps<{
  roomBundle: EntityCollection<"ce_travel_product_config_room_bundle">;
}>();

const roomTabs = ref<{ [key: string]: string }>({}); // Track active tab for each room

// Initialize tabs for each room
onMounted(() => {
  props.roomBundle.forEach((room) => {
    roomTabs.value[room.id] = "product"; // Set default tab
  });
});

function handleTabChange(roomId: string, tabId: string) {
  // Update only the specific room's tab
  roomTabs.value[roomId] = tabId;
}

function handleOneProductChange(
  product: EntityCollection<"product">,
  id: string,
) {
  if (!product) {
    throw new Error("Product is undefined");
  }
  const room = props.roomBundle.find((room) => room.id === id);
  if (room) {
    room.roomProducts = product;
  }
}

async function addRoomSaleRule(id: string) {
  try {
    const repo = data.repository("ce_room_sale_rule");
    const newRoomSaleRule = await repo.create();
    if (newRoomSaleRule === null) {
      throw new Error("Could not create new room sale rule");
    }
    newRoomSaleRule.allowPets = true;
    const room = props.roomBundle.find((room) => room.id === id);
    if (room) {
      room.roomSaleRule = newRoomSaleRule;
    }
  } catch (e) {
    console.error(e);
  }
}

const tabs = [
  { id: "product", label: "Room Product" },
  { id: "rules", label: "Room Rules" },
];
</script>

<template>
  <div class="ewt-section-layout">
    <h4 class="ewt-section-title">Room options</h4>

    <div
      v-for="(room, index) in roomBundle"
      :key="room.id"
      class="ewt-card-detail"
    >
      <div class="ewt-section">
        <div class="ewt-header">
          <h3 class="ewt-title">Room {{ index + 1 }}</h3>
        </div>

        <div class="ewt-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="ewt-tab-button"
            :class="{ active: roomTabs[room.id] === tab.id }"
            @click="handleTabChange(room.id, tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
        <div v-if="roomTabs[room.id] === 'product' && room.roomProducts">
          <div class="ewt-tab-content">
            <ProductSelection
              mode="single"
              :value="room.roomProducts"
              :initialProduct="room.roomProducts"
              @update:initialProduct="handleOneProductChange($event, room.id)"
            />
          </div>
        </div>
      </div>

      <div v-if="roomTabs[room.id] === 'rules'" class="ewt-tab-pane">
        <div v-if="!room.roomSaleRule">
          <div class="ewt-empty-state">
            <p>No room rules configured</p>
            <button
              @click="() => addRoomSaleRule(room.id)"
              class="ewt-btn ewt-btn--secondary"
            >
              Add Room Rules
            </button>
          </div>
        </div>
        <div v-else>
          <RoomRule :rule="room.roomSaleRule" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ewt-card-detail {
  contain: content;
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

/* Alternate subtle background colors for rooms */
.ewt-card-detail:nth-child(3n + 1) {
  background-color: #f8f9ff; /* Very subtle blue tint */
}

.ewt-card-detail:nth-child(3n + 2) {
  background-color: #fff8f5; /* Very subtle orange/peach tint */
}

.ewt-card-detail:nth-child(3n + 3) {
  background-color: #f5fff8; /* Very subtle green tint */
}

.ewt-tab-content {
  position: relative;
  min-height: 300px;
  contain: layout;
  background-color: #ffffff;
  border-radius: 0 0 8px 8px;
  padding: 16px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.02);
}

.ewt-tab-pane {
  position: relative;
}

.ewt-section {
  background-color: inherit;
  border-radius: 8px;
  overflow: hidden;
}

.ewt-header {
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 0.5);
}

.ewt-tabs {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 0 16px;
}
</style>
