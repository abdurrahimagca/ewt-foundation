<script lang="ts" setup>
import { defineProps, onMounted } from "vue";
import ProductSelection from "../common/ProductSelection.vue";
import EntityCollection, {
  ApiContext,
} from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { context, data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";

const props = defineProps<{
  inheritedData?: EntityCollection<"ce_generic_bundle_product">;
}>();
const emit = defineEmits<{
  (e: "update:data"): void;
}>();

async function handleParentProductChange(
  id: string,
  product: EntityCollection<"product"> | Entity<"product">,
) {
  try {
    if (!(product instanceof EntityCollection)) {
      throw new Error("Product must be an EntityCollection");
    }
    if (!(product instanceof Array)) {
      throw new Error("Product must be array");
    }
    if (product.some((p) => !p || !p.id)) {
      throw new Error("One of the products is invalid");
    }
    if (!props.inheritedData) {
      throw new Error("Inherited data is undefined");
    }
    const entity = props.inheritedData.get(id);
    if (entity == null) {
      throw new Error("Entity not found");
    }
    entity.parentProducts = product;
  //  await data.repository("ce_generic_bundle_product").save(entity);
    await data
      .repository("ce_generic_bundle_product")
      .saveAll(props.inheritedData);
    emit("update:data");
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
  products: EntityCollection<"product"> | Entity<"product">,
) {
  try {
    if (!(products instanceof EntityCollection)) {
      throw new Error("Products must be an EntityCollection");
    }
    if (!props.inheritedData) {
      throw new Error("Inherited data is undefined");
    }
    const entity = props.inheritedData.get(id);
    if (entity == null) {
      throw new Error("Entity not found");
    }
    entity.productOptions = products;
    await data.repository("ce_generic_bundle_product").save(entity);
    await data
      .repository("ce_generic_bundle_product")
      .saveAll(props.inheritedData);
    emit("update:data");
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
  <div class="ewt-button-group"></div>
</template>
