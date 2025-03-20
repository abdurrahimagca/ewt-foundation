<script lang="ts" setup>
import { data, location } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { onMounted, ref } from "vue";
import HotelBundle from "./travelProductConfig/HotelBundle.vue";
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
      "hotelBundle.roomOptions.roomExtra",
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
        const newAdditionalProducts = await data
          .repository("ce_generic_product_bundle")
          .create();
        if (newAdditionalProducts === null) {
          throw new Error("Could not create new additional products");
        }
        newEntity.additionalProducts = newAdditionalProducts;
        const newHotelBundle = await data
          .repository("ce_hotel_bundle")
          .create();
        if (newHotelBundle === null) {
          throw new Error("Could not create new hotel bundle");
        }
        newEntity.hotelBundle = newHotelBundle;

        try {
         // await repo.save(newEntity);
          entityData.value = newEntity;
        } catch (e) {
          console.error(e);
          error.value = e as string;
        }
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
async function deleteDataFromRepo() {

  
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
  <div class="travel-product-config">
    <div class="header">
      <h1>Travel Product Configuration</h1>
      <div class="actions">
        <button @click="upsertUpdatedData" class="btn btn-primary">
          Save Changes
        </button>
        <button @click="deleteDataFromRepo" class="btn btn-danger">
          Delete Configuration
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      Loading configuration...
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else-if="entityData" class="config-content">
      <div v-if="entityData.hotelBundle">
        <HotelBundle :inheritedData="entityData.hotelBundle" />
      </div>
    </div>
    <pre>{{ entityData }}</pre>
  </div>
</template>

<style scoped>
.travel-product-config {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.header h1 {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin: 0;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background-color: #0066cc;
  color: white;
}

.btn-primary:hover {
  background-color: #0052a3;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-state {
  color: #dc3545;
}

.config-content {
  margin-top: 24px;
}

@media (max-width: 768px) {
  .travel-product-config {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .actions {
    width: 100%;
  }

  .btn {
    flex: 1;
    text-align: center;
  }
}
</style>
