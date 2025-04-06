<script lang="ts" setup>
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { onMounted, computed } from "vue";
import { useTravelProductConfig } from "../store/useTravelProductConfig";

const store = useTravelProductConfig();
const itemsPerPage = 10;

const paginatedData = computed(() => store.dataToOverview || []);
const currentPage = computed(() => store.currentPage || 1);
const totalPages = computed(() =>
  Math.ceil((store.totalCount || 0) / itemsPerPage),
);

const toggleEdit = (id: string) => {
  try {
    store.setResource(id);
  } catch (e) {
    console.error("Error toggling edit mode:", e);
  }
};

const fetchData = async (page: number) => {
  try {
    const criteria = new data.Classes.Criteria();
    criteria.setLimit(itemsPerPage);
    criteria.setPage(page);
    criteria.addAssociation("productsToApply");
    criteria.addAssociation("productsToApply.productOptions");
    await store.searchResources(criteria);
  } catch (e) {
    console.error("Error fetching data:", e);
    notification.dispatch({
      title: "Error",
      message: "Failed to fetch data",
      appearance: "notification",
      variant: "error",
    });
  }
};

const changePage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  await fetchData(page);
};

const createResource = async () => {
  try {
    await store.createNewResource();
    await fetchData(1);
  } catch (e) {
    console.error("Error creating resource:", e);
  }
};

const deleteResource = async (id: string) => {
  try {
    await store.deleteResource(id);
    if (currentPage.value > 1 && paginatedData.value.length === 1) {
      await changePage(currentPage.value - 1);
    } else {
      await fetchData(currentPage.value);
    }
  } catch (e) {
    console.error("Error deleting resource:", e);
  }
};

onMounted(async () => {
  if (!store.dataToOverview) {
    await fetchData(1);
  }
});
</script>

<template>
  <div class="ewt-container">
    <div class="ewt-content">
      <div class="ewt-table-header">
        <h2 class="ewt-title">Travel Product Configurations</h2>
        <button class="ewt-button ewt-button--primary" @click="createResource">
          <i class="fas fa-plus"></i> Create New Resource
        </button>
      </div>

      <table class="ewt-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product Number</th>
            <th>Configuration ID</th>
            <th>Variant Aware</th>
            <th>Meta Information</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedData" :key="item.id">
            <td class="ewt-product-display">
              <span class="ewt-product-name">
                {{
                  item.productsToApply?.productOptions?.first()?.name || "No Product Selected"
                }}
              </span>
            </td>
            <td>{{ item.productsToApply?.productOptions?.first()?.productNumber || "N/A" }}</td>
            <td>{{ item.id }}</td>
            <td>
              <span
                :class="[
                  'ewt-badge',
                  item.variantAware ? 'ewt-badge--success' : 'ewt-badge--info',
                ]"
              >
                {{ item.variantAware ? "Yes" : "No" }}
              </span>
            </td>
            <td class="ewt-meta-info">
              {{ item.configurationName || "No Config name" }}
              {{ item.configurationIdentifier || "No Config ID" }}
            </td>
            <td class="ewt-actions">
              <button
                class="ewt-button ewt-button--edit"
                @click="toggleEdit(item.id)"
              >
                <i class="fas fa-edit"></i> Edit
              </button>
              <button
                class="ewt-button ewt-button--delete"
                @click="deleteResource(item.id)"
              >
                <i class="fas fa-trash"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="ewt-pagination">
        <button
          class="ewt-button"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <i class="fas fa-chevron-left"></i> Previous
        </button>
        <span class="ewt-pagination-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          class="ewt-button"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Next <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* All styles moved to global CSS */
</style>
