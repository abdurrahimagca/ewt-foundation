<script lang="ts" setup>
import { data } from "@shopware-ag/meteor-admin-sdk";
import { defineProps, ref, watch, defineEmits } from "vue";

const props = defineProps<{
  initialProduct?:
    | EntitySchema.Entities["product"][]
    | EntitySchema.Entities["product"];
  mode?: "single" | "multiple";
}>();

const emit = defineEmits<{
  (
    e: "update:initialProduct",
    value:
      | EntitySchema.Entities["product"][]
      | EntitySchema.Entities["product"],
  ): void;
}>();

const nameToSearch = ref<string | null | undefined>(undefined);
const selectables = ref<EntitySchema.Entities["product"][]>([]);
const selecteds = ref<EntitySchema.Entities["product"][]>([]);
const isDropdownOpen = ref(false);
const error = ref<string | undefined>(undefined);
const isFrozen = ref(false);

if (props.initialProduct) {
  if (Array.isArray(props.initialProduct)) {
    selecteds.value = props.initialProduct;
  } else {
    selecteds.value = [props.initialProduct];
  }
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
  if (isFrozen.value) return;
  selecteds.value = selecteds.value.filter(
    (product) => product.id !== productId,
  );
}

function addToSelecteds(product: EntitySchema.Entities["product"]) {
  if (isFrozen.value) return;
  if (props.mode === "single") {
    selecteds.value = [product];
  } else if (!selecteds.value.some((p) => p.id === product.id)) {
    selecteds.value.push(product);
  }
  nameToSearch.value = "";
  selectables.value = [];
  isDropdownOpen.value = false;
}

function handleInputFocus() {
  if (isFrozen.value) return;
  isDropdownOpen.value = true;
}

function commitChanges() {
  if (!props.initialProduct) {
    throw new Error("initialProduct is not defined");
  }
  isFrozen.value = true;
  const result = props.mode === "single" ? selecteds.value[0] : selecteds.value;
  emit("update:initialProduct", result);
}

function toggleEditState() {
  isFrozen.value = false;
}

watch(nameToSearch, () => {
  if (!isFrozen.value) {
    searchProduct();
  }
});
</script>

<template>
  <div class="product-selection-wrapper">
    <div class="product-selection" :class="{ frozen: isFrozen }">
      <div class="selected-tags-wrapper">
        <div class="selected-tags" v-if="selecteds.length > 0">
          <div v-for="product in selecteds" :key="product.id" class="tag">
            {{ product.name }}
            <button
              v-if="props.mode === 'multiple' && !isFrozen"
              class="remove-tag"
              @click="removeSelected(product.id)"
            >
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
          :disabled="isFrozen"
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
      <div v-if="selecteds.length > 0">
        <button v-if="!isFrozen" @click="commitChanges">Commit Changes</button>
        <button v-else class="edit-button" @click="toggleEditState">
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-selection-wrapper {
  min-height: 100px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, sans-serif;
}

.product-selection {
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.product-selection.frozen {
  opacity: 0.6;
  pointer-events: none;
}

.product-selection.frozen .edit-button {
  pointer-events: auto; /* Allow interaction with the Edit button */
  opacity: 1; /* Ensure the Edit button is fully visible */
}

.selected-tags-wrapper {
  max-height: 100px;
  overflow-y: auto;
  padding: 4px 0;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: #f0f7ff;
  color: #0066cc;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #cce4ff;
  transition: all 0.2s ease;
}

.tag:hover {
  background-color: #e5f1ff;
}

.remove-tag {
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  padding: 0 2px;
  font-size: 16px;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.remove-tag:hover {
  opacity: 1;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background-color: #f8f9fa;
}

.search-input:focus {
  border-color: #0066cc;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.search-input:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.dropdown-container {
  position: relative;
  width: 100%;
  flex-shrink: 0;
  margin-bottom: 8px;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
}

.options-list {
  padding: 6px 0;
}

.option {
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.option:hover {
  background-color: #f0f7ff;
}

.option.selected {
  background-color: #e5f1ff;
  color: #0066cc;
  font-weight: 500;
}

.error-message {
  color: #dc3545;
  padding: 12px 16px;
  font-size: 14px;
  background-color: #fff5f5;
  border-radius: 6px;
}

.no-results {
  padding: 12px 16px;
  color: #666;
  font-size: 14px;
  text-align: center;
}

button {
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background-color: #0052a3;
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
