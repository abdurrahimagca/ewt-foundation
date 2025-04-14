<script lang="ts" setup>
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { defineProps, ref, watch, defineEmits, onMounted } from "vue";
import { useSw } from "../composables/useSw";

const { saveSwEntityCollection } = useSw();

const props = defineProps<{
  maxLimit: number;
  minLimit: number;
}>();
const model = defineModel<EntityCollection<"product">>({ required: true });

const nameToSearch = ref<string | null | undefined>(undefined);
const selecteds = ref<Entity<"product">[]>([]);
const selectables = ref<Entity<"product">[]>([]);
const isDropdownOpen = ref(false);
const error = ref<string | undefined>(undefined);
const isFrozen = ref(false);
const hasUnsavedChanges = ref(false);
onMounted(() => {
  model.value.forEach((product) => {
    if (product.available && product !== undefined) {
      selecteds.value.push(product);
    }
  });
});

async function searchProduct() {
  if (!nameToSearch?.value?.trim()) {
    selectables.value = [];
    return;
  }
  try {
    const repo = data.repository("product");

    const criteria = new data.Classes.Criteria();
    criteria.addFilter(
      data.Classes.Criteria.multi("OR", [
        data.Classes.Criteria.contains("name", nameToSearch.value),
        data.Classes.Criteria.contains("productNumber", nameToSearch.value),
      ]),
    );
    criteria.addIncludes({
      product: ["name", "productNumber", "available", "id", "versionId"],
    });

    const repoSearchResult = await repo.search(criteria);

    const products: Entity<"product">[] = [];
    if (repoSearchResult === null) {
      throw new Error("No product found");
    }
    repoSearchResult.forEach((product) => {
      if (product.available && product !== undefined) {
        products.push(product);
      }
    });

    const parentIds = products.map((p) => p.id);

    if (parentIds.length > 0) {
      const childCriteria = new data.Classes.Criteria();
      childCriteria.addFilter(
        data.Classes.Criteria.equalsAny("parentId", parentIds),
      );

      const childResult = await repo.search(childCriteria);
      if (childResult === null) {
        throw new Error("No child product found");
      }
      childResult.forEach((child) => {
        if (child.available && child !== undefined) {
          products.push(child);
        }
      });
    }
    selectables.value = products;
  } catch (e) {
    error.value = (e as Error).message;
  }
}

function removeSelected(id: string) {
  if (isFrozen.value) return;
  if (!id) {
    throw new Error("Product ID is undefined");
  }
  if (selecteds.value.find((p) => p.id === id) === undefined) {
    throw new Error("Product not found in selecteds");
  }
  if (selecteds.value.length - 1 < props.minLimit) {
    notification.dispatch({
      title: "Info",
      message: `You need to select at least ${props.minLimit} products`,
      variant: "info",
    });
    return;
  }
  selecteds.value = selecteds.value.filter((p) => p.id !== id);
  model.value.remove(id);
  hasUnsavedChanges.value = true;
}

function addToSelecteds(p: Entity<"product">) {
  if (isFrozen.value) return;
  if (!p) {
    throw new Error("Product is undefined");
  }
  if (model.value.has(p.id)) {
    notification.dispatch({
      title: "error",
      message: "Product already selected",
    });
    return;
  }
  if (p._isNew) {
    notification.dispatch({
      title: "error",
      message: "Product is not saved yet",
    });
    return;
  }
  if (p.getEntityName() !== "product") {
    throw new Error("Product is not a product");
  }
  if (selecteds.value.length >= props.maxLimit) {
    notification.dispatch({
      title: "error",
      message: `You can only select ${props.maxLimit} products`,
    });
    return;
  }
  model.value.add(p);
  selecteds.value.push(p);
  hasUnsavedChanges.value = true;
  nameToSearch.value = "";
  selectables.value = [];
  isDropdownOpen.value = false;
}

function handleInputFocus() {
  if (isFrozen.value) return;
  isDropdownOpen.value = true;
}

async function commitChanges() {
  if (isFrozen.value) return;
  if (selecteds.value.length > props.maxLimit) {
    notification.dispatch({
      title: "error",
      message: `You need to select ${props.maxLimit} products`,
      variant: "error",
    });
    return;
  }
  if (selecteds.value.length < props.minLimit) {
    notification.dispatch({
      title: "error",
      message: `You need to select at least ${props.minLimit} products`,
      variant: "error",
    });
    return;
  }
  try {
   // await saveSwEntityCollection("product", model.value);
    hasUnsavedChanges.value = false;
    isFrozen.value = true;
  } catch (e) {
    notification.dispatch({
      title: "error",
      message: "Failed to save products",
    });
    console.log(model.value);
    console.error(e);
  }
}

function toggleEditState() {
  isFrozen.value = false;
}

function openProductDetail(productId: string) {
  const detailUrl = `http://ewt-shop.homelab-kaleici.space/admin#/sw/product/detail/${productId}/base`;
  window.open(detailUrl, "_blank");
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
      <p>
        Please note that product variants may be unnamed. We recommend using the
        Product Number for searching specific products.
      </p>
      <div class="selected-tags-wrapper">
        <div class="selected-tags" v-if="selecteds">
          <div v-for="product in selecteds" :key="product.id" class="tag">
            <span class="product-name">
              {{ product.name ? product.name : "__unnamed__" }} -
              {{ product.productNumber }}
            </span>
            <div class="tag-actions">
              <button
                class="info-button"
                @click.stop="openProductDetail(product.id)"
                title="View product details"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <button
                v-if="!isFrozen"
                class="remove-tag"
                @click.stop="removeSelected(product.id)"
                title="Remove product"
              >
                ×
              </button>
            </div>
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
            placeholder="Search name or product number"
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
              class="option"
              :class="{ selected: selecteds?.find((p) => p.id === product.id) }"
              @click="addToSelecteds(product)"
            >
              <span class="product-name">
                {{ product.name ? product.name : "__unnamed__" }} -
                {{ product.productNumber }}
              </span>
              <button
                class="info-button"
                @click.stop="openProductDetail(product.id)"
                title="View product details"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons" v-if="selecteds">
        <span v-if="hasUnsavedChanges" class="unsaved-changes">
          You have unsaved changes
        </span>
        <button
          v-if="!isFrozen"
          @click="commitChanges"
          class="commit-button"
          :class="{ 'has-changes': hasUnsavedChanges }"
        >
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
  justify-content: space-between;
  border: 1px solid #e0e7ff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.tag-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}

.product-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.info-button:hover {
  opacity: 1;
  background-color: rgba(79, 70, 229, 0.1);
}

.remove-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.remove-tag:hover {
  opacity: 1;
  background-color: rgba(79, 70, 229, 0.1);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.product-link {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

.product-link:hover {
  text-decoration: underline;
}

.add-product {
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  padding: 2px 8px;
  font-size: 18px;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.add-product:hover {
  background-color: #4f46e5;
  color: white;
}

.unsaved-changes {
  color: #9ca3af;
  font-size: 14px;
  font-style: italic;
}

.commit-button.has-changes {
  background-color: #059669;
}

.commit-button.has-changes:hover {
  background-color: #047857;
}
</style>
