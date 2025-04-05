<script lang="ts" setup>
import { useTravelProductConfigStore } from "../../store/useTravelProductBundleStore";
import { storeToRefs } from "pinia";
import { data } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { notification } from "@shopware-ag/meteor-admin-sdk";
import NewProductSelector from "../common/NewProductSelector.vue";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
const store = useTravelProductConfigStore();
const { entityData } = storeToRefs(store);
async function addToCollection(
  collection: EntityCollection<"product">,
  item: Entity<"product">,
) {
  try {
    collection.add(item);
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "Failed to add product to collection",
      appearance: "system",
      variant: "error",
    });
  }
}
async function removeFromCollection(
  collection: EntityCollection<"product">,
  itemId: string,
) {
  try {
    if (!collection.remove(itemId)) {
      console.error("Failed to remove product from collection",  itemId, collection);
      throw new Error("Failed to remove product from collection");
    }
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "Failed to remove product from collection",
      appearance: "system",
      variant: "error",
    });
  }
}
</script>

<template>
  <div v-for="d in entityData?.genericBundles">
    <div v-if="d.parentProducts">
      <NewProductSelector
        :collection="d.parentProducts"
        @removeFromCollection="removeFromCollection(d.parentProducts, $event)"
        @addToCollection="addToCollection(d.parentProducts, $event)"
      />
    </div>

    <div v-if="d.productOptions">
      <NewProductSelector
        :collection="d.productOptions"
        @removeFromCollection="removeFromCollection(d.productOptions, $event)"
        @addToCollection="addToCollection(d.productOptions, $event)"
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
    <p>parent collection raw:</p>
    <pre>
    {{ JSON.stringify(d.parentProducts, null, 2) }}
  </pre
    >
    <p>product options collection raw:</p>
    <pre>
    {{ JSON.stringify(d.productOptions, null, 2) }}
  </pre
    >
  </div>
</template>
