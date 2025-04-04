<script lang="ts" setup>
import { useTravelProductConfigStore } from "../../store/useTravelProductBundleStore";
import { storeToRefs } from "pinia";
import ProductSelection from "../common/ProductSelection.vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { data } from "@shopware-ag/meteor-admin-sdk";
import EntityCollection, {
  ApiContext,
} from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
const store = useTravelProductConfigStore();
const { entityData } = storeToRefs(store);

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
    bundle.parentProducts = products as EntityCollection<"product">;
  } catch (e) {
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
    bundle.productOptions.getIds().forEach((id) => {
      if (!bundle.productOptions) {
        throw new Error("Bundle productOptions not found");
      }
      const isSuccess = bundle.productOptions.remove(id);
      console.log("isSuccess", isSuccess);
      console.log("after remove", JSON.stringify(bundle.productOptions.total));
      if (!isSuccess) {
        throw new Error("Bundle productOptions not found");
      }
    });
    products.forEach((product) => {
      if (!bundle.productOptions || !product.__identifier__ || !product) {
        throw new Error("Bundle productOptions not found");
      }

      bundle.productOptions.add(product);
      console.log("after add", JSON.stringify(bundle.productOptions.total));
    });
  } catch (e) {
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
