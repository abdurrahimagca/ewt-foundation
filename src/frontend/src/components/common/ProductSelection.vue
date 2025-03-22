<script lang="ts" setup>
import { data } from "@shopware-ag/meteor-admin-sdk";
import { defineProps, ref, watch, defineEmits } from "vue";

const props = defineProps<{
  initialProduct:
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
              title="Remove product"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div class="dropdown-container">
        <div class="search-input-wrapper">
          <svg
            class="search-icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 3a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM2 8.5a6.5 6.5 0 1 1 11.436 4.23l3.857 3.857a.75.75 0 0 1-1.061 1.061l-3.857-3.857A6.5 6.5 0 0 1 2 8.5z"
              fill="currentColor"
            />
          </svg>
          <input
            type="text"
            v-model="nameToSearch"
            placeholder="Search products..."
            @focus="handleInputFocus"
            class="search-input"
            :disabled="isFrozen"
          />
        </div>

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

      <div class="action-buttons" v-if="selecteds.length > 0">
        <button v-if="!isFrozen" @click="commitChanges" class="commit-button">
          Save Changes
        </button>
        <button v-else class="edit-button" @click="toggleEditState">
          Edit Selection
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-selection-wrapper {
  min-height: 120px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, system-ui, sans-serif;
  margin: 16px 0;
  width: 100%;
}

.product-selection {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.product-selection.frozen {
  opacity: 0.8;
  background-color: #f9fafb;
  pointer-events: none;
}

.product-selection.frozen .edit-button {
  pointer-events: auto;
  opacity: 1;
}

.selected-tags-wrapper {
  max-height: 150px;
  overflow-y: auto;
  padding: 4px 0;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background-color: #eef2ff;
  color: #4f46e5;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e0e7ff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.tag:hover {
  background-color: #e0e7ff;
}

.remove-tag {
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  padding: 2px 6px;
  font-size: 18px;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.remove-tag:hover {
  background-color: #4f46e5;
  color: white;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px 10px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background-color: #f9fafb;
}

.search-input:hover {
  background-color: #fff;
  border-color: #d1d5db;
}

.search-input:focus {
  background-color: #fff;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
}

.search-input::placeholder {
  color: #9ca3af;
}

.dropdown-container {
  position: relative;
  width: 100%;
  z-index: 100;
  box-sizing: border-box;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.options-list {
  padding: 8px 0;
}

.option {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #374151;
}

.option:hover {
  background-color: #f3f4f6;
}

.option.selected {
  background-color: #eef2ff;
  color: #4f46e5;
  font-weight: 500;
}

.error-message {
  color: #dc2626;
  padding: 16px;
  font-size: 14px;
  background-color: #fef2f2;
  border-radius: 8px;
  margin: 8px;
}

.no-results {
  padding: 16px;
  color: #6b7280;
  font-size: 14px;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.commit-button,
.edit-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.commit-button {
  background-color: #4f46e5;
  color: white;
}

.commit-button:hover {
  background-color: #4338ca;
}

.edit-button {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.edit-button:hover {
  background-color: #e5e7eb;
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  background-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Custom scrollbar for dropdown */
.dropdown-content::-webkit-scrollbar {
  width: 8px;
}

.dropdown-content::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.dropdown-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.search-input-wrapper:after {
  content: "";
  display: none;
}
</style>
