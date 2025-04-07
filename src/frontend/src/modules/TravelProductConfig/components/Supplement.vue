<script setup lang="ts">
import ProductCollectionSelector from "../../shared/components/ProductCollectionSelector.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { useSw } from "@/modules/shared/composables/useSw";
const {createSwEntity } = useSw();
const props = defineProps<{
  id: string;
}>();
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { notification } from "@shopware-ag/meteor-admin-sdk";
const store = useTravelProductConfig();
const swData = computed(() => {
  return storeToRefs(store).dataToEdit.value?.hotelBundle?.roomOptions?.get(
    props.id,
  )?.roomSaleRule?.supplementRule;
});
const handleAddToCollection = async (product: Entity<"product">) => {
  try {
    if (!swData.value || !swData.value.supplementProducts?.productOptions) {
      throw new Error("Failed to add product to collection");
    }
    swData.value.supplementProducts.productOptions.add(product);
  } catch (e) {
    console.error("Error adding product to collection:", e);
  }
};
const handleCreateSupplementProductsResource = async () => {
  try {
    if(!swData.value) throw new Error("Could not create new resource")
    const newSupplementProducts = await createSwEntity("ce_product_options_map");
    if (!newSupplementProducts) {
      throw new Error("Failed to create new supplement products");
    }
    swData.value.supplementProducts = newSupplementProducts;
  } catch (e) {
    console.error("Error creating supplement products resource:", e);
    notification.dispatch({
      "title":"Error",
      "message": "Could not create resoruce"
    })
  }
};
const handleRemoveFromCollection = async (id: string) => {
  try {
    if (!swData.value || !swData.value.supplementProducts?.productOptions) {
      throw new Error("Failed to remove product from collection");
    }
    if (!swData.value.supplementProducts.productOptions.remove(id)) {
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
