<script lang="ts" setup>
import { defineProps } from "vue";
import ProductSelection from "../common/ProductSelection.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";

const props = defineProps<{
  inheritedData?: EntitySchema.Entities["ce_generic_bundle_product"];
}>();

function handleParentProductChange(
  product:
    | EntitySchema.Entities["product"]
    | EntitySchema.Entities["product"][],
) {
  if (product instanceof Array) {
    throw new Error("Product must be a single product");
  }
  if (props.inheritedData) {
    props.inheritedData.parentProductId = product.id;
    props.inheritedData.parentProduct = product as Entity<"product">;
  }
}

function handleProductOptionsChange(
  products:
    | EntitySchema.Entities["product"]
    | EntitySchema.Entities["product"][],
) {
  if (!(products instanceof Array)) {
    throw new Error("Products must be an array");
  }
  if (props.inheritedData) {
    props.inheritedData.productOptions =
      products as EntityCollection<"product">;
  }
}
</script>

<template>
  <div v-if="inheritedData" class="ewt-card-detail">
    <div class="form-layout">
      <div class="ewt-grid-2">
        <p>
            For product level config use Shopware Config for each product. This is
            only for bundle settings
        </p>
        <div class="ewt-form-group">
          <label class="ewt-form-label">Is Required</label>
          <input
            v-model="inheritedData.isRequired"
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
          <label class="ewt-form-label">Match Travellers Count</label>
          <input
            v-model="inheritedData.matchTravellersCount"
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
          <label class="ewt-form-label">Parent Product</label>
          <div v-if="inheritedData.parentProduct">
            <ProductSelection
              mode="single"
              :initial-product="inheritedData.parentProduct"
              @update:initial-product="handleParentProductChange"
            />
          </div>

          <div class="ewt-form-group">
            <label class="ewt-form-label">Product Options</label>
            <ProductSelection
              mode="multiple"
              :initial-product="inheritedData.productOptions"
              @update:initial-product="handleProductOptionsChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
