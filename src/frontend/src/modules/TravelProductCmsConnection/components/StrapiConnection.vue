<script setup lang="ts">
import useStrapi from "../composables/useStrapi";
import { ref, onMounted, watch } from "vue";
import { data, location } from "@shopware-ag/meteor-admin-sdk";

const strapi = useStrapi();
const {
  createOrFindCmsResourceForProductRequest,
  findCmsResourceForProductRequest,
  loading,
  error: strapiError,
} = strapi;

const productId = ref("");
const parentProductId = ref("");
const productName = ref("");
const productCreatedAt = ref("");
const editUrl = ref("");
const localError = ref("");

const loadCmsResource = async () => {
  localError.value = "";
  editUrl.value = "";

  const {
    success,
    data: strapiData,
    error: strapiErrorMsg,
  } = await findCmsResourceForProductRequest(
    productId.value,
    parentProductId.value,
    productName.value,
    productCreatedAt.value,
  );

  if (success && strapiData?.strapiUrl) {
    editUrl.value = strapiData.strapiUrl;
  } else {
    localError.value = strapiErrorMsg || "No CMS resource found";
  }
};

const showCreateForm = ref(false);
const isChildCanUseThisResource = ref(true);

const createCmsResource = async () => {
  localError.value = "";

  const {
    success,
    data: strapiData,
    error: strapiErrorMsg,
  } = await createOrFindCmsResourceForProductRequest(
    productId.value,
    parentProductId.value,
    isChildCanUseThisResource.value,
    productName.value,
    productCreatedAt.value,
  );

  if (success && strapiData?.strapiUrl) {
    editUrl.value = strapiData.strapiUrl;
    showCreateForm.value = false;
    // After creating, automatically refresh to show the found state
    await loadCmsResource();
  } else {
    localError.value = strapiErrorMsg || "Failed to create CMS resource";
  }
};

const showCreateResourceForm = () => {
  showCreateForm.value = true;
  localError.value = "";
};

const cancelCreate = () => {
  showCreateForm.value = false;
  isChildCanUseThisResource.value = true;
};

const openEditor = () => {
  if (editUrl.value) {
    window.open(editUrl.value, "_blank");
  }
};

onMounted(async () => {
  location.startAutoResizer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await data.get({
    id: "sw-product-detail__product",
    selectors: ["id", "parentId", "name"],
  });

  productId.value = result.id;
  parentProductId.value = result.parentId;
  productName.value = result.name || "";
  productCreatedAt.value = new Date().toISOString();

  await loadCmsResource();
  location.stopAutoResizer();
});
</script>

<template>
  <div class="strapi-connection">
    <div class="strapi-connection__header">
      <h1>CMS Content Management</h1>
      <p>productId: {{ productId }}</p>
      <p>parentProductId: {{ parentProductId }}</p>
      <p>productName: {{ productName }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="strapi-connection__loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      Loading...
    </div>

    <!-- Error State -->
    <div v-if="localError && !loading" class="strapi-connection__error">
      <i class="fa-solid fa-exclamation-triangle"></i>
      {{ localError }}
    </div>

    <!-- Content Area -->
    <div v-if="!loading" class="strapi-connection__content">
      <!-- Resource Found -->
      <div v-if="editUrl" class="strapi-connection__resource-found">
        <div class="strapi-connection__message">
          <i class="fa-solid fa-check-circle"></i>
          <p>CMS content found for this product</p>
        </div>

        <div class="strapi-connection__actions">
          <button
            @click="openEditor"
            class="strapi-connection__btn strapi-connection__btn--primary"
          >
            <i class="fa-solid fa-external-link-alt"></i>
            Edit Content in Strapi
          </button>

          <button
            @click="loadCmsResource"
            class="strapi-connection__btn strapi-connection__btn--secondary"
          >
            <i class="fa-solid fa-refresh"></i>
            Refresh
          </button>
        </div>
      </div>

      <!-- No Resource Found -->
      <div v-else class="strapi-connection__no-resource">
        <div v-if="!showCreateForm" class="strapi-connection__message">
          <i class="fa-solid fa-info-circle"></i>
          <p>No CMS content found for this product</p>
          <p>Would you like to create new CMS content?</p>
        </div>

        <!-- Create Form -->
        <div v-if="showCreateForm" class="strapi-connection__create-form">
          <h3>Create CMS Content</h3>
          <div class="strapi-connection__form-group">
            <label for="isChildCanUseThisResource">
              <input
                id="isChildCanUseThisResource"
                v-model="isChildCanUseThisResource"
                type="checkbox"
                class="strapi-connection__checkbox"
              />
              Child products can use this resource
            </label>
            <p class="strapi-connection__help-text">
              When enabled, child products will inherit this CMS content if they
              don't have their own.
            </p>
          </div>
        </div>

        <div class="strapi-connection__actions">
          <button
            v-if="!showCreateForm"
            @click="showCreateResourceForm"
            class="strapi-connection__btn strapi-connection__btn--create"
          >
            <i class="fa-solid fa-plus"></i>
            Create CMS Content
          </button>

          <template v-else>
            <button
              @click="createCmsResource"
              class="strapi-connection__btn strapi-connection__btn--create"
            >
              <i class="fa-solid fa-check"></i>
              Create Resource
            </button>

            <button
              @click="cancelCreate"
              class="strapi-connection__btn strapi-connection__btn--secondary"
            >
              <i class="fa-solid fa-times"></i>
              Cancel
            </button>
          </template>

          <button
            @click="loadCmsResource"
            class="strapi-connection__btn strapi-connection__btn--secondary"
          >
            <i class="fa-solid fa-refresh"></i>
            Refresh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.strapi-connection {
  padding: 20px;
  max-width: 100%;
}

.strapi-connection__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.strapi-connection__header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.strapi-connection__lang-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.strapi-connection__lang-selector label {
  font-weight: 500;
  color: #555;
}

.strapi-connection__select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.strapi-connection__select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.strapi-connection__loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  text-align: center;
  color: #666;
}

.strapi-connection__error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
  margin-bottom: 20px;
}

.strapi-connection__content {
  min-height: 200px;
}

.strapi-connection__actions {
  display: flex;
  gap: 10px;
}

.strapi-connection__btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.strapi-connection__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.strapi-connection__btn--primary {
  background: #007bff;
  color: white;
}

.strapi-connection__btn--primary:hover:not(:disabled) {
  background: #0056b3;
}

.strapi-connection__btn--secondary {
  background: #6c757d;
  color: white;
}

.strapi-connection__btn--secondary:hover:not(:disabled) {
  background: #545b62;
}

.strapi-connection__btn--create {
  background: #28a745;
  color: white;
  font-size: 16px;
  padding: 12px 20px;
}

.strapi-connection__btn--create:hover:not(:disabled) {
  background: #1e7e34;
}

.strapi-connection__resource-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
  text-align: center;
}

.strapi-connection__no-resource {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
  text-align: center;
}

.strapi-connection__message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #666;
}

.strapi-connection__message i {
  font-size: 24px;
}

.strapi-connection__message i.fa-check-circle {
  color: #28a745;
}

.strapi-connection__message i.fa-info-circle {
  color: #007bff;
}

.strapi-connection__message p {
  margin: 0;
  font-size: 16px;
}

.strapi-connection__create-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  text-align: left;
  max-width: 400px;
}

.strapi-connection__create-form h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.strapi-connection__form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.strapi-connection__form-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
}

.strapi-connection__checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.strapi-connection__help-text {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}
</style>
