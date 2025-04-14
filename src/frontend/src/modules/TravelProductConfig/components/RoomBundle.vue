<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import { notification } from "@shopware-ag/meteor-admin-sdk";
import RoomSaleRules from "./RoomSaleRules.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { useSw } from "@/modules/shared/composables/useSw";
import ProductCollectionSelector from "@/modules/shared/components/ProductCollectionSelector.vue";
const { createSwEntity } = useSw();
const store = useTravelProductConfig();
const swDatas = computed(() => {
  return storeToRefs(store).dataToEdit.value?.hotelBundle?.roomOptions;
});
const handleDeleteResource = async (id: string) => {
  try {
    if (!swDatas.value?.remove(id)) {
      throw new Error("Failed to remove room option");
    }
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
    class="ewt-card ewt-card--secondary ewt-mb-4"
  >
    <div class="ewt-card-header">
      <h2 class="ewt-card-title">Room Option {{ index + 1 }}</h2>
      <button
        @click="handleDeleteResource(swData.id)"
        class="ewt-button ewt-button--danger"
      >
        <i class="fa-solid fa-trash"></i>
        Delete Room Option
      </button>
    </div>

    <div v-if="swData.roomProducts" class="ewt-mb-4">
      <ProductCollectionSelector
        v-model="swData.roomProducts"
        :maxLimit="Infinity"
        :minLimit="0"
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
</template>

<style scoped>
.ewt-button i {
  margin-right: 0.5rem;
}
</style>
