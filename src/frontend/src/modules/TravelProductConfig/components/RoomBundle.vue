<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import ProductCollectionSelector from "../../shared/ProductCollectionSelector.vue";
import { notification } from "@shopware-ag/meteor-admin-sdk";
import RoomSaleRules from "./RoomSaleRules.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";

const store = useTravelProductConfig();
const swDatas = computed(() => {
  return storeToRefs(store).dataToEdit.value?.hotelBundle?.roomOptions;
});

const addRoomProductCollection = async (room: Entity<"ce_room_bundle">) => {
  const newRoomOption = await store.createFreshEntity("ce_product_options_map");
  if (!newRoomOption) {
    console.error("Failed to create new room option");
    return;
  }
  room.roomProducts = newRoomOption;
};
const addSaleRuleToRoomOption = async (room: Entity<"ce_room_bundle">) => {
  const newRoomSaleRule = await store.createFreshEntity("ce_room_sale_rule");
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
    <h3 class="ewt-heading ewt-heading--h3">Room Option {{ index + 1 }}</h3>
    <div v-if="swData.roomProducts?.productOptions" class="ewt-mb-4">
      <ProductCollectionSelector
        :collection="swData.roomProducts?.productOptions"
        :min-limit="1"
        :max-limit="5"
        :label="`Room Option ${index + 1} Products`"
        @remove-from-collection="
          (id) => {
            try {
              if (!swData.roomProducts?.productOptions?.remove(id)) {
                console.error('Failed to remove product from collection', id);
              }
            } catch (e) {
              notification.dispatch({
                title: 'Error',
                message: 'Failed to remove product from collection',
                appearance: 'system',
                variant: 'error',
              });
            }
          }
        "
        @add-to-collection="
          async (p) => {
            if (!p) {
              console.error('Failed to create new product option');
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
        Initialize Room Products
      </button>
    </div>
    <RoomSaleRules v-if="swData.roomSaleRule" :swData="swData.roomSaleRule" />
    <div v-else class="ewt-button-group">
      <button
        @click="addSaleRuleToRoomOption(swData)"
        class="ewt-button ewt-button--secondary"
      >
        Add Sale Rules
      </button>
    </div>
  </div>
</template>
