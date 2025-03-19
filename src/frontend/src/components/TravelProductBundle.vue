<script lang="ts" setup>
import { data, location } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { onMounted, ref } from "vue";
import ProductSelection from "./common/ProductSelection.vue";

const productId = ref<string | undefined>(undefined);
const error = ref<string | undefined>(undefined);
const isLoading = ref<boolean>(false);
const entityData = ref<Entity<"ce_travel_product_config"> | undefined>(
  undefined,
);

onMounted(async () => {
  try {
    isLoading.value = true;
    const result: any = await data.get({
      id: "sw-product-detail__product",
      selectors: ["id"],
    });
    productId.value = result.id as string;
    const criteria = new data.Classes.Criteria();
    criteria.addFilter(
      data.Classes.Criteria.equals("productId", productId.value),
    );
    const repo = data.repository("ce_travel_product_config");
    const repoSearchResult = await repo.search(criteria);
    if (repoSearchResult === null || repoSearchResult.first() === null) {
      throw new Error("no data found");
    }
    const firstResult = repoSearchResult.first();
    if (firstResult === null) {
      throw new Error("No valid entity data found");
    }
    entityData.value = firstResult;
  } catch (e) {
    error.value = e as string;
  } finally {
    isLoading.value = false;
    location.startAutoResizer();
  }
});
</script>

<template>
  <div>
    <h1>Travel Product Config</h1>
    <p>productId is : {{ productId }}</p>
    <pre> {{ entityData }}</pre>
    <ProductSelection />
  </div>
</template>
