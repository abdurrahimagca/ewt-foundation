<script lang="ts" setup>
import { data } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { onMounted, ref, computed } from "vue";
import { useDataStore } from "../store/useDataStore";

const entityDatas = ref<EntityCollection<"ce_travel_product_config"> | null>(
  null,
);
const store = useDataStore();

const currentPage = ref(1);
const itemsPerPage = 10;
const totalItems = ref(0);

const paginatedData = computed(() => {
  if (!entityDatas.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return entityDatas.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage);
});
const toggleEdit = (id: string) => {
  try {
    store.setResource(id);
    store.toggleEdit();
  } catch (e) {
    console.error("Error toggling edit mode:", e);
  }
};

const fetchData = async (page: number) => {
  const criteria = new data.Classes.Criteria();
  criteria.setLimit(itemsPerPage);
  criteria.setPage(page);
  criteria.addAssociation("product");

  const searchResult = await data
    .repository("ce_travel_product_config")
    .search(criteria);

  if (!searchResult) return;

  entityDatas.value = searchResult;
  totalItems.value = searchResult.total || 0;
};

const changePage = async (page: number) => {
  currentPage.value = page;
  await fetchData(page);
};
const createResource = async () => {
  try {
    const newResource = await data
      .repository("ce_travel_product_config")
      .create();

    if (!newResource) {
      console.error("Failed to create new resource");
      return;
    }
    newResource.variantAware = false;
    entityDatas.value?.add(newResource);
    await data.repository("ce_travel_product_config").save(newResource);
    await fetchData(1);
  } catch (e) {
    console.error("Error creating resource:", e);
  }
};
const deleteResource = async (id: string) => {
  try {
    const resource = await data.repository("ce_travel_product_config").get(id);
    if (!resource) {
      console.error("Resource not found");
      return;
    }
    await data.repository("ce_travel_product_config").delete(resource.id);
    await fetchData(currentPage.value);
  } catch (e) {
    console.error("Error deleting resource:", e);
  }
};
onMounted(async () => {
  await fetchData(1);
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
            <th>Configuration ID</th>
            <th>Variant Aware</th>
            <th>Meta Information</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedData" :key="item.id">
            <td>{{ item.product?.name || "N/A" }}</td>
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
              {{ item.metaInformation || "No meta information" }}
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
.ewt-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.ewt-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.ewt-table th,
.ewt-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.ewt-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  white-space: nowrap;
}

.ewt-table tr:hover {
  background-color: #f8f9fa;
}

.ewt-meta-info {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ewt-actions {
  display: flex;
  gap: 0.5rem;
  white-space: nowrap;
}

.ewt-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ewt-button--primary {
  background-color: #2c3e50;
  color: white;
}

.ewt-button--primary:hover {
  background-color: #34495e;
}

.ewt-button--edit {
  background-color: #3498db;
  color: white;
}

.ewt-button--edit:hover {
  background-color: #2980b9;
}

.ewt-button--delete {
  background-color: #e74c3c;
  color: white;
}

.ewt-button--delete:hover {
  background-color: #c0392b;
}

.ewt-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.ewt-pagination-info {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.ewt-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ewt-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.ewt-badge--success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.ewt-badge--info {
  background-color: #e3f2fd;
  color: #1565c0;
}
</style>
