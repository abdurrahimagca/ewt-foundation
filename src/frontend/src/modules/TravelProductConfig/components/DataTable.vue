<script lang="ts" setup>
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { onMounted, computed } from "vue";
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { useSw } from "@/modules/shared/composables/useSw";

const store = useTravelProductConfig();
const itemsPerPage = 10;
const { cloneSwEntity } = useSw();
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
    criteria.addAssociation("applyProductsStream");
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
        <div>
          <h2 class="ewt-form-title">Travel Product Configurations</h2>
          <p class="ewt-badge ewt-badge--warning ewt-mt-2">
            <i class="fa-solid fa-triangle-exclamation"></i>
            Note: Updates functionality may be limited during this development
            phase
          </p>
        </div>
        <button
          @click="createResource"
          class="ewt-button ewt-button--primary ewt-button--lg"
        >
          <i class="fa-solid fa-plus"></i> Create New Resource
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="!paginatedData.length" class="ewt-loading">
        <i class="fa-solid fa-spinner fa-spin"></i> Loading configurations...
      </div>

      <!-- Table Content -->
      <div v-else class="ewt-card">
        <table class="ewt-table">
          <thead>
            <tr>
              <th>Product Stream</th>
              <th>Description</th>
              <th>Configuration ID</th>
              <th>Variant Aware</th>
              <th>Meta Information</th>
              <th class="ewt-px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedData" :key="item.id">
              <td class="ewt-product-display">
                <span class="ewt-product-name">
                  {{ item.applyProductsStream?.name || "No Product Selected" }}
                </span>
              </td>
              <td>
                <span class="ewt-meta-info">
                  {{ item.applyProductsStream?.description || "N/A" }}
                </span>
              </td>
              <td>
                <span class="ewt-badge ewt-badge--info">
                  {{ item.id }}
                </span>
              </td>
              <td class="ewt-meta-info">
                <div>{{ item.configurationName || "No Config name" }}</div>
                <div class="ewt-mt-1 ewt-text-secondary">
                  {{ item.configurationIdentifier || "No Config ID" }}
                </div>
              </td>
              <td>
                <div class="ewt-actions">
                  <button
                    class="ewt-button ewt-button--view ewt-button--sm"
                    @click="
                      async () => {
                        try {
                          await cloneSwEntity(
                            'ce_travel_product_config',
                            item.id,
                          );
                          notification.dispatch({
                            title: 'Success',
                            message: 'Resource cloned successfully',
                            appearance: 'notification',
                            variant: 'success',
                          });
                          await fetchData(1);
                        } catch (e) {
                          console.error('Error cloning resource:', e);
                          notification.dispatch({
                            title: 'Error',
                            message: 'Failed to clone resource',
                            appearance: 'notification',
                            variant: 'error',
                          });
                        }
                      }
                    "
                  >
                    <i class="fa-solid fa-copy"></i>
                  </button>
                  <button
                    class="ewt-button ewt-button--edit ewt-button--sm"
                    @click="toggleEdit(item.id)"
                  >
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button
                    class="ewt-button ewt-button--delete ewt-button--sm"
                    @click="deleteResource(item.id)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="ewt-pagination">
          <button
            class="ewt-button ewt-button--secondary"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            <i class="fa-solid fa-chevron-left"></i> Previous
          </button>
          <span class="ewt-pagination-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            class="ewt-button ewt-button--secondary"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Next <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* All styles moved to global CSS */
</style>
