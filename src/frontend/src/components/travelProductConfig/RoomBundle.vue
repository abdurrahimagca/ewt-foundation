<script lang="ts" setup>
import { defineProps } from "vue";
import ProductSelection from "../common/ProductSelection.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import RoomRule from "./RoomRules.vue";
import GenericBundleProduct from "./GenericBundleProduct.vue";
const props = defineProps<{
  roomBundle: EntitySchema.Entities["ce_travel_product_config_room_bundle"][];
}>();
/*
  interface ce_travel_product_config_room_bundle {
    id: string;
    roomProduct: Entity<"product">;
    roomExtra: EntityCollection<"product">;
    additionalProducts: Entity<"ce_generic_product_bundle">;
    roomSaleRule: Entity<"ce_room_sale_rule">;
  }*/

function handleOneProductChange(
  product:
    | EntitySchema.Entities["product"][]
    | EntitySchema.Entities["product"],
  id: string,
) {
  if (product instanceof Array) {
    throw new Error("Product must be a single product");
  }

  const room = props.roomBundle.find((room) => room.id === id);
  if (room) {
    room.roomProduct = product as Entity<"product">;
  }
}
</script>

<template>
  <div>
    <h4>Room options</h4>
    <div v-if="roomBundle">
      <div v-for="room in roomBundle" :key="room.id">
        <ProductSelection
          mode="single"
          :value="room.roomProduct"
          :initialProduct="[room.roomProduct]"
          @update:initialProduct="handleOneProductChange($event, room.id)"
        />
        <h4>Additional Products</h4>
        <GenericBundleProduct :inheritedData="room.additionalProducts" />
        <h4>Room Sale Rule</h4>
        <RoomRule :rule="room.roomSaleRule" />
      </div>
    </div>
  </div>
</template>
