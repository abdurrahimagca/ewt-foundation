<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import ProductSelection from "../common/ProductSelection.vue";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { watch } from "vue";
import NewGenericBundleNode from "./NewGenericBundleNode.vue";

const props = defineProps<{
  inheritedData: EntityCollection<"ce_generic_bundle">;
}>();

async function handleParentProductChange(
  id: string,
  products: EntityCollection<"product"> | Entity<"product">,
) {
  try {
    if (!(products instanceof EntityCollection)) {
      throw new Error("Product must be an EntityCollection");
    }
    if (!props.inheritedData) {
      throw new Error("Inherited data is undefined");
    }
    const opt = props.inheritedData.find((bundle) => bundle.id === id);
    if (!opt) {
      throw new Error("Product not found");
    }
    opt.parentProducts = products;
    //await data.repository("ce_generic_bundle").save(opt);
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "An error occurred while updating the parent product.",
      variant: "error",
    });
    console.error("Error on saving bundle product:", e);
  }
}
async function handleBundleProductChange(
  id: string,
  products: EntityCollection<"product"> | Entity<"product">,
) {
  try {
    if (!(products instanceof EntityCollection)) {
      throw new Error("Product must be an EntityCollection");
    }
    if (!props.inheritedData) {
      throw new Error("Inherited data is undefined");
    }
    const opt = props.inheritedData.find((bundle) => bundle.id === id);
    if (!opt) {
      throw new Error("Product not found");
    }
    opt.productOptions = products;
    //await data.repository("ce_generic_bundle").save(opt);
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "An error occurred while updating the parent product.",
      variant: "error",
    });
    console.error("Error on saving bundle product:", e);
  }
}
</script>

<template>
  <div v-if="inheritedData && inheritedData !== null" class="ewt-card-detail">
    <div v-for="bundle in inheritedData" :key="bundle.id">
      <div v-if="bundle.isNew()">this is new</div>

      {{ bundle.id }}
      {{ bundle.__identifier__() }}
      <NewGenericBundleNode :inheritedData="bundle" />
    </div>
  </div>
</template>

<style scoped>
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
}

.ewt-grid-2 {
  max-width: 800px;
}
</style>
