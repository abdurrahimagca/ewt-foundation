<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import ProductCollectionSelector from "../../shared/components/ProductCollectionSelector.vue";
import { notification } from "@shopware-ag/meteor-admin-sdk";
import RoomSaleRules from "./RoomSaleRules.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { useSw } from "@/modules/shared/composables/useSw";
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
const addRoomProductCollection = async (room: Entity<"ce_room_bundle">) => {
  const newRoomOption = await createSwEntity("ce_product_options_map");
  if (!newRoomOption) {
    console.error("Failed to create new room option");
    return;
  }
  room.roomProducts = newRoomOption;
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

    <div v-if="swData.roomProducts?.productOptions" class="ewt-mb-4">
      <ProductCollectionSelector
        :collection="swData.roomProducts?.productOptions"
        :min-limit="1"
        :max-limit="5"
        :label="`Room ${index + 1} Products`"
        @remove-from-collection="
          (id) => {
            try {
              if (!swData.roomProducts?.productOptions?.remove(id)) {
                notification.dispatch({
                  title: 'Error',
                  message: 'Could not remove product from collection',
                  appearance: 'notification',
                });
              }
            } catch (e) {
              notification.dispatch({
                title: 'Error',
                message: 'Failed to remove product from collection',
                appearance: 'notification',
              });
            }
          }
        "
        @add-to-collection="
          async (p) => {
            if (!p) {
              notification.dispatch({
                title: 'Error',
                message: 'Invalid product data',
                appearance: 'notification',
              });
              return;
            }
            if (swData.roomProducts?.productOptions) {
              swData.roomProducts.productOptions.add(p);
            }
          }
        "
      />
    </div>

    <div v-if="!swData.roomProducts" class="ewt-button-group ewt-mb-4">
      <button
        @click="addRoomProductCollection(swData)"
        class="ewt-button ewt-button--secondary"
      >
        <i class="fa-solid fa-plus"></i>
        Initialize Room Products
      </button>
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
