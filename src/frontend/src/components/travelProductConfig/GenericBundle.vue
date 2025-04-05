<script lang="ts" setup>
import { useTravelProductConfigStore } from "../../store/useTravelProductBundleStore";
import { storeToRefs } from "pinia";
import { data } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { notification } from "@shopware-ag/meteor-admin-sdk";
import NewProductSelector from "../common/NewProductSelector.vue";
const store = useTravelProductConfigStore();
const { entityData } = storeToRefs(store);
async function removeFromProductOptions(
  bundle: Entity<"ce_generic_bundle">,
  id: string,
) {
  try {
    const ids = bundle.productOptions?.getIds();
    if (!ids) {
      throw new Error("Product options not found");
    }
    if (ids.length === 0) {
      throw new Error("Product options not found");
    }
    if (!ids.includes(id)) {
      throw new Error("Product could not remove");
    }
    if (!bundle.productOptions?.remove(id)) {
      console.log(
        "product could not remove on bundle bundle is ",
        JSON.stringify(bundle),
      );
      throw new Error("Product not found");
    }
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "Product not found",
    });
  }
}
async function removeFromParentProducts(
  bundle: Entity<"ce_generic_bundle">,
  id: string,
) {
  try {
    const ids = bundle.parentProducts?.getIds();
    if (!ids) {
      console.log("ids is null", ids);
      throw new Error("Product options not found");
    }
    if (ids.length === 0) {
      console.log("ids is empty", ids);
      throw new Error("Product options not found");
    }
    if (!ids.includes(id)) {
      console.log("ids does nıt include id", ids, id);
      throw new Error("Product could not remove");
    }
    if (!bundle.parentProducts?.remove(id)) {
      console.log(
        "product could not remove on bundle bundle is ",
        JSON.stringify(bundle),
      );
      throw new Error("Product not found");
    }
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "Product not found",
    });
  }
}
async function addToProductOptions(
  bundle: Entity<"ce_generic_bundle">,
  product: Entity<"product">,
) {
  try {
    bundle.productOptions?.add(product);
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "Product not found",
    });
  }
}
async function addToParentProducts(
  bundle: Entity<"ce_generic_bundle">,
  product: Entity<"product">,
) {
  try {
    bundle.parentProducts?.add(product);
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "Product not found",
    });
  }
}
async function commit(repoName: keyof EntitySchema.Entities, d: any) {
  try {
    await data.repository(repoName).save(d);
  } catch (e) {
    notification.dispatch({
      title: "Error",
      message: "Product not found",
    });
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
        <NewProductSelector
          :collection="d.parentProducts"
          @removeFromCollection="removeFromParentProducts(d, $event)"
          @addToCollection="addToParentProducts(d, $event)"
          @commitChanges="commit('ce_generic_bundle', d)"
        />
      </p>
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
      <NewProductSelector
        :collection="d.productOptions"
        @removeFromCollection="removeFromProductOptions(d, $event)"
        @addToCollection="addToProductOptions(d, $event)"
        @commitChanges="commit('ce_generic_bundle', d)"
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
