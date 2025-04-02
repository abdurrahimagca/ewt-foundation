<script lang="ts" setup>
import { defineProps, nextTick, onMounted } from "vue";
import ProductSelection from "../common/ProductSelection.vue";
import EntityCollection, {
  ApiContext,
} from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { context, data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";

const props = defineProps<{
  inheritedData: Entity<"ce_generic_bundle_product">;
}>();
const emit = defineEmits<{
  (e: "update:data"): void;
}>();

async function saveBundleProduct() {
  try {
    const repo = data.repository("ce_generic_bundle_product");
    if (!props.inheritedData) {
      throw new Error("Inherited data is undefined");
    }
    await repo.save(props.inheritedData);
    emit("update:data");
    notification.dispatch({
      title: "Success",
      message: "Bundle product saved successfully.",
      variant: "success",
    });
  } catch (e) {
    console.error("Error on saving bundle product:", e);
    notification.dispatch({
      title: "Error",
      message: "An error occurred while saving the bundle product.",
      variant: "error",
    });
  }
}

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
    const updated = EntityCollection.fromCollection(products);
    updated.forEach((product) => {
      if (!product.id || !props.inheritedData.id) {
        console.warn(JSON.stringify(updated, null, 2));
        throw new Error("aint no way ! this has no id");
      }
      product.ceGenericBundleProductParentProductsId = props.inheritedData.id;
    });

    props.inheritedData.parentProducts = updated;
    await data
      .repository("product")
      .saveAll(props.inheritedData.parentProducts);

    await data
      .repository("ce_generic_bundle_product")
      .save(props.inheritedData);
    emit("update:data");
    notification.dispatch({
      title: "Success",
      message: "Parent product updated successfully.",
      variant: "success",
    });
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
  products: EntityCollection<"product"> | Entity<"product">,
) {
  try {
    if (!(products instanceof EntityCollection)) {
      throw new Error("Products must be an EntityCollection");
    }

    const updated = EntityCollection.fromCollection(products);
    updated.forEach((product) => {
      if (!product.id || !props.inheritedData.id) {
        console.warn(JSON.stringify(updated, null, 2));
        throw new Error("aint no way ! this has no id");
      }
      product.ceGenericBundleProductProductOptionsId = props.inheritedData.id;
    });
    props.inheritedData.productOptions = updated;
    await data
      .repository("product")
      .saveAll(props.inheritedData.parentProducts);
    await data
      .repository("ce_generic_bundle_product")
      .save(props.inheritedData);

    emit("update:data");
    notification.dispatch({
      title: "Success",
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
  <p>is inheritedData null {{ inheritedData === null }}</p>
  <div v-if="inheritedData && inheritedData !== null" class="ewt-card-detail">
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
          <div v-if="inheritedData.parentProducts">
            <ProductSelection
              mode="multiple"
              :initial-product="inheritedData.parentProducts"
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
          <button
            class="ewt-button ewt-button--primary"
            @click="saveBundleProduct"
          >
            Save Bundle Product
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="ewt-button-group"></div>
</template>
