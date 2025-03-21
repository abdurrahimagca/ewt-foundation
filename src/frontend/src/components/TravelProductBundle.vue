<script lang="ts" setup>
import { data, location } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { onMounted, ref } from "vue";
import HotelBundle from "./travelProductConfig/HotelBundle.vue";
import GenericBundleProduct from "./travelProductConfig/GenericBundleProduct.vue";
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
    const associations = [
      "hotelBundle",
      "additionalProducts",
      "childDiscount",
      "hotelBundle.roomOptions",
      "hotelBundle.additionalProducts",
      "hotelBundle.roomOptions.roomProduct",
      "hotelBundle.roomOptions.additionalProducts",
      "hotelBundle.roomOptions.roomSaleRule",
      "hotelBundle.roomOptions.roomSaleRule.supplementRule",
      "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProduct",
    ];
    associations.forEach((association) => {
      criteria.addAssociation(association);
    });
    criteria.addFilter(
      data.Classes.Criteria.equals("productId", productId.value),
    );
    const repo = data.repository("ce_travel_product_config");
    const repoSearchResult = await repo.search(criteria);

    const firstResult = repoSearchResult?.first();

    if (firstResult === null) {
      (async () => {
        const newEntity = await repo.create();
        if (newEntity === null) {
          throw new Error("Could not create new entity");
        }
        newEntity.productId = productId.value;
        entityData.value = newEntity;
      })();
    } else {
      entityData.value = firstResult;
    }
  } catch (e) {
    console.error(e);
    error.value = e as string;
  } finally {
    isLoading.value = false;
    location.startAutoResizer();
  }
});
async function addHotelBundle() {
  try {
    const repo = data.repository("ce_hotel_bundle");
    const newHotelBundle = await repo.create();
    if (newHotelBundle === null || !entityData.value) {
      throw new Error("Could not create new hotel bundle");
    }
    entityData.value.hotelBundle = newHotelBundle;
  } catch (e) {
    console.error(e);
    error.value = e as string;
  }
}
async function addGenericBundleProduct() {
  try {
    const repo = data.repository("ce_generic_product_bundle");
    const newGenericBundleProduct = await repo.create();
    if (newGenericBundleProduct === null || !entityData.value) {
      throw new Error("Could not create new generic bundle product");
    }
    entityData.value.additionalProducts = newGenericBundleProduct;
  } catch (e) {
    console.error(e);
    error.value = e as string;
  }
}
async function deleteDataFromRepo() {
  try {
    const repo = data.repository("ce_travel_product_config");
    if (!entityData.value) {
      throw new Error("No entity data found");
    }
    await repo.delete(entityData.value.id);
    entityData.value = undefined;
  } catch (e) {
    console.error(e);
    error.value = e as string;
  }
}

async function upsertUpdatedData() {
  try {
    const repo = data.repository("ce_travel_product_config");
    if (!entityData.value) {
      throw new Error("No entity data found");
    }
    await repo.save(entityData.value);
  } catch (e) {
    console.error(e);
    error.value = e as string;
  }
}
</script>

<template>
  <div class="ewt-container">
    <div class="ewt-app-header">
      <h3>Travel Product Configuration</h3>
    </div>

    <div class="ewt-flex top-bar">
      <button @click="upsertUpdatedData" class="ewt-btn ewt-btn--primary">
        Save Changes
      </button>
      <button @click="deleteDataFromRepo" class="ewt-btn ewt-btn--danger">
        Delete Configuration
      </button>
      <button @click="addHotelBundle" class="ewt-btn ewt-btn--primary">
        Add Hotel Bundle
      </button>
      <button @click="addGenericBundleProduct" class="ewt-btn ewt-btn--primary">
        Add Generic Bundle Product
      </button>
    </div>

    <div v-if="isLoading" class="ewt-loading">Loading configuration...</div>

    <div v-else-if="error" class="ewt-error">
      {{ error }}
    </div>

    <div v-else-if="entityData" class="ewt-section">
      <section>
        <h3 class="ewt-section-title">Hotel Bundle Config</h3>
        <div v-if="entityData.hotelBundle">
          <HotelBundle :inheritedData="entityData.hotelBundle" />
        </div>
        <div v-if="entityData.additionalProducts">
          <GenericBundleProduct
            :inheritedData="entityData.additionalProducts"
          />
        </div>
      </section>
    </div>
    <pre>{{ entityData }}</pre>
  </div>
</template>

<style scoped>
.top-bar {
  justify-content: space-between;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid grey;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}
</style>
