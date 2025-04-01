<script lang="ts" setup>
import { data, location, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { onMounted, ref } from "vue";
import HotelBundle from "./travelProductConfig/HotelBundle.vue";
import GenericBundle from "./travelProductConfig/GenericBundle.vue";
import ChildDiscount from "./travelProductConfig/ChildDiscount.vue";

const productId = ref<string | undefined>(undefined);
const error = ref<string | undefined>(undefined);
const isLoading = ref<boolean>(false);
const entityData = ref<Entity<"ce_travel_product_config"> | undefined>(
  undefined,
);

const activeTab = ref("hotel");

const tabs = [
  { id: "hotel", label: "Hotel Bundle" },
  { id: "generic", label: "Additional Products" },
  { id: "child", label: "Child Discount" },
];

onMounted(async () => {
  try {
    isLoading.value = true;
    const result: any = await data.get({
      id: "sw-product-detail__product",
      selectors: ["id"],
    });
    productId.value = result.id as string;
    const searchResult = await fetchData(productId.value as string);
    if (searchResult === null) {
      const newData = await createData(productId.value as string);
      if (!newData) {
        throw new Error("Could not create new entity data");
      }
      entityData.value = newData;
    } else {
      entityData.value = searchResult;
    }
  } catch (e) {
    console.error(e);
    error.value = e as string;
  } finally {
    isLoading.value = false;
    location.startAutoResizer();
  }
});

async function addChildDiscount() {
  try {
    const repo = data.repository("ce_custom_child_discount");
    const newChildDiscount = await repo.create();

    if (newChildDiscount === null || !entityData.value) {
      throw new Error("Could not create new child discount");
    }
    newChildDiscount.infantDiscountPercentage = 100;
    newChildDiscount.childDiscountPercentage = 50;
    await repo.save(newChildDiscount);
    entityData.value.childDiscount = newChildDiscount;
    upsertUpdatedData();
  } catch (e) {
    console.error(e);
    error.value = e as string;
  }
}

async function addHotelBundle() {
  try {
    const repo = data.repository("ce_hotel_bundle");
    const newHotelBundle = await repo.create();
    if (newHotelBundle === null || !entityData.value) {
      throw new Error("Could not create new hotel bundle");
    }
    await repo.save(newHotelBundle);
    newHotelBundle.minRoomSelection = 1;
    newHotelBundle.maxRoomSelection = 1;
    entityData.value.hotelBundle = newHotelBundle;
    upsertUpdatedData();
  } catch (e) {
    console.error(e);
    error.value = e as string;
  }
}

async function addGenericBundleProduct() {
  try {
    const repo = data.repository("ce_generic_bundle");
    const newBundle = await repo.create();
    if (newBundle === null || !entityData.value) {
      throw new Error("Could not create new generic bundle");
    }
    await repo.save(newBundle);
    newBundle.availableOnMinParentQuantity = 1;
    entityData.value.additionalProducts = newBundle;
    upsertUpdatedData();
  } catch (e) {
    console.error(e);
    error.value = e as string;
  }
}

async function fetchData(
  pid: string,
): Promise<Entity<"ce_travel_product_config"> | null | undefined> {
  try {
    isLoading.value = true;
    const criteria = new data.Classes.Criteria();
    const associations = [
      "hotelBundle",
      "additionalProducts",
      "additionalProducts.parentProducts",
      "additionalProducts.bundleProducts",
      "additionalProducts.bundleProducts.parentProducts",
      "additionalProducts.bundleProducts.productOptions",
      "childDiscount",
      "hotelBundle.roomOptions",
      "hotelBundle.roomOptions.roomProduct",
      "hotelBundle.roomOptions.additionalProducts",
      "hotelBundle.roomOptions.additionalProducts.parentProducts",
      "hotelBundle.roomOptions.additionalProducts.bundleProducts",
      "hotelBundle.roomOptions.additionalProducts.bundleProducts.parentProducts",
      "hotelBundle.roomOptions.additionalProducts.bundleProducts.productOptions",
      "hotelBundle.roomOptions.roomSaleRule",
      "hotelBundle.roomOptions.roomSaleRule.supplementRule",
      "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProduct",
    ];
    associations.forEach((association) => {
      criteria.addAssociation(association);
    });
    criteria.addFilter(data.Classes.Criteria.equals("productId", pid));
    const repo = data.repository("ce_travel_product_config");
    const repoSearchResult = await repo.search(criteria);

    const firstResult = repoSearchResult?.first();
    return firstResult;
  } catch (e) {
    console.error(e);
    error.value = e as string;
    return null;
  } finally {
    isLoading.value = false;
  }
}
async function createData(pid: string) {
  try {
    const repo = data.repository("ce_travel_product_config");
    const newEntity = await repo.create();
    if (newEntity === null) {
      throw new Error("Could not create new entity");
    }
    newEntity.productId = pid;
    await repo.save(newEntity);
    return await fetchData(pid);
  } catch (e) {
    console.error(e);
    error.value = e as string;
    return null;
  }
}
async function deleteDataFromRepo() {
  try {
    isLoading.value = true;
    const repo = data.repository("ce_travel_product_config");
    if (!entityData.value) {
      throw new Error("No entity data found");
    }
    await repo.delete(entityData.value.id);
    entityData.value = undefined;
    const newData = await createData(productId.value as string);
    if (!newData) {
      throw new Error("Could not create new entity data");
    }
    entityData.value = newData;
    notification.dispatch({
      title: "Success",
      message: "Configuration deleted",
    });
  } catch (e) {
    console.error(e);
    error.value = e as string;
  } finally {
    isLoading.value = false;
  }
}

async function upsertUpdatedData() {
  try {
    isLoading.value = true;
    const repo = data.repository("ce_travel_product_config");
    if (!entityData.value) {
      throw new Error("No entity data found");
    }
    await repo.save(entityData.value);
    const newData = await fetchData(productId.value as string);
    if (!newData) {
      throw new Error("Could not fetch updated entity data");
    }
    entityData.value = newData;
    notification.dispatch({
      title: "Success",
      message: "Configuration saved successfully",
    });
  } catch (e) {
    console.error(e);
    notification.dispatch({
      title: "Error",
      message: "Failed to save configuration. Please try again.",
    });
    error.value = e as string;
  } finally {
    isLoading.value = false;
  }
}
// Add this function to prevent scroll jumps
function handleTabChange(tabId: string) {
  // Prevent default scroll behavior
  const currentScrollPosition = window.scrollY;
  activeTab.value = tabId;

  // Use setTimeout to maintain scroll position after DOM update
  setTimeout(() => {
    window.scrollTo({
      top: currentScrollPosition,
      behavior: "instant",
    });
  }, 0);
}
</script>

<template>
  <div class="ewt-container">
    <div class="ewt-app-header">
      <h3>Travel Product Configuration</h3>
    </div>

    <div class="ewt-flex top-bar">
      <div class="ewt-button-group primary-actions">
        <button @click="upsertUpdatedData" class="ewt-btn ewt-btn--primary">
          Save Changes
        </button>
        <button @click="deleteDataFromRepo" class="ewt-btn ewt-btn--danger">
          Delete Configuration
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="ewt-loading">Loading configuration...</div>

    <div v-else-if="error" class="ewt-error">
      {{ error }}
    </div>

    <div v-else-if="entityData" class="ewt-section">
      <div class="ewt-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="ewt-tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="handleTabChange(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="ewt-tab-content">
        <div v-if="activeTab === 'hotel'" class="ewt-tab-pane">
          <div v-if="entityData.hotelBundle">
            <HotelBundle
              @update:data="upsertUpdatedData"
              :inheritedData="entityData.hotelBundle"
            />
          </div>
          <div v-else class="ewt-empty-state">
            <p>No hotel bundle configured</p>
            <button @click="addHotelBundle" class="ewt-btn ewt-btn--secondary">
              Add Hotel Bundle
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'generic'" class="ewt-tab-pane">
          <div v-if="entityData.additionalProducts">
            <GenericBundle
              @update:data="upsertUpdatedData"
              :inheritedData="entityData.additionalProducts"
            />
          </div>
          <div v-else class="ewt-empty-state">
            <p>No additional products configured</p>
            <button
              @click="addGenericBundleProduct"
              class="ewt-btn ewt-btn--secondary"
            >
              Add Additional Products
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'child'" class="ewt-tab-pane">
          <div v-if="entityData.childDiscount">
            <ChildDiscount
              @update:data="upsertUpdatedData"
              :inheritedData="entityData.childDiscount"
            />
          </div>
          <div v-else class="ewt-empty-state">
            <p>No child discount configured</p>
            <button
              @click="addChildDiscount"
              class="ewt-btn ewt-btn--secondary"
            >
              Add Child Discount
            </button>
          </div>
        </div>
      </div>
    </div>

    <pre>{{ entityData }}</pre>
  </div>
</template>

<style scoped>
.top-bar {
  justify-content: space-between;
  margin: 20px 0;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  gap: 16px;
}

.ewt-button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.primary-actions {
  flex-shrink: 0;
}

.icon {
  margin-right: 6px;
}

.ewt-tabs {
  display: flex;
  gap: 4px;
  padding: 0 4px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.ewt-tab-button {
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ewt-tab-button:hover {
  color: #4f46e5;
}

.ewt-tab-button.active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
}

.tab-icon {
  font-size: 16px;
}

.ewt-tab-content {
  position: relative;
  min-height: 300px;
  overflow: visible;
}

.ewt-tab-pane {
  position: relative;
}

.ewt-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* Make the debug output collapsible and styled */
pre {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: auto;
  margin-top: 24px;
  font-size: 12px;
  color: #374151;
}
</style>
