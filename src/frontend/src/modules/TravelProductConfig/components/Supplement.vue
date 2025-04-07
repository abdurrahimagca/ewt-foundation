<script setup lang="ts">
import ProductCollectionSelector from "../../../modules/shared/ProductCollectionSelector.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";

const props = defineProps<{
  swData: Entity<"ce_room_supplement_rule">;
}>();
import { useTravelProductConfig } from "../store/useTravelProductConfig";
const store = useTravelProductConfig();
const handleAddToCollection = async (product: any) => {
  try {
    if (!props.swData.supplementProducts?.productOptions) {
      throw new Error("Failed to add product to collection");
    }
    props.swData.supplementProducts.productOptions.add(product);
  } catch (e) {
    console.error("Error adding product to collection:", e);
  }
};
const handleCreateSupplementProductsResource = async () => {
  try {
    const newSupplementProducts = await store.createFreshEntity(
      "ce_product_options_map",
    );
    if (!newSupplementProducts) {
      throw new Error("Failed to create new supplement products");
    }
    props.swData.supplementProducts = newSupplementProducts;
  } catch (e) {
    console.error("Error creating supplement products resource:", e);
  }
};
const handleRemoveFromCollection = async (id: string) => {
  try {
    if (!props.swData.supplementProducts?.productOptions) {
      throw new Error("Failed to remove product from collection");
    }
    if (!props.swData.supplementProducts.productOptions.remove(id)) {
      throw new Error("Failed to remove product from collection");
    }
  } catch (e) {
    console.error("Error removing product from collection:", e);
  }
};
</script>

<template>
  <div v-if="swData" class="">
    <label class="ewt-form-label">Apply if adult count</label>
    <input
      v-model="swData.applyIfAdults"
      type="number"
      class="ewt-input"
      placeholder="Apply if adults"
    />
    <label class="ewt-form-label">Apply if children count</label>
    <input
      v-model="swData.applyIfChildren"
      type="number"
      class="ewt-input"
      placeholder="Apply if children"
    />

    <div v-if="swData.supplementProducts?.productOptions">
      <label class="ewt-form-label">Supplement Products</label>
      <p>These products will add to cart</p>
      <ProductCollectionSelector
        :collection="swData.supplementProducts?.productOptions"
        :min-limit="1"
        :max-limit="5"
        @add-to-collection="handleAddToCollection"
        @remove-from-collection="handleRemoveFromCollection"
      />
    </div>
    <div v-else>
      <button @click="handleCreateSupplementProductsResource">
        <span class="ewt-button ewt-button--primary">
          Initialize Supplement Products Resource
        </span>
      </button>
    </div>
  </div>
</template>
