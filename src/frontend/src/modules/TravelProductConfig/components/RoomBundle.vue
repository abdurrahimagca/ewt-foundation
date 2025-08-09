<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed, ref } from "vue";
import { notification } from "@shopware-ag/meteor-admin-sdk";
import RoomSaleRules from "./RoomSaleRules.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { useSw } from "@/modules/shared/composables/useSw";
import ProductSelector from "@/modules/shared/components/ProductSelector.vue";

const { createSwEntity, deleteSwEntity } = useSw();
const store = useTravelProductConfig();
const swDatas = computed(() => {
  return storeToRefs(store).dataToEdit.value?.hotelBundle?.roomOptions;
});

const expandedRooms = ref<Set<string>>(new Set());

const toggleExpand = (id: string) => {
  if (expandedRooms.value.has(id)) {
    expandedRooms.value.delete(id);
  } else {
    expandedRooms.value.add(id);
  }
};

const handleDeleteResource = async (id: string) => {
  try {
    await deleteSwEntity("ce_room_bundle", id);
    swDatas?.value?.remove(id);
  } catch (e) {
    console.error("Error removing room option:", e);
    notification.dispatch({
      title: "error",
      message: "Failed to remove room option",
    });
  }
};

const addSaleRuleToRoomOption = async (room: Entity<"ce_room_bundle">) => {
  const newRoomSaleRule = await createSwEntity("ce_room_sale_rule");
  if (!newRoomSaleRule) {
    console.error("Failed to create new room sale rule");
    return;
  }
  room.roomSaleRule = newRoomSaleRule;
};
</script>

<template>
  <div
    v-for="(swData, index) in swDatas"
    :key="swData.id"
    class="room-bundle-container"
  >
    <div
      class="room-bundle-header ewt-flex ewt-flex--between"
      @click="toggleExpand(swData.id)"
    >
      <div class="ewt-flex ewt-flex--center">
        <i
          :class="[
            'fa-solid',
            expandedRooms.has(swData.id)
              ? 'fa-chevron-down'
              : 'fa-chevron-right',
          ]"
        ></i>
        <h4 class="ewt-card-title">Room Option {{ index + 1 }}</h4>
      </div>
      <button
        @click.stop="handleDeleteResource(swData.id)"
        class="ewt-button ewt-button--danger"
      >
        <i class="fa-solid fa-trash"></i>
        Delete Room Option
      </button>
    </div>

    <div v-show="expandedRooms.has(swData.id)" class="room-bundle-content">
      <div class="ewt-card ewt-mb-3">
        <label class="ewt-form-label">Room Product</label>
        <ProductSelector
          v-model="swData.roomProduct"
          @update:modelValue="
            (s) => {
              if (s && swData) {
                swData.roomProduct = s;
                swData.roomProductId = s.id;
              }
            }
          "
        />
        <label class="ewt-form-label">Additional Pre Night Product</label>
        <ProductSelector
          v-model="swData.additionalPreNightProduct"
          @update:modelValue="
            (s) => {
              if (s && swData) {
                swData.additionalPreNightProduct = s;
                swData.additionalPreNightProductId = s.id;
              }
            }
          "
        />
        <label class="ewt-form-label">Additional Post Night Product</label>
        <ProductSelector
          v-model="swData.additionalPostNightProduct"
          @update:modelValue="
            (s) => {
              if (s && swData) {
                swData.additionalPostNightProduct = s;
                swData.additionalPostNightProductId = s.id;
              }
            }
          "
        />
      </div>

      <RoomSaleRules v-if="swData.roomSaleRule" :id="swData.id" />

      <div v-else class="ewt-button-group">
        <button
          @click="addSaleRuleToRoomOption(swData)"
          class="ewt-button ewt-button--secondary"
        >
          <i class="fa-solid fa-plus"></i>
          Add Sale Rules
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-bundle-container {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.room-bundle-header {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: none;
  border-radius: 8px;
}

.room-bundle-header:hover {
}

.room-bundle-header i {
  margin-right: 1rem;
  font-size: 1.2rem;
  color: var(--ewt-text-secondary);
  transition: none;
}

.room-bundle-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  animation: none;
}

/* animations removed by request */

.ewt-button i {
  margin-right: 0.5rem;
}

.ewt-button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.ewt-flex--center {
  align-items: center;
}
</style>
