<script lang="ts" setup>
import { data } from "@shopware-ag/meteor-admin-sdk";

import { defineProps, ref, watch } from "vue";
const props = defineProps<{
  initialProduct?: EntitySchema.Entities["product"][];
}>();
const nameToSearch = ref<string | null | undefined>(undefined);
const selectables = ref<EntitySchema.Entities["product"][]>([]);
const selecteds = ref<EntitySchema.Entities["product"][]>([]);
const isDropdownOpen = ref(false);
const error = ref<string | undefined>(undefined);
if (props.initialProduct) {
  selecteds.value = props.initialProduct;
}

async function searchProduct() {
  if (!nameToSearch || !nameToSearch.value || nameToSearch.value === "") {
    selectables.value = [];
    return;
  }
  try {
    const repo = data.repository("product");
    const criteria = new data.Classes.Criteria();
    criteria.addFilter(
      data.Classes.Criteria.contains("name", nameToSearch.value),
    );
    const repoSearchResult = await repo.search(criteria);
    if (repoSearchResult === null || repoSearchResult.first() === null) {
      selectables.value = [];
      return;
    }
    selectables.value = repoSearchResult.filter((product) => product.available);
  } catch (e) {
    error.value = (e as Error).message;
  }
}

function removeSelected(productId: string) {
  selecteds.value = selecteds.value.filter(
    (product) => product.id !== productId,
  );
}

function addToSelecteds(product: EntitySchema.Entities["product"]) {
  if (!selecteds.value.some((p) => p.id === product.id)) {
    selecteds.value.push(product);
  }
  nameToSearch.value = "";
  selectables.value = [];
  isDropdownOpen.value = false;
}

function handleInputFocus() {
  isDropdownOpen.value = true;
}

watch(nameToSearch, () => {
  searchProduct();
});
</script>

<template>
  <div class="product-selection-wrapper">
    <div class="product-selection">
      <div class="selected-tags-wrapper">
        <div class="selected-tags" v-if="selecteds.length > 0">
          <div v-for="product in selecteds" :key="product.id" class="tag">
            {{ product.name }}
            <button class="remove-tag" @click="removeSelected(product.id)">
              ×
            </button>
          </div>
        </div>
      </div>

      <div class="dropdown-container">
        <input
          type="text"
          v-model="nameToSearch"
          placeholder="Search for products..."
          @focus="handleInputFocus"
          class="search-input"
        />

        <div v-if="isDropdownOpen" class="dropdown-content">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div
            v-else-if="selectables.length === 0 && nameToSearch"
            class="no-results"
          >
            No products found
          </div>

          <div v-else-if="selectables.length > 0" class="options-list">
            <div
              v-for="product in selectables"
              :key="product.id"
              @click="addToSelecteds(product)"
              class="option"
              :class="{ selected: selecteds.some((p) => p.id === product.id) }"
            >
              {{ product.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-selection-wrapper {
  height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.product-selection {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.selected-tags-wrapper {
  max-height: 150px;
  overflow-y: auto;
  padding: 8px 0;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dropdown-container {
  position: relative;
  width: 100%;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #189eff;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

/* Custom scrollbar styles for better appearance */
.dropdown-content::-webkit-scrollbar,
.selected-tags-wrapper::-webkit-scrollbar {
  width: 6px;
}

.dropdown-content::-webkit-scrollbar-track,
.selected-tags-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.dropdown-content::-webkit-scrollbar-thumb,
.selected-tags-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover,
.selected-tags-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Rest of the styles remain the same */
.options-list {
  padding: 4px 0;
}

.option {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.option:hover {
  background-color: #f5f5f5;
}

.option.selected {
  background-color: #e3f2fd;
  color: #189eff;
}

.tag {
  background-color: #e3f2fd;
  color: #189eff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.remove-tag {
  background: none;
  border: none;
  color: #189eff;
  cursor: pointer;
  padding: 0 2px;
  font-size: 16px;
  line-height: 1;
}

.remove-tag:hover {
  color: #0056b3;
}

.error-message {
  color: #dc3545;
  padding: 8px 12px;
}

.no-results {
  padding: 8px 12px;
  color: #666;
}
</style>
