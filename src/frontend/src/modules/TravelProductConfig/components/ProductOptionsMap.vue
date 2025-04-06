<script setup lang="ts">
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import ProductCollectionSelector from "../../../modules/shared/ProductCollectionSelector.vue";
import { notification } from "@shopware-ag/meteor-admin-sdk";
const props = defineProps<{
  swData: Entity<"ce_product_options_map">;
  label: string;
  maxLimit: number;
  minLimit: number;
}>();

const handleAddToCollection = async (productOption: Entity<"product">) => {
  try {
    if (!props.swData.productOptions) {
      throw new Error("Product option is not defined");
    }
    props.swData.productOptions.add(productOption);
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "Failed to add product to collection",
      appearance: "notification",
      variant: "error",
    });
  }
};

const handleRemoveFromCollection = async (id: string) => {
  try {
    if (!props.swData.productOptions) {
      throw new Error("Product option is not defined");
    }
    props.swData.productOptions.remove(id);
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "Failed to remove product from collection",
      appearance: "notification",
      variant: "error",
    });
  }
};
</script>
<template>
  <div>
    <label class="sw-field__label">{{ label }}</label>
    <div v-if="props.swData?.productOptions">
      <ProductCollectionSelector
        :minLimit="minLimit"
        :maxLimit="maxLimit"
        :collection="props.swData.productOptions"
        @addToCollection="handleAddToCollection"
        @removeFromCollection="handleRemoveFromCollection"
      />
    </div>
  </div>
</template>
