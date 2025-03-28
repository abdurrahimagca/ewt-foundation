<script lang="ts" setup>
import { defineProps } from "vue";
import ProductSelection from "../common/ProductSelection.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import RoomRule from "./RoomRules.vue";
import GenericBundle from "./GenericBundle.vue";
import { data } from "@shopware-ag/meteor-admin-sdk";
import { ref } from "vue";

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
    room.roomProductId = product.id;
    room.roomProduct = product as Entity<"product">;
  }
}
async function addRoom(id: string) {
  try {
    const repo = data.repository("product");
    const newData = await repo.create();
    if (newData === null) {
      throw new Error("Could not create new room bundle");
    }
    const room = props.roomBundle.find((room) => room.id === id);
    if (room) {
      room.roomProduct = newData;
    }
  } catch (e) {
    console.error(e);
  }
}
async function addRoomSaleRule(id: string) {
  try {
    const repo = data.repository("ce_room_sale_rule");
    const newRoomSaleRule = await repo.create();
    if (newRoomSaleRule === null) {
      throw new Error("Could not create new room sale rule");
    }
    const room = props.roomBundle.find((room) => room.id === id);
    if (room) {
      room.roomSaleRule = newRoomSaleRule;
    }
  } catch (e) {
    console.error(e);
  }
}
async function addAdditionalProduct(id: string) {
  try {
    const repo = data.repository("ce_generic_bundle");
    const newAdditionalProduct = await repo.create();
    if (newAdditionalProduct === null) {
      throw new Error("Could not create new additional product");
    }
    const room = props.roomBundle.find((room) => room.id === id);
    const newProduct = await data.repository("product").create();
    if (newProduct === null) {
      throw new Error("Could not create new product");
    }
    newAdditionalProduct.parentProduct = newProduct;
    if (room) {
      room.additionalProducts = newAdditionalProduct;
    }
  } catch (e) {
    console.error(e);
  }
}

const tabs = [
  { id: "product", label: "Room Product" },
  { id: "rules", label: "Room Rules" },
  { id: "additional", label: "Additional Products" },
];

const activeTab = ref("product");
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
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="ewt-tab-content">
          <div v-if="activeTab === 'product'" class="ewt-tab-pane">
            <div v-if="!room.roomProduct">
              <div class="ewt-empty-state">
                <p>No room product configured</p>
                <button
                  @click="() => addRoom(room.id)"
                  class="ewt-btn ewt-btn--secondary"
                >
                  Add Room Product
                </button>
              </div>
            </div>
            <div v-else class="ewt-product-selection">
              <ProductSelection
                mode="single"
                :value="room.roomProduct"
                :initialProduct="room.roomProduct"
                @update:initialProduct="
                  (product) => handleOneProductChange(product, room.id)
                "
              />
            </div>
          </div>

          <div v-if="activeTab === 'rules'" class="ewt-tab-pane">
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

          <div v-if="activeTab === 'additional'" class="ewt-tab-pane">
            <div v-if="!room.additionalProducts">
              <div class="ewt-empty-state">
                <p>No additional products configured</p>
                <button
                  @click="() => addAdditionalProduct(room.id)"
                  class="ewt-btn ewt-btn--secondary"
                >
                  Add Additional Products
                </button>
              </div>
            </div>
            <div v-else>
              <GenericBundle :inheritedData="room.additionalProducts" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Remove all styles as they're now in styles.css */
</style>
