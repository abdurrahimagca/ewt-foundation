<script lang="ts" setup>
import { useTravelProductConfigStore } from "../../store/useTravelProductBundleStore";
import { storeToRefs } from "pinia";
import ProductSelection from "../common/ProductSelection.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import EntityCollection, {
  ApiContext,
} from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
const store = useTravelProductConfigStore();
const { entityData } = storeToRefs(store);
async function removeParentProducts(bundle: Entity<"ce_generic_bundle">) {
  try {
    const ids = bundle.parentProducts?.getIds();
    if (!ids) {
      throw new Error("ID not found");
    }
    if (!entityData.value?.genericBundles) {
      throw new Error("genericBundles not found");
    }
    ids.map((id) => {
      if (!bundle.parentProducts) {
        throw new Error("Bundle parentProducts not found");
      }
      bundle.parentProducts.remove(id);
    });
    await data.repository("ce_generic_bundle").save(bundle);
  } catch (e) {
    notification.dispatch({
      title: "error",
      message: "Error while removing last parent product",
    });
    console.error(e);
  }
}
async function handleParentProductChange(
  products: Entity<"product">[],
  id: string,
) {
  try {
    if (!entityData.value?.genericBundles) {
      throw new Error("genericBundles not found");
    }
    const bundle = entityData.value.genericBundles.get(id);
    if (!bundle) {
      throw new Error("Bundle not found");
    }
    if (!bundle.parentProducts) {
      throw new Error("Bundle parentProducts not found");
    }
    if (products.length === 0) {
      throw new Error("No products selected");
    }
    products.forEach((product) => {
      if (product === undefined || product.getEntityName() !== "product") {
        throw new Error("Product is undefined");
      }
    });
    const collection = bundle.parentProducts;
    const es = new data.Classes.EntityCollection(
      collection.source,
      collection.entity,
      collection.context,
      collection.criteria,
      products,
    );
    bundle.parentProducts = es;
    await data.repository("product").saveAll(bundle.parentProducts);
    await data.repository("ce_generic_bundle").save(bundle);
  } catch (e) {
    notification.dispatch({
      title: "error",
      message: "Error while updating parent products",
    });
    console.error(e);
  }
}
async function handleProductOptionChange(
  products: Entity<"product">[],
  id: string,
) {
  try {
    if (!entityData.value?.genericBundles) {
      throw new Error("genericBundles not found");
    }
    const bundle = entityData.value.genericBundles.get(id);
    if (!bundle) {
      throw new Error("Bundle not found");
    }
    if (!bundle.productOptions || bundle.productOptions === undefined) {
      throw new Error("Bundle productOptions not found");
    }
    if (products.length === 0) {
      throw new Error("No products selected");
    }
    products.forEach((product) => {
      if (product === undefined || product.getEntityName() !== "product") {
        throw new Error("Product is undefined");
      }
    });
    const collection = bundle.productOptions;
    const es = new data.Classes.EntityCollection(
      collection.source,
      collection.entity,
      collection.context,
      collection.criteria,
      products,
    );
    bundle.productOptions = es;
    await data.repository("product").saveAll(bundle.productOptions);
    await data.repository("ce_generic_bundle").save(bundle);
    //await store.refreshState();
  } catch (e) {
    notification.dispatch({
      title: "error",
      message: "Error while updating product options",
    });

    console.error(e);
  }
}
</script>

<template>
  <div v-for="d in entityData?.genericBundles">
    <div v-if="d.isNew()">New Bundle</div>
    <div>ID: {{ d.id }}</div>
    <div v-if="d.parentProducts">
      <p>
        selecteds:
        {{
          d.parentProducts.map((p) => ({
            name: p.name,
            id: p.id,
          }))
        }}
      </p>
      <button
        v-if="d.parentProducts.getIds().length > 1"
        @click="removeParentProducts(d)"
        class="ewt-button ewt-button--primary"
      >
        Remove Last Parent Product
      </button>
      <ProductSelection
        @update:initial-product="handleParentProductChange($event, d.id)"
        :initial-product="d.parentProducts"
      />
    </div>
    <div v-if="d.productOptions">
      <p>
        selecteds:
        {{
          d.productOptions.map((p) => ({
            name: p.name,
            id: p.id,
          }))
        }}
      </p>
      <ProductSelection
        @update:initial-product="handleProductOptionChange($event, d.id)"
        :initial-product="d.productOptions"
      />
    </div>
    <div class="ewt-form-group">
      <label class="ewt-form-label">Available On Min Parent Quantity</label>
      <input
        v-model="d.availableOnMinParentQuantity"
        type="number"
        class="ewt-input"
      />
    </div>

    <div class="ewt-form-group">
      <label class="ewt-form-label">Available On Max Parent Quantity</label>
      <input
        v-model="d.availableOnMaxParentQuantity"
        type="number"
        class="ewt-input"
      />
    </div>

    <div class="rm-group">
      <label class="ewt-form-label">Is Parent Operator And?</label>
      <input
        v-model="d.isParentOperatorAnd"
        type="checkbox"
        class="ewt-checkbox"
      />
    </div>

    <div class="ewt-form-group">
      <label class="ewt-form-label">Match Parent Quantity</label>
      <input
        v-model="d.matchParentQuantity"
        type="checkbox"
        class="ewt-checkbox"
      />
    </div>

    <div class="ewt-form-group">
      <label class="ewt-form-label">Match Travellers</label>
      <input v-model="d.matchTravellers" type="checkbox" class="ewt-checkbox" />
    </div>

    <div class="ewt-form-group">
      <label class="ewt-form-label">Allow Multiple</label>
      <input
        v-model="d.allowMultipleSelection"
        type="checkbox"
        class="ewt-checkbox"
      />
    </div>

    <div class="ewt-form-group">
      <label class="ewt-form-label">Is Required</label>
      <input v-model="d.isRequired" type="checkbox" class="ewt-checkbox" />
    </div>

    <div class="ewt-form-group">
      <label class="ewt-form-label">Propaganda Text</label>
      <input v-model="d.propagandaText" type="text" class="ewt-input" />
    </div>
  </div>
</template>
