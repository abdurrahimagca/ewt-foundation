<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import ProductSelection from "../common/ProductSelection.vue";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { watch } from "vue";

const props = defineProps<{
  inheritedData: Entity<"ce_generic_bundle">;
}>();



async function handleParentProductChange(
  products: EntityCollection<"product"> | Entity<"product">,
) {
  try {
    if (!(products instanceof EntityCollection)) {
      throw new Error("Product must be an EntityCollection");
    }
    if (!props.inheritedData) {
      throw new Error("Inherited data is undefined");
    }
    props.inheritedData.parentProducts = products;
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "An error occurred while updating the parent product.",
      variant: "error",
    });
    console.error(
      `Error on saving bundle product: with ${props.inheritedData.id}`,
      e,
    );
  }
}
async function handleBundleProductChange(
  products: EntityCollection<"product"> | Entity<"product">,
) {
  try {
    if (!(products instanceof EntityCollection)) {
      throw new Error("Product must be an EntityCollection");
    }
    if (!props.inheritedData) {
      throw new Error("Inherited data is undefined");
    }
    props.inheritedData.productOptions = products;
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "An error occurred while updating the parent product.",
      variant: "error",
    });
    console.error(
      `Error on saving bundle product: with ${props.inheritedData.id}`,
      e,
    );
  }
}
</script>

<template>
  <div v-if="inheritedData && inheritedData !== null" class="ewt-card-detail">
    <div class="ewt-section">
      <h3 class="ewt-section-title">Bundle Configuration</h3>
      <p class="ewt-subtitle">
        This is not a replacement for product rules but a way to configure
        <strong>product selection</strong> limits and options.
      </p>
      <ProductSelection
        mode="multiple"
        :initialProduct="inheritedData.parentProducts"
        @update:initialProduct="handleParentProductChange"
      />
      <ProductSelection
        mode="multiple"
        :initialProduct="inheritedData.productOptions"
        @update:initialProduct="handleBundleProductChange"
      />
      <div class="ewt-form-group">
        <label for="maxQuantity" class="ewt-form-label"
          >Available On Max Parent Quantity</label
        >
        <input
          id="maxQuantity"
          v-model="inheritedData.availableOnMaxParentQuantity"
          type="number"
          min="1"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="minQuantity" class="ewt-form-label"
          >Available On Min Parent Quantity</label
        >
        <input
          id="minQuantity"
          v-model="inheritedData.availableOnMinParentQuantity"
          type="number"
          min="1"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label">Is Parent Operator And?</label>
        <input
          v-model="inheritedData.isParentOperatorAnd"
          type="checkbox"
          class="ewt-checkbox"
        />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label">Match Parent Quantity</label>
        <input
          v-model="inheritedData.matchParentQuantity"
          type="checkbox"
          class="ewt-checkbox"
        />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label">Match Travellers</label>
        <input
          v-model="inheritedData.matchTravellers"
          type="checkbox"
          class="ewt-checkbox"
        />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label">Allow Multiple</label>
        <input
          v-model="inheritedData.allowMultipleSelection"
          type="checkbox"
          class="ewt-checkbox"
        />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label">Is Required</label>
        <input
          v-model="inheritedData.isRequired"
          type="checkbox"
          class="ewt-checkbox"
        />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label">Propaganda Text</label>
        <input
          v-model="inheritedData.propagandaText"
          type="text"
          class="ewt-input"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
}

.ewt-grid-2 {
  max-width: 800px;
}
</style>
