<script lang="ts" setup>
import { defineProps } from "vue";
import ProductSelection from "../common/ProductSelection.vue";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";

const props = defineProps<{
  inheritedData?: EntitySchema.Entities["ce_generic_bundle_product"][];
}>();
const emit = defineEmits<{
  (e: "update:data"): void;
}>();

async function handleParentProductChange(
  id: string,
  product:
    | EntitySchema.Entities["product"]
    | EntitySchema.Entities["product"][],
) {
  try {
    const opt = props.inheritedData?.find((opt) => opt.id === id);
    if (!opt) {
      throw new Error("Option not found");
    }
    if (!(product instanceof Array)) {
      throw new Error("Product must be array");
    }
    if (product.some((p) => !p || !p.id)) {
      throw new Error("One of the products is invalid");
    }

    if (opt) {
      const entities = product.map((item) => {
        return new data.Classes.Entity(item.id, "product", item);
      });
      entities.forEach((item) => {
        opt.parentProducts.add(item);
      });

      opt.parentProducts.getIds().forEach((item) => {
        if (!entities.find((entity) => entity.id === item)) {
          opt.parentProducts.remove(item);
        }
      });
      await data
        .repository("ce_generic_bundle_product")
        .save(opt as Entity<"ce_generic_bundle_product">);

      emit("update:data");
      notification.dispatch({
        title: "Parent Product Updated",
        message: "Parent product updated successfully.",
        variant: "success",
      });
    }
  } catch (e) {
    console.error("erroron bundle product parent product:", e);
    notification.dispatch({
      title: "Error",
      message: "An error occurred while updating the parent product.",
      variant: "error",
    });
  }
}

async function handleProductOptionsChange(
  id: string,
  products:
    | EntitySchema.Entities["product"]
    | EntitySchema.Entities["product"][],
) {
  try {
    const opt = props.inheritedData?.find((opt) => opt.id === id);
    if (!opt) {
      throw new Error("Option not found");
    }
    if (!(products instanceof Array)) {
      throw new Error("Product must be array");
    }
     if (products.some((p) => !p || !p.id)) {
      throw new Error("One of the products is invalid");
    }
    if (opt) {
      const entities = products.map((item) => {
        return new data.Classes.Entity(item.id, "product", item);
      });
      entities.forEach((item) => {
        opt.productOptions.add(item);
      });
      opt.productOptions.getIds().forEach((item) => {
        if (!entities.find((entity) => entity.id === item)) {
          opt.productOptions.remove(item);
        }
      });

      await data
        .repository("ce_generic_bundle_product")
        .save(opt as Entity<"ce_generic_bundle_product">);
      emit("update:data");
    }
    notification.dispatch({
      title: "Product Options Updated",
      message: "Product options updated successfully.",
      variant: "success",
    });
  } catch (e) {
    console.error("error on poptsion:", e);
    notification.dispatch({
      title: "Error",
      message: "An error occurred while updating the product options.",
      variant: "error",
    });
  }
}
</script>

<template>
  <div v-if="inheritedData" class="ewt-card-detail">
    <div v-for="(opt, index) in inheritedData" :key="index">
      <p>i have and id{{ opt.id }}</p>
      <div class="form-layout">
        <div class="ewt-grid-2">
          <p>
            For product level config use Shopware Config for each product. This
            is only for bundle settings
          </p>
          <div class="ewt-form-group">
            <label class="ewt-form-label">Is Required</label>
            <input
              v-model="opt.isRequired"
              type="checkbox"
              class="ewt-checkbox"
            />
          </div>

          <div class="ewt-form-group">
            <label class="ewt-form-label">Match Parent Quantity</label>
            <input
              v-model="opt.matchParentQuantity"
              type="checkbox"
              class="ewt-checkbox"
            />
          </div>

          <div class="ewt-form-group">
            <label class="ewt-form-label">Match Travellers Count</label>
            <input
              v-model="opt.matchTravellersCount"
              type="checkbox"
              class="ewt-checkbox"
            />
          </div>

          <div class="ewt-form-group">
            <label class="ewt-form-label">Allow Multiple</label>
            <input
              v-model="opt.allowMultipleSelection"
              type="checkbox"
              class="ewt-checkbox"
            />
          </div>

          <div class="ewt-form-group">
            <label class="ewt-form-label">Parent Product</label>
            <div v-if="opt.parentProducts">
              <ProductSelection
                mode="multiple"
                :initial-product="opt.parentProducts"
                @update:initial-product="
                  handleParentProductChange(opt.id, $event)
                "
              />
            </div>

            <div class="ewt-form-group">
              <label class="ewt-form-label">Product Options</label>
              <ProductSelection
                mode="multiple"
                :initial-product="opt.productOptions"
                @update:initial-product="
                  handleProductOptionsChange(opt.id, $event)
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
